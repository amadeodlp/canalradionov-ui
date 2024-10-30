module.exports = {
  env: {
    poolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    orgId: process.env.NEXT_PUBLIC_ORG_ID,
  },
}
