import * as Sentry from '@sentry/node'
import '@sentry/tracing'
import packageJson from './package.json'

console.log(packageJson.name, packageJson.version)

Sentry.init({
  dsn: 'https://e169bf7472d6460c95c8b63440fd665f@o444387.ingest.sentry.io/5419227',
  tracesSampleRate: 1.0,
  enabled: true,
  debug: true,
  environment: 'development',
  release: `${packageJson.name}@v${packageJson.version}`,
})

const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'My First Test Transaction',
})

setTimeout(() => {
  try {
    throw new Error('eita')
  } catch (e) {
    Sentry.captureException(e)
  } finally {
    transaction.finish()
  }
}, 99)
