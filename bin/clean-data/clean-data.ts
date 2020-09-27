import config from '../../src/config'
import { DataSource } from '../data-source'

export async function cleanData(): Promise<void> {
  const dataSource = await DataSource.fromConnectionString(config.databaseUrl)
  let tables = await dataSource.tableNames(config.databaseUrl)
  tables = tables.filter(tableName => tableName !== '_Migration')

  await dataSource.truncateTables(tables)
}
