import { getAll, insert, update } from './db/db'
import { Menu, Table } from './db/types'

async function main(): Promise<void> {
  // await update<Menu>(Table.Menu, 'newId', { menuName: 'myNewMenu!' })
  const list = await getAll(Table.Product)
  console.log(list)
  // console.log(require('util').inspect(params, false, null, true))
}

main()