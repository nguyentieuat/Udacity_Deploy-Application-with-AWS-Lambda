import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

/* Hard-coded certificate from Auth0 */
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJRUffkTft9kGzMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1xdHVxbnd0MHZzNzhvdWV4LnVzLmF1dGgwLmNvbTAeFw0yMzExMDcw
NzU5MjhaFw0zNzA3MTYwNzU5MjhaMCwxKjAoBgNVBAMTIWRldi1xdHVxbnd0MHZz
NzhvdWV4LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMQSQ7mzT+PZPhbgEtEOqcZgL80wZixmACQ7A4PZ26CN3v66sRKJneeepIxo
FSGg4AfP1w/UO+/jYoGN2Gl2RXR1dJv5oAsm5MOwgoL6w8rPJwNcRluAmN2rX+ov
u+63sGqlxad5w8Gapuc6GKHGMHG9Z2bTySmvG7uv+nrTS0t4bSu0VEJALRgbp7xI
G1IQ3h7S8K6LITN1XoH/VXi6YVWcQ9QxV6VQLwQfl3zz+3envFyy2G5/APtQRU7c
3BoqNClCqCROuhEdDJ+HUhxhmX+KAVs833alv0adJ3/DvY9VhpQy2s4hLbUQblZX
t3wjeGAyqdxNkBrzBBw5459OmTUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUbRZlW/zDhYrFp0mtv218VRyEzuAwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAHWa4OAmI+Dnou1VgpK+uAHo4QOzM3h6A+WfUvEJTE
MHWZg95SlXklNs69jP9utIbeuwpwlEt0eWHM5rMte2uuLQ38+4moZXbuP/WMPvCU
JIbleayvvxWLnykLLAPMU3yPN4DEFRtL1m2oNbRj3fHu3GxLvvzacJJXGCPstnvL
M9xYbny6cCBweWgR6oZ9nhPQs1GPTEpgaBGXxEEqUmYdLSiZajDu45N5Xwxdof0v
OY4Yihw6+PFNLFL/AFkldtJ76iDxgGNd0i2AZG1U0HfHKdi9/CpNkMuAA/cb+3c+
M0xXvRIxSEbi0+f9J8X7lK1y12TM5HlMApMJYu/td10N
-----END CERTIFICATE-----`

const logger = createLogger('auth')

const jwksUrl = 'https://dev-qtuqnwt0vs78ouex.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info("User was authorized", {
      userId: jwtToken.sub
    });

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']})
  return jwt;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
