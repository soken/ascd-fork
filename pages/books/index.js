import { Box, Container } from '@material-ui/core'
import { client } from '@/lib/contentful'
import Layout from '@/components/layout'
import SEOHead from '@/const/head'
import HorizontalScroll from '@/components/organisms/horizontalscroll'
import TwoColumnCta from '@/components/molecules/twocolumncta'
import TextCTA from '@/components/molecules/textcta'
import HeroHalfHalf from '@/components/molecules/herohalfhalf'
import paths from '@/paths/path'
import HorizontalNav from '@/components/molecules/horizontalnav'
import BannerMessage from '@/components/atoms/bannermessage'
import Link from '@/components/atoms/link'
import { useRouter } from 'next/router'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import TextStyle from '@/components/atoms/textstyle'
import imageoptimization from '@/const/imageoptimization'

export default function Books({ books, SEO }) {
  const router = useRouter()

  const featuredBooks = JSON.parse(JSON.stringify(books)).filter((book) => {
    const bookVersion = book.fields.bookVersions.find(
      (version) =>
        version.fields?.bookType?.fields?.title !== 'Quick Reference Guides'
    )
    book.fields.bookVersions = [bookVersion]
    if (book.fields.featured && bookVersion) return true
    return false
  })

  const featuredQrgs = JSON.parse(JSON.stringify(books)).filter((book) => {
    const bookVersion = book.fields.bookVersions.find(
      (version) =>
        version.fields?.bookType?.fields?.title == 'Quick Reference Guides'
    )
    book.fields.bookVersions = [bookVersion]
    if (book.fields.featured && bookVersion) return true
    return false
  })

  const newBooks = JSON.parse(JSON.stringify(books)).filter((book) => {
    const newBookVersions = book.fields.bookVersions.filter((version) => {
      const released = Date.parse(version.fields?.dateRelease)
      const today = new Date().getTime()
      return released >= today - 180 * 24 * 60 * 60 * 1000 && released <= today
    })

    if (newBookVersions.length > 0) {
      book.fields.bookVersions = [newBookVersions[0]]
      return true
    }
    return false
  })

  const upcomingBooks = JSON.parse(JSON.stringify(books)).filter((book) => {
    const upcomingBookVersions = book.fields.bookVersions.filter((version) => {
      const released = Date.parse(version.fields?.dateRelease)
      const today = new Date().getTime()
      return released > today
    })

    if (upcomingBookVersions.length > 0) {
      book.fields.bookVersions = [upcomingBookVersions[0]]
      return true
    }
    return false
  })

  const descriptionPlainText = (document) => {
    const desc = documentToPlainTextString(document)
    return desc.substring(0, desc.indexOf('.') + 1)
  }

  const featuredBookImage =
    featuredBooks &&
    featuredBooks[0] &&
    (featuredBooks[0]?.fields?.featuredImage
      ? featuredBooks[0]?.fields?.featuredImage?.fields?.imageBynder
        ? featuredBooks[0]?.fields?.featuredImage?.fields?.imageBynder[0]?.src +
          '?' +
          imageoptimization.qualityParameter +
          '=' +
          imageoptimization.qualityValue
        : featuredBooks[0]?.fields?.featuredImage?.fields?.imageContentful
            ?.fields?.file?.url
        ? featuredBooks[0]?.fields?.featuredImage?.fields?.imageContentful
            ?.fields?.file?.url +
          '?' +
          imageoptimization.qualityParameter +
          '=' +
          imageoptimization.qualityValue
        : '/images/ASCDImageFiller.png'
      : featuredBooks[0]?.fields?.thumbnail?.fields?.imageBynder
      ? featuredBooks[0]?.fields?.thumbnail?.fields?.imageBynder[0]?.src +
        '?' +
        imageoptimization.qualityParameter +
        '=' +
        imageoptimization.qualityValue
      : featuredBooks[0]?.fields?.thumbnail?.fields?.imageContentful?.fields
          ?.file?.url
      ? featuredBooks[0]?.fields?.thumbnail?.fields?.imageContentful?.fields
          ?.file?.url +
        '?' +
        imageoptimization.qualityParameter +
        '=' +
        imageoptimization.qualityValue
      : '/images/ASCDImageFiller.png')

  const featuredQrgImage =
    featuredQrgs &&
    featuredQrgs[0] &&
    featuredQrgs[0]?.fields?.featuredImage &&
    (featuredQrgs[0]?.fields?.featuredImage?.fields?.imageBynder
      ? featuredQrgs[0]?.fields?.featuredImage?.fields?.imageBynder[0]?.src +
        '?' +
        imageoptimization.qualityParameter +
        '=' +
        imageoptimization.qualityValue
      : featuredQrgs[0]?.fields?.featuredImage?.fields?.imageContentful?.fields
          ?.file?.url +
        '?' +
        imageoptimization.qualityParameter +
        '=' +
        imageoptimization.qualityValue)

  return (
    <Layout>
      <SEOHead seo={SEO} />

      {featuredBooks.length > 0 && (
        <Box pt={[0, 11]} maxWidth={['100%', '1024px']} margin='auto'>
          <HeroHalfHalf
            label='Books'
            title={featuredBooks[0].fields.title}
            description={descriptionPlainText(
              featuredBooks[0].fields.description
            )}
            imagePos='right'
            image={featuredBookImage}
            imageAlt={
              featuredBooks[0].fields.featuredImage
                ? featuredBooks[0].fields.featuredImage?.fields?.title
                : featuredBooks[0].fields.thumbnail?.fields?.title
            }
            ctaLabel1='Shop'
            ctaLink1={paths.book({
              slug: featuredBooks[0].fields.slug,
              variant:
                featuredBooks[0].fields.bookVersions[0].fields.productNumber,
            })}
          />
        </Box>
      )}
      <Container maxWidth='lg'>
        <Box mt={[8, 8, 9]} mb={11}>
          <HorizontalNav
            items={[
              {
                label: 'All Books',
                clickAction: () =>
                  router.push(paths.search({ types: ['book'] })),
              },
              {
                label: 'Featured Books',
                clickAction: () =>
                  router.push(
                    paths.search({
                      types: ['book'],
                      bookFilters: ['Featured'],
                    })
                  ),
              },
              {
                label: 'New Books',
                clickAction: () =>
                  router.push(
                    paths.search({
                      types: ['book'],
                      bookFilters: ['New Releases'],
                    })
                  ),
              },
            ]}
          />
        </Box>
      </Container>
      {featuredBooks.length > 1 && (
        <Box mt={10}>
          <Container>
            <HorizontalScroll
              title='Featured Books'
              ctaLabel='View all'
              ctaLink={paths.search({ types: ['book'] })}
              items={featuredBooks.slice(1)}
              type='carttile'
            />
          </Container>
        </Box>
      )}

      {newBooks.length > 0 && (
        <Box mt={12}>
          <Container>
            <HorizontalScroll
              title='New Books'
              ctaLabel='View all'
              ctaLink={paths.search({
                types: ['book'],
                bookFilters: ['New Releases'],
              })}
              items={newBooks}
              type='carttile'
            />
          </Container>
        </Box>
      )}

      <Container maxWidth='lg'>
        <Box mt={11}>
          <TextCTA
            title='Premium members receive 9 new books a year.'
            ctaLabel='Become a member'
            ctaLink={paths.subscribe}
          />
        </Box>

        {featuredQrgs.length > 0 && (
          <Box my={11}>
            <TwoColumnCta
              label='Quick Reference Guides'
              title={featuredQrgs[0].fields.title}
              description={descriptionPlainText(
                featuredQrgs[0].fields.description
              )}
              ctaLabel1='Shop'
              ctaLink1={paths.book({
                slug: featuredQrgs[0].fields.slug,
                variant:
                  featuredQrgs[0].fields.bookVersions[0].fields.productNumber,
              })}
              ctaLabel2='View all guides'
              ctaLink2='/'
              imagePos='right'
              image={featuredQrgImage}
              imageAlt={
                featuredQrgs[0].fields.featuredImage
                  ? featuredQrgs[0].fields.featuredImage?.fields?.title
                  : featuredQrgs[0].fields.thumbnail?.fields?.title
              }
            />
          </Box>
        )}
      </Container>

      {upcomingBooks.length > 0 && (
        <Box mt={12}>
          <Container>
            <HorizontalScroll
              title='Pre-Order Books'
              ctaLabel='View all'
              ctaLink={paths.search({
                types: ['book'],
                bookFilters: ['Upcoming Pre-Order Books'],
              })}
              items={upcomingBooks}
              type='carttile'
              cellHeight={478}
              cols={4.2}
            />
          </Container>
        </Box>
      )}

      <Container maxWidth='lg'>
        <Box
          mt={6}
          mb={11}
          alignItems='center'
          display='flex'
          justifyContent='center'
        >
          {/* <TextCTA
            description='Premium members can pre-order exclusive print and e-books.'
            ctaLabel='Join today.'
            ctaLink='/'
            inline
          /> */}
          <BannerMessage variant='special'>
            <TextStyle variant='body2'>
              Premium members can pre-order exclusive print and e-books. &nbsp;
              <Link
                href={paths.subscribe}
                label='Join today'
                size='large'
                color='black'
              />
            </TextStyle>
          </BannerMessage>
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const data = await client.getEntries({
    content_type: 'book',
    select:
      'fields.title,fields.slug,fields.featured,fields.authors,fields.thumbnail,fields.featuredImage,fields.description,fields.bookVersions,fields.datePublished',
    order: '-fields.datePublished',
    include: 2,
  })
  const SEOData = await client.getEntries({
    content_type: 'seo',
    'fields.id': 'books',
  })

  return {
    props: {
      books: data.items,
      SEO: SEOData.items.length ? SEOData.items[0] : {},
    },
  }
}
