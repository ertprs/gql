import server from './server'
import config from './config'
server
  .listen({
    port: config.port,
  })
  .then(server => {
    console.log(`🚀 server listen at ${server.url}`)
    if (config.domain) {
      console.log(`🚀 server listen at ${config.domain}`)
    }
  })
