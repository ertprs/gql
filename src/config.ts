import * as packageJson from '../package.json'
const isProduction = process.env.ENVIRONMENT === 'prod'

const config = {
  isProduction: isProduction,
  environment: process.env.ENVIRONMENT || null,
  databaseUrl: process.env.DATABASE_URL || null,
  domain: process.env.DOMAIN || null,
  port: process.env.PORT || 4000,
  version: packageJson.version,
  name: packageJson.name
}

console.warn('config', JSON.stringify(config, null, 2))

export default config
