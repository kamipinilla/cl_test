import app from './src/app'
import { inspect } from 'util'

async function main(): Promise<void> {
  const menuReport = await app()
  console.log(inspect(menuReport, false, null, true))
}

main()
