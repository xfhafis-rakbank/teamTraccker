import { createClient, type SanityClient } from '@sanity/client'

// ✅ Explicitly type the client to unlock full type-safe methods
const sanityClient: SanityClient = createClient({
  projectId: 'rz4rht5d',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: 'skMowc1awcFOUmtH8JXmPgsJlalSSxRZiWZtqg9WOkReAL92oCkYueSKwKlxx3Q8WmGvBHEUwMR9js2nviZqeTePjbFoWbelUljoJsmK1UztqAPNGECjUTu3rJS2d1y6JWiSLR7DjiAcQNzWGPQkd1gFUruFRdln3jpUgKnq2g6b37YwfmNY'
}) as SanityClient

// ✅ No type override needed if you type it above
export const sanity = sanityClient
