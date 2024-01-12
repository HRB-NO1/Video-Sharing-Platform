import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const storage = new Storage();

const rawVideoBucketName = 'raw-videos-888263712';
const processedVideoBucketName = 'processed-videos-888263712';

const localRawVideoPath = './raw-videos/';
const localProcessedVideoPath = './processed-videos/';

export function setupDirectory() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(localRawVideoPath + rawVideoName)
        .toFormat('avi')
        .on('end', () => {
            console.log('Conversion finished successfully');
            // res.status(200).send('Conversion finished successfully');
            resolve();
        })
        .on('error', (err: Error) => {
            console.error('An error occurred: ' + err.message);
            // res.status(500).send('An error occurred: ' + err.message);
            reject(err);
        })
        .save(localProcessedVideoPath + processVideoName);
        });
}

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: localRawVideoPath + fileName });
    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath + fileName}.`);
}

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload(localProcessedVideoPath + fileName, { destination: fileName });
    console.log(`${localProcessedVideoPath + fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);
    await bucket.file(fileName).makePublic();    
}

function deleteFile(FilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(FilePath)) {
            fs.unlink(FilePath, (err) => {
                if (err) {
                    console.error('Failed to delete file' + FilePath + 'with error' + err.message);
                    reject(err);
                } else {
                    console.log('File' + FilePath + 'deleted');
                    resolve();
                }
            });
        } else {
            console.log('File' + FilePath + 'does not exist, no deletion needed');
            resolve();
        }
    });
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(localRawVideoPath + fileName);
}

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(localProcessedVideoPath + fileName);
}

function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log('Directory' + dirPath + 'created');
    }
}
