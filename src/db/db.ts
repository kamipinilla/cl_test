import dynamo, { getUpdateParams, getTableName } from './dynamo'
import { IdObject, Id } from '../types'
import { getAttrCount } from '../utils'
import { Table } from './tables/types'

export async function update<T extends IdObject>(table: Table, id: Id, update: Partial<T>): Promise<void> {
  if (update.id) {
    delete update.id
  }
  if (getAttrCount(update) === 0) return
  
  if (await exists(table, id)) {
    const updateParams = getUpdateParams(table,  id, update)
    await dynamo.update(updateParams).promise()
  } else {
    throw Error(`Object with id ${id} not found`)
  }
}

export async function get<T extends IdObject>(table: Table, id: Id): Promise<T> {
  const tableName = getTableName(table)
  const response = await dynamo.get({
    TableName: tableName,
    Key: { id },
  }).promise()
  const item = response.Item
  if (item !== undefined) {
    return item as T
  } else {
    throw Error(`Object with id ${id} not found`)
  }
}

export async function getAll<T extends IdObject>(table: Table): Promise<T[]> {
  const tableName = getTableName(table)
  const response = await dynamo.scan({
    TableName: tableName
  }).promise()
  // Kami: when does it return undefined?
  const items = response.Items
  return items as T[]
}

async function exists(table: Table, id: Id): Promise<boolean> {
  const tableName = getTableName(table)
  const response = await dynamo.get({
    TableName: tableName,
    Key: { id },
  }).promise()
  const item = response.Item
  return item !== undefined
}

export async function insert<T extends IdObject>(table: Table, object: T): Promise<void> {
  const tableName = getTableName(table)
  const id = object.id
  // Kami: add linter require await rule
  if (!await exists(table, id)) {
    await dynamo.put({
      TableName: tableName,
      Item: object,
    }).promise()
  } else {
    throw Error(`Duplicate id: ${id}`)
  }
}

export async function del(table: Table, id: Id): Promise<void> {
  const tableName = getTableName(table)
  if (await exists(table, id)) {
    await dynamo.delete({
      TableName: tableName,
      Key: { id },
    }).promise()
  } else {
    throw Error(`Object with id ${id} doesn't exist`)
  }
}