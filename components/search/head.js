import NextHead from 'next/head'
import { string } from 'prop-types'
import React from 'react'

export const Head = (props) => (
  <NextHead>
    {process.env.NEXT_PUBLIC_ALGOLIA_CSS_ENDPOINT ? (
      <link
        rel='stylesheet'
        href={process.env.NEXT_PUBLIC_ALGOLIA_CSS_ENDPOINT}
      />
    ) : (
      ''
    )}
  </NextHead>
)

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string,
}

export default Head
