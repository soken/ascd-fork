import Layout from '@/components/layout'
import { client } from '@/lib/contentful'
import { Box, Container, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SEOHead from '@/const/head'
import ReadMore from '@/components/molecules/readmore'
import Topics from '@/components/molecules/topics'
import TwoColumnCta from '@/components/molecules/twocolumncta'
import TextCTA from '@/components/molecules/textcta'
import VideoPlaylist from '@/components/organisms/videoplaylist'
import paths from '@/paths/path'
import ContentGrid from '@/components/organisms/contentgrid'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import options from '@/const/options'
import { useRouter } from 'next/router'
import { Skeleton } from '@material-ui/lab'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles(() => ({
  root: {},
}))

export default function Webinar({ webinar, webinars }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Skeleton animation='wave' variant='rect' width='100%' height='100px' />
    )
  }

  const classes = useStyles()

  const secondaryTopics = webinar.fields?.topicSecondary
    ?.map((topic) => topic.fields?.title)
    .reduce((unique, o) => {
      if (!unique.includes(o)) {
        unique.push(o)
      }
      return unique
    }, [])

  const latestWebinars = webinars
    .filter((item) => item.sys.id !== webinar.sys.id)
    .sort((a, b) => {
      return Date.parse(b.fields.date) - Date.parse(a.fields.date)
    })

  const relatedWebinars = webinars
    .filter((item) => item.sys.id !== webinar.sys.id)
    .filter((item) => item.fields.topic.title == webinar.fields.topic.title)
    .sort((a, b) => {
      return Date.parse(b.fields.date) - Date.parse(a.fields.date)
    })
  const book = webinar.fields.featuredBook
  return (
    <Layout>
      <SEOHead seo={webinar?.fields?.seo ? webinar.fields.seo : webinar} />
      <Container>
        <Box pb={3} mt={2}>
          <VideoPlaylist video={webinar} videos={relatedWebinars} />
        </Box>
      </Container>

      <Box mb={[0, 10]}>
        <Divider />
      </Box>

      <Container>
        <Box maxWidth={850}>
          <Box mt={[5, 0]} id='about'>
            <ReadMore
              title='In this Webinar'
              titleVariant='h4'
              short={webinar.fields.description}
              textAlign='left'
              hideSummaryWhenExpanded
            />
          </Box>
          <Box mt={6} id='topics'>
            <Topics
              title='Topics covered'
              titleVariant='h4'
              topics={secondaryTopics}
              contentType='webinar'
              variant='basicSmall'
            />
          </Box>
        </Box>
        {book && (
          <Box my={11}>
            <TwoColumnCta
              title={book.fields.title}
              description={
                documentToReactComponents(book.fields.description, options)[0]
              }
              ctaLabel1='Shop'
              ctaLink1={paths.book({ slug: book.fields.slug })}
              label={book.fields.topic.fields.title}
              image={
                book.fields?.featuredImage?.fields?.imageBynder
                  ? book.fields?.featuredImage?.fields?.imageBynder[0]?.src +
                    '?' +
                    imageoptimization.qualityParameter +
                    '=' +
                    imageoptimization.qualityValue
                  : book.fields?.featuredImage?.fields?.imageContentful?.fields
                      ?.file?.url
                  ? book.fields?.featuredImage?.fields?.imageContentful?.fields
                      ?.file?.url +
                    '?' +
                    imageoptimization.qualityParameter +
                    '=' +
                    imageoptimization.qualityValue
                  : '/images/ASCDImageFiller.png'
              }
              imagePos='right'
              variant='grey'
            />
          </Box>
        )}
        <Box mt={11}>
          <ContentGrid
            sectionTitle='Latest Webinars'
            items={latestWebinars}
            viewAllLink={paths.search({ types: ['webinar'] })}
          />
        </Box>
        <Box my={9}>
          <TextCTA
            title='Learn and Connect With Peers'
            description='Join us for one of our upcoming live events to continue learning while having the opportunity to connect with educators from around the world!'
            ctaLabel='Upcoming Events'
            ctaLink={paths.events}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: 'webinar',
    select: 'fields.slug',
    limit: 200,
  })

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const data = await client.getEntries({
    content_type: 'webinar',
    'fields.slug': params.slug,
    include: 2,
  })

  if (!data || !data.items || data.items.length == 0) {
    return {
      notFound: true,
    }
  }

  const webinars = await client.getEntries({
    content_type: 'webinar',
  })

  return {
    props: {
      webinar: data.items.length ? data.items[0] : undefined,
      webinars: webinars.items,
    },
    // revalidate: 10,
  }
}
