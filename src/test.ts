import { getAll, insert, update } from './db/db'
import { Menu, Table } from './db/types'

async function main(): Promise<void> {
  await update<Menu>(Table.Menu, 'newId', { menuName: 'myNewMenu!' })
  // console.log(require('util').inspect(params, false, null, true))
}

main()