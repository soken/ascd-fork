import { Box, Container } from '@material-ui/core'
import { client } from '@/lib/contentful'
import Layout from '@/components/layout'
import Head from 'next/head'
import SEOHead from '@/const/head'
import HorizontalScroll from '@/components/organisms/horizontalscroll'
import GridSection from '@/components/molecules/gridsection'
import HorizontalSection from '@/components/molecules/horizontalsection'
import TwoColumnCta from '@/components/molecules/twocolumncta'
import IssueBannerTitle from '@/components/molecules/issuebannertitle'
import paths from '@/paths/path'
import PodcastPlayer from '@/components/molecules/podcastplayer'
import TextCTA from '@/components/molecules/textcta'
import imageoptimization from '@/const/imageoptimization'

export default function EducationalLearning({
  publications,
  featuredArticles,
  featuredColumn,
  podcast,
  featuredAuthors,
  SEO,
}) {
  return (
    <Layout>
      <SEOHead seo={SEO} />
      <Head>
        <script
          src='https://fast.wistia.com/embed/medias/8qu1yof6os.jsonp'
          async
        ></script>
        <script
          src='https://fast.wistia.com/assets/external/E-v1.js'
          async
        ></script>
      </Head>
      <Container maxWidth='lg'>
        <Box mt={[6, 10]} pb={1} maxWidth='sm' mx={[1, 'auto']}>
          <IssueBannerTitle
            landing={{
              title: 'EL Magazine: By Educators, for Educators',
              subtitle:
                'Since 1943, Educational Leadership has been a trusted source of peer-reviewed guidance and wisdom',
            }}
            ctaLabel='Join'
            ctaLink={paths.subscribe}
            authors={{
              ctaLabel: '100+ Featured Authors',
              ctaLink: paths.author({ slug: '' }),
            }}
            featuredAuthors={featuredAuthors}
            align='left'
            twoThirds
          />
        </Box>

        <Box mt={[4, 8]} mx={[1, 'auto']}>
          <HorizontalScroll
            title='Recent Issues'
            ctaLabel='View all'
            ctaLink={paths.el({ slug: 'all' })}
            items={publications}
            type='issuetile'
          />
        </Box>
        <Box mt={[3, 5]} mx={[1, 'auto']}>
          <GridSection
            title='Featured Articles'
            ctaLink={paths.search({
              types: ['article'],
              featured: ['true'],
            })}
            items={featuredArticles}
            variant='articleOverlay'
          />
        </Box>
        <Box mt={[6, 10]} mx={[1, 'auto']}>
          <PodcastPlayer
            sectionTitle='Listen & Learn'
            podcast={podcast}
            ctaLink={paths.podcast({ slug: '' })}
          />
        </Box>

        {featuredColumn && (
          <Box mt={[6, 10]} mx={[1, 'auto']}>
            <HorizontalSection
              title='Featured Column'
              viewAllLink={true}
              label={featuredColumn.fields.topic?.fields.title}
              linkText={featuredColumn.fields.title}
              linkSlug={featuredColumn.fields.slug}
              date={featuredColumn.sys.createdAt}
              imageSlug={featuredColumn.fields.authors[0].fields?.slug}
              authorImage={
                featuredColumn.fields.authors
                  ? featuredColumn.fields.authors[0].fields?.thumbnail?.fields
                      ?.imageBynder
                    ? featuredColumn.fields.authors[0].fields?.thumbnail?.fields
                        ?.imageBynder[0]?.src +
                      '?' +
                      imageoptimization.qualityParameter +
                      '=' +
                      imageoptimization.qualityValue
                    : featuredColumn.fields.authors[0].fields?.thumbnail?.fields
                        ?.imageContentful?.fields?.file?.url +
                      '?' +
                      imageoptimization.qualityParameter +
                      '=' +
                      imageoptimization.qualityValue
                  : null
              }
              authorTitle={featuredColumn.fields.authors[0].fields?.title}
              authorSubtitle={featuredColumn.fields.authors[0].fields?.position}
            />
          </Box>
        )}
        <Box mt={[6, 10]} mx={[1, 'auto']}>
          <TwoColumnCta
            title='Write for EL Magazine'
            description='Share your writing with more than 135,000 educators. Get a feel for our upcoming themes and writing guidelines. '
            ctaLabel1='View upcoming themes'
            ctaLink1={paths.el({ slug: 'write' })}
            ctaLabel2='View guidelines'
            ctaLink2={paths.el({ slug: 'guidelines-for-el' })}
            imagePos='right'
            image='/images/el.png'
          />
        </Box>
        <Box my={[6, 10]} mt={[3, 10]} mx={[1, 'auto']}>
          <TextCTA
            title='Get to know our industry-leading authors'
            ctaLabel='View all authors'
            ctaLink={paths.author({ slug: 'all' })}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const data = await client.getEntries({
    content_type: 'pubissue',
    order: '-fields.publicationDate',
    include: 3,
    select:
      'fields.title,fields.slug,fields.thumbnail,fields.volNo,fields.issueNo,fields.publicationDate',
    limit: 8,
  })
  const featuredArticles = await client.getEntries({
    content_type: 'article',
    limit: 3,
    'fields.featured': true,
    order: '-fields.issueDate',
  })
  const featuredColumn = await client.getEntries({
    content_type: 'article',
    limit: 1,
    'fields.featured': true,
    'fields.elArticleType': 'Articles in Columns/Departments Section',
    order: '-fields.issueDate',
  })
  const podcasts = await client.getEntries({
    content_type: 'podcast',
    'fields.wistiaId[exists]': true,
    limit: 1,
    order: '-fields.date',
  })
  const authors = await client.getEntries({
    content_type: 'profile',
    'fields.profileType.sys.contentType.sys.id': 'categoryProfiles',
    'fields.profileType.fields.title': 'Author',
    limit: 3,
  })
  const SEOData = await client.getEntries({
    content_type: 'seo',
    'fields.id': 'el',
    limit: 1,
  })

  return {
    props: {
      publications: data.items,
      featuredArticles: featuredArticles.items,
      featuredColumn: featuredColumn.items.length
        ? featuredColumn.items[0]
        : null,
      podcast: podcasts.items.length ? podcasts.items[0] : null,
      featuredAuthors: authors.items,
      SEO: SEOData.items.length ? SEOData.items[0] : {},
    },
  }
}
