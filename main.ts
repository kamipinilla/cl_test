import app from './src/app'
import { inspect } from 'util'

async function main(): Promise<void> {
  console.log('Started')
  const menuReport = await app()
  console.log('Menu Report')
  console.log(inspect(menuReport, false, null, true))
}

main()