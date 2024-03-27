
var Minio = require('minio');
var util = require('util');
var { parseCookies } = require('nookies');

require("dotenv").config();


const fs = require('fs');

const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    useSSL: true,
    port: 443
})

const removeObjectAsync = util.promisify(minioClient.removeObject);


async function criaNovoBucket(userId) {

    const policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject"
                ],
                "Resource": `arn:aws:s3:::${userId}/*`
            }
        ]
    }

    await minioClient.makeBucket(`${userId}`, 'us-east-1', function (err) {
        if (err) return console.log('Error creating bucket.', err)
        console.log('Bucket created successfully in "us-east-1".')

        minioClient.setBucketPolicy(`${userId}`, JSON.stringify(policy), function (err) {
            if (err) return console.log('Error creating bucket.', err)
            console.log('Bucket policy set')
        })
    })


    return;
}

async function deletaBucket(userId) {
    await minioClient.removeBucket(`${userId}`, function (err) {
        if (err) return console.log('unable to remove bucket.')
        console.log('Bucket removed successfully.')
    })
}

function convert(model) {
    const hbjs = require('handbrake-js')
    const { nomeArquivoUpload, nomeArquivoUploadCompress, nomeArquivo, BUCKET_NAME, metaData, res } = model

    const options = {
        input: nomeArquivoUpload,
        output: nomeArquivoUploadCompress,
        preset: 'Very Fast 1080p30'
    }
    return hbjs.spawn(options)
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
            return res.send('error')
        })
        .on('progress', function (progress) {
            console.log(
                'Percent complete: %s, ETA: %s',
                progress.percentComplete,
                progress.eta
            )
        })
        .on('complete', async function () {
            console.log('Finished processing');

            await minioClient.putObject(`${BUCKET_NAME}`, `${nomeArquivo}`, fs.readFileSync(nomeArquivoUploadCompress), metaData, async function (err, etag) {
                if (err) {
                    return console.log(err.message)
                }
                else {
                    console.log("Convertido e salvo com sucesso!")
                    await res.io.emit(`upload_complete:${BUCKET_NAME}`)
                }
            })
            await fs.unlink(nomeArquivoUpload, () => { })
            await fs.unlink(nomeArquivoUploadCompress, () => { })
        })
}

async function uploadImage(req, res, next) {
    var ffmpeg = require('fluent-ffmpeg');
    const pathToFfmpeg = require("ffmpeg-static");
    ffmpeg.setFfmpegPath(pathToFfmpeg);
    const vids = /(\.mp4)$/i
    console.log('IO NODE => ', res.io)

    if (!req.file) return next();

    const BUCKET_NAME = await req.user ? await req.user._id : parseCookies(res).loggedUserId;;

    const data = req.file;
    const nomeArquivo = Date.now() + "." + data.originalname.split(".").pop();;
    const nomeArquivoUpload = './uploads/' + nomeArquivo
    const nomeArquivoUploadCompress = './uploads/' + 'compress_' + nomeArquivo
    console.log(nomeArquivo)
    const ehVideo = data.originalname.match(vids)

    const metaData = {
        'Content-Type': `${data.mimetype}`,
    }

    minioClient.bucketExists(`${BUCKET_NAME}`, function (err, exists) {
        if (err) {
            criaNovoBucket(BUCKET_NAME)
        }
    })
    if (ehVideo) {
        const model = {
            nomeArquivoUpload,
            nomeArquivoUploadCompress,
            nomeArquivo,
            BUCKET_NAME,
            metaData,
            res
        }
        await fs.writeFile('./uploads/' + nomeArquivo, data.buffer, (err) => { })
        convert(model)
        req.file.firebaseUrl = `https://s3-dc2.mspclouds.com/${BUCKET_NAME}/${nomeArquivo}`;

        next();

    }
    else {
        return await minioClient.putObject(`${BUCKET_NAME}`, `${nomeArquivo}`, data.buffer, metaData, async function (err, etag) {
            req.file.firebaseUrl = `https://s3-dc2.mspclouds.com/${BUCKET_NAME}/${nomeArquivo}`;
            await res.io.emit(`upload_complete:${BUCKET_NAME}`)
            next();
        })

    }
    // if(ehVideo) {

    // await fs.writeFile('./uploads/' + nomeArquivo, data.buffer, (err) => {})

    // return ffmpeg(nomeArquivoUpload)
    //     .output(`${nomeArquivoUploadCompress}`)
    //     // .videoBitrate('2M') // Taxa de bits de vídeo (2 Mbps)
    //     // .size('1920x1080') // Resolução 1080p
    //     .videoCodec('libx264') // Usar o codec de vídeo libx264 (H.264)
    //     .addOption('-b:v', '1500K') // Bitrate de vídeo de 981 Kbps
    //     .addOption('-profile:v', 'main') // Usar o perfil de formato Main@L4
    //     .addOption('-preset', 'veryfast') // Usar a configuração "veryfast"
    //     .addOption('-vf', 'scale=1280:-1')
    //     .fps(30) // Taxa de quadros de 30 FPS
    //     .noAudio()
    //     .on('error', function (err) {
    //         console.log('An error occurred: ' + err.message);
    //         return res.send('error')
    //     })
    //     .on('progress', function (progress) {
    //         console.log('... frames: ' + progress.frames);

    //     })
    //     .on('end', async function () {
    //         console.log('Finished processing');

    //         await minioClient.putObject(`${BUCKET_NAME}`, `${nomeArquivo}`, fs.readFileSync(nomeArquivoUploadCompress), metaData, function (err, etag) {
    //             if (err) {
    //                 return console.log(err.message)
    //             }
    //             else{
    //                 next()
    //             }
    //         })

    //         req.file.firebaseUrl = `https://s3-dc2.mspclouds.com/${BUCKET_NAME}/${nomeArquivo}`;
    //         await fs.unlink(nomeArquivoUpload, () => {})
    //         await fs.unlink(nomeArquivoUploadCompress, () => {})
    //         next();
    //     })
    //     .run();
    // }
    // else {
    //     return await minioClient.putObject(`${BUCKET_NAME}`, `${nomeArquivo}`, data.buffer, metaData, function (err, etag) {
    //         req.file.firebaseUrl = `https://s3-dc2.mspclouds.com/${BUCKET_NAME}/${nomeArquivo}`;
    //         next();
    //     })

    // }
    // return await minioClient.putObject(`${BUCKET_NAME}`, `${nomeArquivo}`, data.buffer, metaData, function (err, etag) {
    //     req.file.firebaseUrl = `https://s3-dc2.mspclouds.com/${BUCKET_NAME}/${nomeArquivo}`;
    //     next();
    // })
}

