import { AdapterError, Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/ea-bootstrap'
import { makeExecute } from '../../src/adapter'
import { TInputParameters } from '../../src/endpoint'
import * as endpoints from '../../src/endpoint'
import testPayload from '../../test-payload.json'

describe('execute', () => {
  const jobID = '1'

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await makeExecute()(req.testData as AdapterRequest<TInputParameters>, {})
        } catch (error) {
          const errorResp = Requester.errored(jobID, error as AdapterError)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})

describe('test-payload.json', () => {
  it('should contain all endpoints/aliases', () => {
    const endpointsWithAliases = Object.keys(endpoints)
      .map((e) => [...(endpoints[e as keyof typeof endpoints].supportedEndpoints || [])])
      .flat()
    endpointsWithAliases.forEach((alias) => {
      const requests = testPayload.requests as { endpoint?: string }[]
      const aliasedRequest = requests.find((req) => req?.endpoint === alias)
      expect(aliasedRequest).toBeDefined()
    })
  })
})
