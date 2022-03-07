import aws from 'aws-sdk'
import { getEnvVar, Obj } from '../utils'
import { Table } from './tables/tables'
import { Id } from '../types'
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

const dynamoReservedWords = new Set<string>(['hidden'])

type ObjAttrs = Array<{ name: string, value: any }>
function toObjAttrs(object: Obj): ObjAttrs {
  const attrs: ObjAttrs = []
  for (const attrName in object) {
    const attrValue = object[attrName]
    attrs.push({
      name: attrName,
      value: attrValue,
    })
  }
  return attrs
}

export function getUpdateParams(table: Table, id: Id, update: Obj): DocumentClient.UpdateItemInput {
  if (getAttrCount(update) === 0) {
    throw Error("Can't generate params for empty update")
  }

  const attrs = toObjAttrs(update)

  const updateExpression = getUpdateExpression(attrs)
  const expressionAttributeValues = getExpressionAttributeValues(attrs)
  
  const params: DocumentClient.UpdateItemInput = {
    TableName: getTableName(table),
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  }

  if (attrs.some(attr => dynamoReservedWords.has(attr.name))) {
    addReservedAttributeNames(params, attrs)
  }

  return params
}

function addReservedAttributeNames(
  params: DocumentClient.UpdateItemInput | DocumentClient.QueryInput,
  attrs: ObjAttrs): void {
  const reservedAttributeNames: Obj = {}
  for (const attr of attrs) {
    const attrName = attr.name
    if (dynamoReservedWords.has(attrName)) {
      reservedAttributeNames[`#${attrName}`] = attrName
    }
  }
  params.ExpressionAttributeNames = reservedAttributeNames
}

const valuePrefix = ':v'

function getUpdateExpression(attrs: ObjAttrs): string {
  let updateExpression = 'set'
  for (const [index, attr] of attrs.entries()) {
    const attrName = attr.name
    let attrNameExpression = attrName
    if (dynamoReservedWords.has(attrName)) {
      attrNameExpression = `#${attrNameExpression}`
    }
    updateExpression += ` ${attrNameExpression} = ${valuePrefix}${index}`
    if (index !== attrs.length - 1) {
      updateExpression += ','
    }
  }
  return updateExpression
}

function getExpressionAttributeValues(attrs: ObjAttrs): Obj {
  const expressionAttributeValues: Obj = {}
  for (const [index, attr] of attrs.entries()) {
    const attrExpression = `${valuePrefix}${index}`
    expressionAttributeValues[attrExpression] = attr.value
  }
  return expressionAttributeValues
}

export function getQueryParams(table: Table, query: Obj): DocumentClient.QueryInput {
  if (getAttrCount(query) === 0) {
    throw Error("Can't generate params for empty query")
  }

  const attrs = toObjAttrs(query)

  const queryExpression = getQueryExpression(attrs)
  const expressionAttributeValues = getExpressionAttributeValues(attrs)
  
  const params: DocumentClient.QueryInput = {
    TableName: getTableName(table),
    FilterExpression: queryExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  }

  if (attrs.some(attr => dynamoReservedWords.has(attr.name))) {
    addReservedAttributeNames(params, attrs)
  }

  return params
}

function getQueryExpression(attrs: ObjAttrs): string {
  let updateExpression = ''
  for (const [index, attr] of attrs.entries()) {
    const attrName = attr.name
    let attrNameExpression = attrName
    if (dynamoReservedWords.has(attrName)) {
      attrNameExpression = `#${attrNameExpression}`
    }
    updateExpression += `${attrNameExpression} = ${valuePrefix}${index}`
    if (index !== attrs.length - 1) {
      updateExpression += ', '
    }
  }
  return updateExpression
}