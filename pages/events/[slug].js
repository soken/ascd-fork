import { useContext } from 'react'
import Layout from '@/components/layout'
import HeroHalfHalf from '@/components/molecules/herohalfhalf'
import { client } from '@/lib/contentful'
import SnipcartButton from '@/components/snipcart/snipcartbutton'
import CtaButton from '@/components/atoms/ctabutton'
import TextCTA from '@/components/molecules/textcta'
import { Box, Grid, Container, Divider, Button } from '@material-ui/core'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { makeStyles } from '@material-ui/core/styles'
import SEOHead from '@/const/head'
import TwoColContentListing from '@/components/organisms/twocolcontentlisting'
import ReactMarkdown from 'react-markdown'
import { BLOCKS } from '@contentful/rich-text-types'
import TextStyle from '../../components/atoms/textstyle'
import { AppContext } from '@/context/state'
import { hasMemberBookPrice } from '@/lib/access-validator'
import { useRouter } from 'next/router'
import { Skeleton } from '@material-ui/lab'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  root: {},
  details: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  detailsText: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
  opacity: {
    opacity: '0.7',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  },
  snipcartBtn: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    border: '2px solid #fff',
    borderRadius: '2px',
    minWidth: '100%',
    height: 38,
    padding: '0px 16px',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(51, 126, 109, 0.8)',
      textDecoration: 'underline',
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 104,
    },
  },
}))

export default function Event({ event, events }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Skeleton animation='wave' variant='rect' width='100%' height='100px' />
    )
  }
  const classes = useStyles()

  const { userAccessData } = useContext(AppContext)
  const useMemberBookPrice = hasMemberBookPrice(userAccessData)

  const futureEvents = events
    .filter((item) => item.fields.slug !== event.fields.slug)
    .filter((item) => {
      const released = Date.parse(item.fields.dateTime)
      const today = new Date().getTime()
      return released > today
    })
    .sort((a, b) => {
      return Date.parse(a.fields.dateTime) - Date.parse(b.fields.dateTime)
    })

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        return (
          <Box minHeight='1.125rem'>
            <TextStyle component='p' variant='subtitle1'>
              {children.length > 1
                ? children
                : children[0]
                    .split('\n')
                    .flatMap((text, i) => [i > 0 && <br />, text])}
            </TextStyle>
          </Box>
        )
      },
      [BLOCKS.HEADING_3]: (node, children) => {
        return <TextStyle variant='h3'>{children}</TextStyle>
      },
    },
  }

  return (
    <Layout>
      <SEOHead seo={event?.fields?.seo ? event.fields.seo : event} />
      <Box pt={[0, 7]} pb={7} maxWidth={['100%', '1024px']} margin='auto'>
        <HeroHalfHalf
          title={event.fields.title}
          description={event.fields.description}
          imagePos='right'
          image={
            event.fields?.thumbnail?.fields?.imageBynder
              ? event.fields?.thumbnail?.fields?.imageBynder[0]?.src +
                '?' +
                imageoptimization.qualityParameter +
                '=' +
                imageoptimization.qualityValue
              : event.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                  ?.url
              ? event.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                  ?.url +
                '?' +
                imageoptimization.qualityParameter +
                '=' +
                imageoptimization.qualityValue
              : '/images/ASCDImageFiller.png'
          }
          imageAlt={event.fields.thumbnail.fields.alternate}
        />
      </Box>
      <Box className={classes.details} py={6} prl={[5, 0]}>
        <Container>
          <Grid container spacing={4}>
            <Grid xs={12} md={6} item className={classes.detailsText}>
              {documentToReactComponents(event.fields.eventDetails, options)}
            </Grid>
            <Grid item xs={12} md={6} className={classes.buttons}>
              {event.fields.link && (
                <CtaButton
                  variant='contained'
                  width='158'
                  height='42'
                  onclick={() => void 0}
                  href={event.fields.link}
                  label='Event Details'
                  color='secondary'
                  size='medium'
                />
              )}
              <Box ml={[0, 2]} mt={[2, 0]}>
                {event.fields.type.fields.title == 'Webinar' &&
                event.fields.webinarLink ? (
                  <Button
                    variant='outlined'
                    className={classes.snipcartBtn}
                    target='_blank'
                    href={event.fields.webinarLink}
                  >
                    Register Now
                  </Button>
                ) : (
                  <SnipcartButton
                    className={classes.snipcartBtn}
                    snipcart={{
                      label: 'Register Now',
                      dataItemId: event.fields.eventId,
                      dataItemName: event.fields.title,
                      dataItemImage: event.fields?.thumbnail?.fields
                        ?.imageBynder
                        ? event.fields?.thumbnail?.fields?.imageBynder[0]?.src +
                          '?' +
                          imageoptimization.qualityParameter +
                          '=' +
                          imageoptimization.qualityValue
                        : event.fields?.thumbnail?.fields?.imageContentful
                            ?.fields?.file?.url
                        ? event.fields?.thumbnail?.fields?.imageContentful
                            ?.fields?.file?.url +
                          '?' +
                          imageoptimization.qualityParameter +
                          '=' +
                          imageoptimization.qualityValue
                        : '/images/ASCDImageFiller.png',
                      dataItemDescription: event.fields.description,
                      dataItemPrice: useMemberBookPrice
                        ? event.fields.priceMember
                        : event.fields.nonMemberPrice,
                      dataItemCustom1Value: event?.fields?.taxJar?.fields
                        ?.taxJarId
                        ? event.fields.taxJar.fields.taxJarId
                        : '',
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth='lg'>
        <Box mt={[5, 10]} mb={8}>
          <TwoColContentListing
            title='More events from ASCD'
            items={futureEvents}
            limit={4}
            body={
              <ReactMarkdown>
                Register today for our upcoming events. All virtual events are
                available to view for at least 30 days after the event **(so you
                can still register even after the live event date)**.
              </ReactMarkdown>
            }
            variant='event'
          />
        </Box>
        <Divider />
        <Box my={10}>
          <TextCTA
            title='Become a Member'
            description='Save on event registration fees and enjoy access to exclusive webinars.'
            ctaLabel='Join'
            ctaLink='/memberships'
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: 'event',
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
    content_type: 'event',
    'fields.slug': params.slug,
  })

  if (!data || !data.items || data.items.length == 0) {
    return {
      notFound: true,
    }
  }

  const events = await client.getEntries({
    content_type: 'event',
  })

  return {
    props: {
      event: data.items.length ? data.items[0] : undefined,
      events: events.items,
    },
    // revalidate: 10,
  }
}
