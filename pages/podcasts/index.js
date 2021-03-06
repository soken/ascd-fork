import Layout from '@/components/layout'
import ContentGrid from '@/components/organisms/contentgrid'
import MediaTabs from '@/components/molecules/mediatabs'
import PodcastThumbnail from '@/components/molecules/podcastthumbnail'
import TextCTA from '@/components/molecules/textcta'
import { client } from '@/lib/contentful'
import paths from '@/paths/path'
import ViewAllCTA from '@/components/atoms/viewallcta'
import TextStyle from '@/components/atoms/textstyle'
import { Box, Container, Grid } from '@material-ui/core'
import SEOHead from '@/const/head'
import MediaBanner from '@/components/molecules/mediabanner'

export default function Podcasts({ podcasts, SEO }) {
  const featuredPodcasts = podcasts
    .filter((podcast) => podcast.fields.featured)
    .slice(0, 2)

  const otherPodcasts = podcasts.filter(
    (podcast) =>
      featuredPodcasts &&
      podcast.sys.id !== featuredPodcasts[0]?.sys.id &&
      podcast.sys.id !== featuredPodcasts[1]?.sys.id
  )

  return (
    <Layout>
      <SEOHead seo={SEO} />

      <MediaBanner
        title='Videos, Podcasts & Webinars'
        subtitle='Watch effective, research-based practices in action. Listen to advice from skilled practitioners. Accelerate your learning journey on your time and your path.'
      />
      <Box mt={[6, 10]}>
        <MediaTabs tabValue={1} />
      </Box>
      <Container maxWidth='lg'>
        <Box mt={[8, 10]}>
          {featuredPodcasts.length > 0 && (
            <>
              <Box display='flex' justifyContent='space-between' mb={3}>
                <TextStyle variant='h4'>Featured Podcasts</TextStyle>
                <ViewAllCTA
                  href={paths.search({
                    types: ['podcast'],
                    featured: ['true'],
                  })}
                  label='View all'
                  lg
                />
              </Box>

              <Grid container spacing={5}>
                <Grid item md={8} xs={12}>
                  {featuredPodcasts[0] && (
                    <PodcastThumbnail podcast={featuredPodcasts[0]} />
                  )}
                </Grid>
                <Grid item md={4} xs={12}>
                  {featuredPodcasts[1] && (
                    <PodcastThumbnail podcast={featuredPodcasts[1]} />
                  )}
                </Grid>
              </Grid>
            </>
          )}
          <Box mt={[6, 10]}>
            <ContentGrid
              sectionTitle='Latest Podcasts'
              items={otherPodcasts.slice(1)}
              viewAllLink={paths.search({ types: ['podcast'] })}
            />
          </Box>
        </Box>
        <Box my={[4, 10]} mt={[2, 6]}>
          <TextCTA
            ctaLabel='Become a member to access more great content'
            ctaLink={paths.subscribe}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const data = await client.getEntries({
    content_type: 'podcast',
    order: '-fields.date',
  })
  const SEOData = await client.getEntries({
    content_type: 'seo',
    'fields.id': 'podcasts',
  })

  return {
    props: {
      podcasts: data.items,
      SEO: SEOData.items.length ? SEOData.items[0] : {},
    },
  }
}
