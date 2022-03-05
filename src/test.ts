import { Table } from './db/dbConfig'
import { getAll } from './db/dynamo'

async function main(): Promise<void> {
  const result = await getAll(Table.CategoryProduct)
  console.log(require('util').inspect(result, false, null, true))
}

main()