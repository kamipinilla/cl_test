import { getAll, insert, update } from './db/db'
import { getCategoriesForMenu } from './db/tables/menu'
import { Table } from './db/tables/types'
import { get } from './rest'

async function main(): Promise<void> {
  // await update<Menu>(Table.Menu, 'newId', { newAttr: 'hello' })
  const list = await getAll(Table.Product)
  console.log(list)
  // console.log(require('util').inspect(params, false, null, true))
}

main()