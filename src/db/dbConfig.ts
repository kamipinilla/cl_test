import { getEnvVar } from '../env'

export enum Table {
  Menu = 'Menu',
  Category = 'Category',
  Product = 'Product',

  CategoryMenu = 'CategoryMenu',
  CategoryProduct = 'CategoryProduct',
}

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