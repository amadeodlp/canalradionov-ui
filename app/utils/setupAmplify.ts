import { Amplify } from 'aws-amplify'

export const setupAmplify = () => {
  return Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.poolId || '',
        userPoolClientId: process.env.clientId || '',
      },
    },
  })
}
