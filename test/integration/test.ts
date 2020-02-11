import server from '../../src/server'
import * as queries from '../../src/graphql/query'

import { createTestClient } from 'apollo-server-testing'

const { query } = createTestClient(server)

describe('integration tests', () => {
  describe('atendimentos', () => {
    it('query atendimentos should respond with data', async () => {
      expect.assertions(2)

      const response = await query({
        query: queries.ATENDIMENTOS
      })

      expect(response.data)
        .toMatchObject({
          atendimentos: []
        })

      expect(response.errors)
        .toBeUndefined()
    })
  })
})
