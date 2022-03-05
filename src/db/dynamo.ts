import aws from 'aws-sdk'
import { getEnvVar } from '../env'
import { Obj } from '../utils'
import { Id, Table } from './types'
import { getAttrCount } from '../utils'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

aws.config.update({
  region: getEnvVar('AWS_REGION'),
  credentials: {
    accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
  }
})

const dynamo = new aws.DynamoDB.DocumentClient()
export default dynamo

const tableNames = new Map<Table, string>([
  [Table.Menu, getEnvVar('AWS_TABLE_MENU')],
  [Table.Category, getEnvVar('AWS_TABLE_CATEGORY')],
  [Table.Product, getEnvVar('AWS_TABLE_PRODUCT')],
  
  [Table.CategoryMenu, getEnvVar('AWS_TABLE_CATEGORY_MENU')],
  [Table.CategoryProduct, getEnvVar('AWS_TABLE_CATEGORY_PRODUCT')],
])

export function getTableName(table: Table): string {
  const tableName = tableNames.get(table)
  if (tableName !== undefined) {
    return tableName
  } else {
    throw Error(`Table name not found: ${table}`)
  }
}

export function getUpdateParams(table: Table, id: Id, update: Obj): DocumentClient.UpdateItemInput {
  if (getAttrCount(update) === 0) {
    throw Error("Can't generate params for empty update")
  }

  const valuePrefix = ':v'
  const attrs: Array<{ name: string, value: any }> = []
  for (const attrName in update) {
    const attrValue = update[attrName]
    attrs.push({
      name: attrName,
      value: attrValue,
    })
  }

  const updateExpression = getUpdateExpression(attrs, valuePrefix)
  const expressionAttributeValues = getExpressionAttributeValues(attrs, valuePrefix)
  
  return {
    TableName: getTableName(table),
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  }
}

function getUpdateExpression(attrs: Array<{ name: string, value: any }>, valuePrefix: string): string {
  let updateExpression = 'set'
  for (const [index, attr] of attrs.entries()) {
    updateExpression += ` ${attr.name} = ${valuePrefix}${index}`
    if (index !== attrs.length - 1) {
      updateExpression += ','
    }
  }
  return updateExpression
}

function getExpressionAttributeValues(attrs: Array<{ name: string, value: any }>, valuePrefix: string): Obj {
  const expressionAttributeValues: Obj = {}
  for (const [index, attr] of attrs.entries()) {
    const attrExpression = `${valuePrefix}${index}`
    expressionAttributeValues[attrExpression] = attr.value
  }
  return expressionAttributeValues
}