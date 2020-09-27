import config from '../src/config'
import mysql, { Connection } from 'mysql'
import { red, blue, green, yellow } from 'chalk'

const INFO = blue('[INFO]')
const WARN = yellow('[WARN]')
const ERROR = red('[ERROR]')
const SUCCESS = green('[SUCCESS]')

async function connect(): Promise<Connection> {
  console.log(INFO, 'trying to connect to', config.databaseUrl)
  return new Promise((resolve, reject) => {
    try {
      const database = mysql.createConnection(config.databaseUrl)
      database.connect((err: Error) => {
        if (err) {
          reject(err)
        } else {
          resolve(database)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function sleep(milliseconds: number): Promise<void> {
  console.log(INFO, 'awaiting', milliseconds, 'milliseconds')
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

let attempts = 0

async function run(): Promise<void> {
  while (true) {
    await connect()
      .then(connection => {
        connection.end(() => null)
        console.log(SUCCESS, 'connected successfully')
        process.exit(0)
      })
      .catch(async e => {
        attempts++

        console.log(WARN, 'attempts', attempts, 'connect failed:', e.message)
        if (attempts >= 15) {
          console.log(ERROR, 'Tried to connect many times exiting with error')
          process.exit(1)
        }

        await sleep(5000)
      })
  }
}

run()
