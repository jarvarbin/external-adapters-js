import { adapter } from '../../src'
import testPayload from '../../test-payload.json'

describe('test-payload.json', () => {
  it('should contain all endpoints/aliases', () => {
    const endpointsWithAliases = adapter.endpoints.map((e) => [e.name, ...(e.aliases || [])]).flat()
    endpointsWithAliases.forEach((alias) => {
      const requests = testPayload.requests as { data: { endpoint?: string } }[]
      const aliasedRequest = requests.find((req) => req?.data?.endpoint === alias)
      expect(aliasedRequest).toBeDefined()
    })
  })
})
