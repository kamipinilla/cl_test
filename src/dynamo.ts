import aws from 'aws-sdk'
import { getEnvVar } from './env'

const region = getEnvVar('AWS_REGION')
const accessKeyId = getEnvVar('AWS_ACCESS_KEY_ID')
const secretAccessKey = getEnvVar('AWS_SECRET_ACCESS_KEY')

aws.config.update({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
})

const dynamo = new aws.DynamoDB.DocumentClient()
export default dynamo