const isProduction= process.env.ENVIRONMENT === 'prod'

const config = {
  isProduction: isProduction ,
  databaseUrl: process.env.DATABASE_URL,
  domain: process.env.DOMAIN,
  port: process.env.PORT || 4000
}

export default config
