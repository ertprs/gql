import config from '../src/config'
import { blue } from 'chalk'
import { Client } from 'pg'
import { URL } from 'url'

const INFO = blue('[INFO]')

async function connect(): Promise<void> {
  const databaseUrl = new URL(config.databaseUrl)
  const databaseName = databaseUrl.pathname.replace(/^\//, '')

  const defaultDatabaseUrl = new URL(config.databaseUrl)
  defaultDatabaseUrl.pathname = ''

  console.log(INFO, 'defaultDatabaseUrl', defaultDatabaseUrl)

  const client = new Client(defaultDatabaseUrl.href)
  await client.connect()

  console.log(INFO, 'connected')

  await client.query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '${databaseName}'
    AND pid <> pg_backend_pid();
  `)

  await client.query(`DROP DATABASE IF EXISTS ${databaseName};`)
  await client.query(`CREATE DATABASE ${databaseName};`)
  await client.end()
  console.log(INFO, `successfully drop and create database ${databaseName}`)
}

async function run() {
  await connect()
}

run()
