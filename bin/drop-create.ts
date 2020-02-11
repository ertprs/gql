
import { sync } from 'cross-spawn'
import credentials from '../src/config'
import { DataSource } from './data-source'

async function dropCreate(): Promise<void> {
  console.log(credentials)
  try {
    const dataSource = await DataSource.fromConnectionString(credentials.databaseUrl)
    const tables = await dataSource.tableNames(credentials.databaseUrl)
    await dataSource.dropTables(tables)
    await dataSource.createTableMigration()

    // Spawn NPM synchronously
    sync('rimraf', ['prisma/migrations'], { stdio: 'inherit' }) // remove migrações antigas
    sync('npm', ['run', 'generate-schema'], { stdio: 'inherit' }) // genre nova migração
    sync('npm', ['run', 'migrate'], { stdio: 'inherit' }) // aplica migração

    console.log('success')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

dropCreate()
