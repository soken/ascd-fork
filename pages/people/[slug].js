import { client } from '@/lib/contentful'
import SEOHead from '@/const/head'
import Layout from '@/components/layout'
import { Box, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ReadMore from '@/components/molecules/readmore'
import Topics from '@/components/molecules/topics'
import TwoColumnCta from '@/components/molecules/twocolumncta'
import VideoPlaylist from '@/components/organisms/videoplaylist'
import ProfileHeader from '@/components/molecules/profileheader'
import paths from '@/paths/path'
import HorizontalScroll from '@/components/organisms/horizontalscroll'
import TextStyle from '@/components/atoms/textstyle'
import ContentList from '@/components/molecules/contentlist'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { useRouter } from 'next/router'
import { Skeleton } from '@material-ui/lab'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  body: {
    width: '100%',
    maxWidth: 850,
    margin: 'auto',
  },
  contentList: {
    width: '100%',
    backgroundColor: theme.palette.background.lightGrey,
    '& $body': {
      maxWidth: '674px',
      margin: 'auto',
    },
  },
}))

export default function AuthorDetails({ profile, videos, articles, books }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Skeleton animation='wave' variant='rect' width='100%' height='100px' />
    )
  }

  const classes = useStyles()
  const isAuthor = profile.fields.profileType?.fields?.title === 'Author'

  const expertise = profile?.fields?.expertise
    ? profile.fields.expertise
        .map((item) => item?.fields?.title)
        .reduce((unique, o) => {
          if (!unique.includes(o)) {
            unique.push(o)
          }
          return unique
        }, [])
        .sort()
    : null

  const featuredBooks = JSON.parse(JSON.stringify(books)).filter((book) => {
    const bookVersion = book.fields.bookVersions.find(
      (version) =>
        version.fields?.bookType.fields.title !== 'Quick Reference Guides'
    )
    book.fields.bookVersions = [bookVersion]
    if (book.fields.featured && bookVersion) return true
    return false
  })

  return (
    <Layout>
      <SEOHead seo={profile?.fields?.seo ? profile.fields.seo : profile} />
      <ProfileHeader profile={profile} />

      <Container maxWidth='lg'>
        <Box className={classes.body}>
          <Box mt={10} id='about'>
            <ReadMore
              title='About'
              short={profile.fields.description}
              textAlign='left'
              titleVariant='h4'
              hideSummaryWhenExpanded
            />
          </Box>
          <Box mt={10} width='100%'>
            <Topics title='Expertise' topics={expertise} titleVariant='h4' />
          </Box>
        </Box>
        {isAuthor && (
          <Box mt={10}>
            {featuredBooks.length > 0 && (
              <TwoColumnCta
                label='Featured'
                title={featuredBooks[0].fields?.title}
                description={documentToReactComponents(
                  featuredBooks[0].fields?.description
                )}
                imagePos='right'
                image={
                  featuredBooks[0].fields?.featuredImage?.fields?.imageBynder
                    ? featuredBooks[0].fields?.featuredImage?.fields
                        ?.imageBynder[0]?.src +
                      '?' +
                      imageoptimization.qualityParameter +
                      '=' +
                      imageoptimization.qualityValue
                    : featuredBooks[0].fields?.featuredImage?.fields
                        ?.imageContentful?.fields?.file?.url
                    ? featuredBooks[0].fields?.featuredImage?.fields
                        ?.imageContentful?.fields?.file?.url +
                      '?' +
                      imageoptimization.qualityParameter +
                      '=' +
                      imageoptimization.qualityValue
                    : '/images/ASCDImageFiller.png'
                }
                imageAlt={featuredBooks[0].fields.featuredImage?.fields?.title}
                ctaLabel1='Shop'
                ctaLink1={paths.book({
                  slug: featuredBooks[0].fields.slug,
                  variant:
                    featuredBooks[0].fields.bookVersions[0].fields
                      .productNumber,
                })}
                variant='grey'
              />
            )}
          </Box>
        )}
      </Container>

      {isAuthor && articles.length > 0 && (
        <Box mt={10} className={classes.contentList}>
          <Container maxWidth='lg'>
            <Box py={10} className={classes.body}>
              <ContentList
                title={`Articles by ${profile.fields.firstName}`}
                ctaLabel='View all'
                ctaLink={paths.search({
                  types: ['blog', 'article'],
                  authors: [
                    `${profile.fields.firstName} ${profile.fields.lastName}`,
                  ],
                })}
                items={articles}
                variant='article'
              />
            </Box>
          </Container>
        </Box>
      )}
      <Container maxWidth='lg'>
        {isAuthor && videos.length > 0 && (
          <Box mt={10} width='100%'>
            <TextStyle variant='h4'>
              Videos by {profile.fields.firstName}
            </TextStyle>

            <VideoPlaylist video={videos[0]} videos={videos} />
          </Box>
        )}

        {isAuthor && books.length > 0 && (
          <Box mt={10} width='100%'>
            <HorizontalScroll
              title={'Books by ' + profile.fields.firstName}
              ctaLabel='View All'
              ctaLink={paths.search({
                types: ['book'],
                authors: [
                  `${profile.fields.firstName} ${profile.fields.lastName}`,
                ],
              })}
              items={books}
              type='carttile'
            />
          </Box>
        )}

        {isAuthor && (
          <Box my={10}>
            <TwoColumnCta
              title='Write for ASCD'
              description='We publish insightful, actionable, relevant work from educators across all levels of education that help educators learn, teach and lead.'
              ctaLabel1='Learn more'
              ctaLink1='#'
              image='/images/write_for_ascd.svg'
              imagePos='right'
              variant='grey'
            />
          </Box>
        )}
      </Container>
    </Layout>
  )
}

// export async function getStaticPaths() {
//   const contentType = 'profile'
//   const maxEntries = 1000
//   let offset = 0
//   let items = []
//   let processedEntries = null
//   while (processedEntries !== 0) {
//     const entries = await client.getEntries({
//       content_type: contentType,
//       select: 'fields.slug',
//       skip: offset,
//       limit: maxEntries,
//     })

//     processedEntries = entries.items.length

//     if (processedEntries > 0) {
//       offset += processedEntries
//       items.push(...entries.items)
//     }
//   }

//   return {
//     paths: items.map((item) => ({
//       params: { slug: item.fields.slug },
//     })),
//     fallback: false,
//   }
// }

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: 'profile',
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
    content_type: 'profile',
    'fields.slug': params.slug,
  })

  if (!data || !data.items || data.items.length == 0) {
    return {
      notFound: true,
    }
  }

  const videos = await client.getEntries({
    content_type: 'video',
    'fields.authors.sys.id': data.items[0].sys.id,
  })

  const articles = await client.getEntries({
    content_type: 'article',
    'fields.authors.sys.id': data.items[0].sys.id,
    order: '-fields.issueDate',
    limit: 4,
  })

  const bookData = await client.getEntries({
    content_type: 'book',
    'fields.authors.sys.id': data.items[0].sys.id,
    include: 2,
    select:
      'fields.title,fields.slug,fields.authors,fields.thumbnail,fields.description,fields.bookVersions',
    limit: 8,
    order: '-fields.datePublished',
  })

  return {
    props: {
      profile: data.items[0],
      videos: videos.items,
      articles: articles.items,
      books: bookData.items,
    },
    // revalidate: 10,
  }
}
