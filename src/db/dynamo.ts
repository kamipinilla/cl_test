import aws from 'aws-sdk'
import { getTableName, Table } from './dbConfig'
import { getEnvVar } from '../env'
import { DObject } from './types'

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

export async function getAll(table: Table): Promise<DObject[]> {
  const tableName = getTableName(table)
  const response = await dynamo.scan({ TableName: tableName }).promise()
  // Kami: when does it return undefined?
  const list = response.Items
  return list as DObject[]
}