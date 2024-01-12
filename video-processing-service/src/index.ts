import express from 'express';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectory, uploadProcessedVideo } from './storage';

setupDirectory();

// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// const ffmpeg = require('fluent-ffmpeg');

// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(express.json());

app.post('/convert-video', async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received');
        }
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request: missing file name');
    }

    const inputVideoName = data.name;
    const outputVideoName = inputVideoName.split('.')[0] + '.avi';

    await downloadRawVideo(inputVideoName);

    try {
        await convertVideo(inputVideoName, outputVideoName);
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputVideoName),
            deleteProcessedVideo(outputVideoName)
        ]);
        console.error(err);
        return res.status(500).send('Internal Server Error: failed to convert video');
    }
    await uploadProcessedVideo(outputVideoName);

    await Promise.all([
        deleteRawVideo(inputVideoName),
        deleteProcessedVideo(outputVideoName)
    ]);

    return res.status(200).send('Conversion finished successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
