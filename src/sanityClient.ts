import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'rz4rht5d',     // Replace with your Sanity Project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: 'skMowc1awcFOUmtH8JXmPgsJlalSSxRZiWZtqg9WOkReAL92oCkYueSKwKlxx3Q8WmGvBHEUwMR9js2nviZqeTePjbFoWbelUljoJsmK1UztqAPNGECjUTu3rJS2d1y6JWiSLR7DjiAcQNzWGPQkd1gFUruFRdln3jpUgKnq2g6b37YwfmNY', // optional, for authenticated writes
})
