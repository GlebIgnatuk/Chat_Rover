import * as functions from 'firebase-functions'

export const clickerMiniapp = functions
  .region('europe-west3')
  .runWith({ minInstances: 1, maxInstances: 1 })
  .https.onRequest(async (request, response) => {
    return import('./handler').then((m) => m.default({ request, response }))
  })
