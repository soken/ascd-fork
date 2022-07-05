import NextHead from 'next/head'
import React from 'react'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import imageoptimization from '@/const/imageoptimization'

const defaultOGURL = 'https://ascd.org'
const defaultOGImage = '/images/logo.svg'

export const Head = ({ seo }) => {
  const title = seo?.fields?.title
    ? seo.fields.id == 'home'
      ? seo.fields.title
      : `${seo.fields.title} - ASCD`
    : 'ASCD'

  const ogDescription =
    seo?.sys?.contentType?.sys?.id === 'seo'
      ? seo?.fields?.description
      : seo?.fields?.description
      ? seo.fields.description.nodeType
        ? documentToPlainTextString(seo?.fields?.description)?.substring(0, 300)
        : seo?.fields?.description
      : seo.fields.body
      ? seo.fields.body.nodeType
        ? documentToPlainTextString(seo?.fields?.body)?.substring(0, 300)
        : seo.fields.body
      : seo.fields.summary
      ? seo.fields.summary.nodeType
        ? documentToPlainTextString(seo?.fields?.summary)?.substring(0, 300)
        : seo.fields.summary
      : ''

  return (
    <NextHead>
      <meta charSet='UTF-8' />
      <title>{title}</title>
      {seo?.sys?.contentType?.sys?.id === 'seo' && (
        <meta name='description' content={seo?.fields?.description} />
      )}
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta property='og:url' content={seo?.fields?.pageUrl || defaultOGURL} />
      <meta property='og:title' content={title} />
      <meta
        property='og:locale'
        content={seo?.fields?.locale || 'en_US'}
      ></meta>
      <meta
        property='og:site_name'
        content={seo?.fields?.siteName || 'ASCD'}
      ></meta>
      <meta
        property='og:type'
        content={seo?.fields?.ogType || 'website'}
      ></meta>
      <meta property='og:description' content={ogDescription} />
      <meta name='twitter:site' content={seo?.fields?.twitterSite || '@ascd'} />
      <meta
        name='twitter:card'
        content={
          seo?.fields?.twitterCardType?.join(', ') || 'summary_large_image'
        }
      />
      <meta
        name='twitter:image'
        content={
          seo?.fields?.twitterImage?.fields?.imageBynder
            ? seo?.fields?.twitterImage?.fields?.imageBynder[0]?.src +
              '?' +
              imageoptimization.qualityParameter +
              '=' +
              imageoptimization.qualityValue
            : seo?.fields?.twitterImage?.fields?.imageContentful?.fields?.file
                ?.url
            ? seo?.fields?.twitterImage?.fields?.imageContentful?.fields?.file
                ?.url +
              '?' +
              imageoptimization.qualityParameter +
              '=' +
              imageoptimization.qualityValue
            : defaultOGImage
        }
      />
      <meta
        property='og:image'
        content={
          seo?.fields?.image?.fields?.imageBynder
            ? seo?.fields?.image?.fields?.imageBynder[0]?.src +
              '?' +
              imageoptimization.qualityParameter +
              '=' +
              imageoptimization.qualityValue
            : seo?.fields?.image?.fields?.imageContentful?.fields?.file?.url
            ? seo?.fields?.image?.fields?.imageContentful?.fields?.file?.url +
              '?' +
              imageoptimization.qualityParameter +
              '=' +
              imageoptimization.qualityValue
            : defaultOGImage
        }
      />
    </NextHead>
  )
}
export default Head
