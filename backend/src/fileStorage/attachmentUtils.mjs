import { PutObjectCommand, S3Client, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('fileStorage/attachmentUtils.mjs')

const s3Client = AWSXRay.captureAWSv3Client(new S3Client())
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function getUploadUrl(fileId) {

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileId
    })

    const uploadFileUrl = await getSignedUrl(s3Client, command, {
        expiresIn: urlExpiration
    })

    logger.info(`Obtained an uploadUrl = ${uploadFileUrl}`, { function: "getUploadUrl()" })
    return uploadFileUrl
}

export async function getAttachmentUrl(fileId) {
    const exists = await S3
        .headObject({
            Bucket: bucketName,
            Key: fileId,
        })
        .promise()
        .then(
            () => true,
            err => {
                if (err.code === 'NotFound') {
                    return false;
                }
                throw err;
            }
        );
    if (!exists) {
        return null;
    }
    return `https://${bucketName}.s3.amazonaws.com/${fileId}`
}