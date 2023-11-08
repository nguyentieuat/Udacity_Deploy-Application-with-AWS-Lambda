import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

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
  const response = await Axios.get(jwksUrl);
  const keys = response.data.keys;
  const signinKeys = keys.find(key => key.id === jwt.header.kid);
  logger.info('signinKeys', signinKeys);
  if(!signinKeys) {
    throw new Error('The JWKS did not contain any keys');
  }
  //get pem data
  const pemData = signinKeys.x5c[0];
  //convert pem data to cert
  const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;
  //verify token
  const verifiedToken = jsonwebtoken.verify(token, cert, {algorithms: ['RS256']})
  console.log('verifiedToken', verifiedToken);
  return verifiedToken;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
