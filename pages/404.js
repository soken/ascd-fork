import Layout from '@/components/layout'
import Head from 'next/head'
import { client } from '@/lib/contentful'
import { Box, Container } from '@material-ui/core'
import TwoColumnCTA from '@/components/molecules/twocolumncta'
import GridSection from '@/components/molecules/gridsection'
import paths from '@/paths/path'

export default function NotFound({ articles }) {
  const featuredArticles = articles
    .filter((article) => article?.fields.featured)
    .slice(0, 3)

  return (
    <Layout>
      <Head>
        <title ml={-0.25}>404 page not found</title>
      </Head>
      <Container>
        <Box my={12}>
          <TwoColumnCTA
            title='404'
            ctaLabel2='Back to ascd.org'
            ctaLink2='https://ascd.org'
            description='Not sure what went wrong but it looks like the page you’re looking for isn’t available.
            Head back to our home page to find what you’re looking for and take your place in our passionate community of life-changing educators.'
            image='/images/image404.png'
            imagePos='right'
            variant='error'
            descriptionLineNumbers={8}
          />
        </Box>
        <Box mb={10}>
          <GridSection
            title='Featured Articles'
            ctaLink={paths.search({
              sortBy: ['featured_article'],
            })}
            items={featuredArticles}
            variant='articleOverlay'
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const data = await client.getEntries({
    content_type: 'article',
  })

  return {
    props: {
      articles: data.items,
    },
  }
}
