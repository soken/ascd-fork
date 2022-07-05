const contentful = require('contentful')

export const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
})

export const fetchProductPricesByProductNumbers = (productNumbers) =>
  client.getEntries({
    content_type: 'bookVersion',
    'fields.productNumber[in]': productNumbers?.toString(),
  })
