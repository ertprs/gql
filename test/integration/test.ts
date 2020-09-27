import server from '../../src/server'
import * as queries from '../../src/graphql/query'

import { createTestClient } from 'apollo-server-testing'

const { query } = createTestClient(server)

describe('integration tests', () => {
  describe('atendimentos', () => {
    it('query atendimentos should respond with data', async () => {
      expect.assertions(1)

      const response = await query({
        query: queries.ATENDIMENTOS,
      })

      expect(response).toStrictEqual(
        expect.objectContaining({
          data: {
            atendimentos: [],
          },
          errors: undefined,
        }),
      )
    })
  })
})
