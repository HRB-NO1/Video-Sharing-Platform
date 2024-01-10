import express from 'express';
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(express.json());

app.post('/convert-video', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        return res.status(400).send('Bad Request: Missing file path');
    }

    ffmpeg(inputFilePath)
        .toFormat('avi')
        .on('end', () => {
            console.log('Conversion finished successfully');
            res.status(200).send('Conversion finished successfully');
        })
        .on('error', (err: Error) => { // 明确指定 err 为 Error 类型
            console.error('An error occurred: ' + err.message);
            res.status(500).send('An error occurred: ' + err.message);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