async function getTotalSpaceUsed(req, res, next) {

    // Lists files in the bucket
    const userId = await req.user ? await req.user._id : parseCookies(res).loggedUserId;
    let data = []
    let bucketList = {};
    let size = 0;

    minioClient.bucketExists(`${userId}`, function (err, exists) {
        if (err) {
            criaNovoBucket(userId)
        }
    })

    const stream = await minioClient.extensions.listObjectsV2WithMetadata(`${userId}`, '', true, '')

    await stream.on('data', function (obj) {
        data.push(obj);
    })
    stream.on('error', function (err) { console.log(err) })

    setTimeout(() => {
        data.forEach(files => {
            size += files.size
        })
        bucketList.size = humanFileSize(size)
        return res.json(bucketList.size);
    }, 4000);
}

function humanFileSize(bytes, si = true, dp = 1) {
    const fullBytes = bytes;
    const thresh = 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return { tamanho: bytes.toFixed(dp), unidade: units[u], bytes: fullBytes };
}

async function getFilesByUser(req, res, next) {
    const userId = await req.user ? await req.user._id : parseCookies(res).loggedUserId;
    let data = []
    const imgs = /(\.jpg|\.png|\.gif|\.jpeg)$/i
    const vids = /(\.mp4|\.mov|\.wmv|\.mpeg|\.avi)$/i

    minioClient.bucketExists(`${userId}`, function (err, exists) {
        if (err) {
            criaNovoBucket(userId)
        }
    })

    const stream = await minioClient.extensions.listObjectsV2WithMetadata(`${userId}`, '', true, '')

    await stream.on('data', function (obj) {
        data.push(obj)
        data.forEach((file, index) => {
            file.externalLink = `https://${process.env.S3_ENDPOINT}/${userId}/${file.name}`
            file.type = file.name.match(imgs) ? 'img' : file.name.match(vids) ? 'vid' : 'undefined';
            file.tamanho = humanFileSize(file.size)

        });
    })
    stream.on('error', function (err) { console.log(err) })

    setTimeout(() => {
        return res.json(data)
    }, 4000);

}


async function deleteImage(url, userId, next) {
    let urls = url
    if (urls.includes('https://s3-dc2.mspclouds.com')) {
        const refFromURL = getFileFromURL(urls)
        return await minioClient.removeObject(`${userId}`, `${refFromURL}`, function (err) {
            if (err) {
                return console.log('Unable to remove object', err)
            }
            return console.log('Removed the object')
        })
    }

}

async function deleteMultiple(urls, userId, next) {
    
    if (urls.includes('https://s3-dc2.mspclouds.com')) {
        const refFromURL = getFileFromURL(urls)
        return await minioClient.removeObject(`${userId}`, `${refFromURL}`, function (err) {
            if (err) {
                return console.log('Unable to remove object', err)
            }
            return console.log('Removed the object')
        })
    }
}

async function deleteGenerico(req, res, next, url) {
    let urls = url
    let userId = await req.user ? await req.user._id : parseCookies(res).loggedUserId;
    if (urls.includes('https://storage.googleapis')) {
        const refFromURL = getFileFromURL(urls)
        bucket.file(`${userId}/` + refFromURL).delete().then(() => {
            return "Deletado"
        }).catch(err => {
            console.log("Erro!", err.message);
            next();
        })
    }
}

const getFileFromURL = (fileURL) => {
    const fSlashes = fileURL.split('/');
    const fQuery = fSlashes[fSlashes.length - 1].split('?');
    const segments = fQuery[0].split('%2F');
    const fileName = segments.join('/');
    const fileNameWhiteSpace = fileName.replace('%20', ' ');
    return fileNameWhiteSpace;
}



module.exports = { uploadImage, deleteImage, deleteMultiple, getTotalSpaceUsed, getFilesByUser, deleteGenerico, criaNovoBucket, deletaBucket };