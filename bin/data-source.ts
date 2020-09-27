import { Connection, createConnection } from 'promise-mysql'

function parse(url: string): Environment {
  const pattern = /^(?:([^:\\/?#\s]+):\/{2})?(?:([^@\\/?#\s]+)@)?([^\\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/
  const matches = url.match(pattern)
  const params: Environment = {}
  if (matches[5] !== undefined) {
    matches[5].split('&').map(function(x) {
      const a = x.split('=')
      params[a[0]] = a[1]
    })
  }

  return {
    protocol: matches[1],
    user: matches[2] !== undefined ? matches[2].split(':')[0] : undefined,
    password: matches[2] !== undefined ? matches[2].split(':')[1] : undefined,
    host: matches[3],
    hostname: matches[3] !== undefined ? matches[3].split(/:(?=\d+$)/)[0] : undefined,
    port: matches[3] !== undefined ? matches[3].split(/:(?=\d+$)/)[1] : undefined,
    segments: matches[4] !== undefined ? matches[4] : undefined,
  }
}

export class DataSource {
  private con: Connection
  constructor(con: Connection) {
    this.con = con
  }

  public static async fromConnectionString(connectionString: string): Promise<DataSource> {
    const connectionOptions = parse(connectionString)
    return new DataSource(await createConnection(connectionOptions))
  }

  async dropTable(table: string): Promise<void> {
    console.log('drop table ' + table)
    return this.con.query('drop table ' + table)
  }

  async truncateTable(table: string): Promise<void> {
    console.log('truncate table ' + table)
    return this.con.query('truncate table ' + table)
  }

  async enableForeignKeyChecks(): Promise<void> {
    return this.con.query('set session foreign_key_checks = 1')
  }

  async disableForeignKeyChecks(): Promise<void> {
    return this.con.query('set session foreign_key_checks = 0')
  }

  async truncateTables(tables: string[]): Promise<void> {
    await this.disableForeignKeyChecks()
    await Promise.all(tables.map(table => this.truncateTable(table)))
    await this.enableForeignKeyChecks()
  }

  async dropTables(tables: string[]): Promise<void> {
    await this.disableForeignKeyChecks()
    await Promise.all(tables.map(table => this.dropTable(table)))
    await this.enableForeignKeyChecks()
  }

  public async tableNames(databaseName: string): Promise<string[]> {
    const result = await this.con.query(
      'SELECT table_name as tableName FROM information_schema.tables WHERE table_schema = ?',
      [databaseName],
    )
    return result.map((data: { tableName: string }) => data.tableName)
  }

  async createTableMigration(): Promise<void> {
    const createTableMigration = `CREATE TABLE _Migration (
          revision INT(11) NOT NULL AUTO_INCREMENT,
          name TEXT NOT NULL COLLATE 'utf8_unicode_ci',
          datamodel LONGTEXT NOT NULL COLLATE 'utf8_unicode_ci',
          status TEXT NOT NULL COLLATE 'utf8_unicode_ci',
          applied INT(11) NOT NULL,
          rolled_back INT(11) NOT NULL,
          datamodel_steps LONGTEXT NOT NULL COLLATE 'utf8_unicode_ci',
          database_migration LONGTEXT NOT NULL COLLATE 'utf8_unicode_ci',
          errors LONGTEXT NOT NULL COLLATE 'utf8_unicode_ci',
          started_at DATETIME(3) NOT NULL,
          finished_at DATETIME(3) NULL,
          PRIMARY KEY (revision) USING BTREE
      )
      COLLATE='utf8_unicode_ci'
      ENGINE=InnoDB`

    console.log(createTableMigration)

    return this.con.query(createTableMigration)
  }
}

interface Environment {
  [key: string]: string
}
