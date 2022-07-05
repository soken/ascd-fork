import { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { client } from 'lib/contentful'
import SEOHead from '@/const/head'
import paths from '@/paths/path'
import Image from 'material-ui-image'
import TextStyle from '@/components/atoms/textstyle'
import TOCNav from '@/components/atoms/tocnav'
import Layout from '@/components/layout'
import HeroArticle from '@/components/molecules/heroarticle'
import ArticleEndnote from '@/components/molecules/articleendnote'
import ArticleIssue from '@/components/molecules/articleissue'
import ContentList from '@/components/molecules/contentlist'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import Annotator from '@/components/organisms/annotator'
import TopicTag from '@/components/molecules/topictag'
import TextCTA from '@/components/molecules/textcta'
import ArticleAuthors from '@/components/organisms/articleaauthors'
import { components } from '@/const/components'
import PdfIframe from '@/components/molecules/pdfIframe'
import PdfTitleBar from '@/components/molecules/pdftitlebar'
import { AppContext } from '@/context/state'
import Link from '@/components/atoms/link'
import { Skeleton } from '@material-ui/lab'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  articleText: {
    width: '100%',
    maxWidth: 674,
  },
  topics: {
    '& > div': {
      marginBottom: theme.spacing(1),
    },
  },
  body: {
    '& blockquote': {
      borderLeft: `${theme.spacing(1)}px solid ${theme.palette.primary.main}`,
      paddingLeft: theme.spacing(2),
    },
  },
  media: {
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 850,
    },
  },
  toc: {
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: 250,
    },
  },

  bottomRibbon: {
    width: '100%',
    bottom: 0,
    position: 'fixed',
    left: 0,
    zIndex: 1,
  },
  pianoHideAll: {
    display: 'none',
  },
  '@global': {
    '.pianoSignupWrapperActive': {
      position: 'relative',
      maxWidth: '675px',
      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        height: '200px',
        backgroundImage:
          'linear-gradient(to top, #ffffff 0%, #ffffff 10%, rgba(255, 255, 255, 0) 50%)',
      },
    },
    '.piano-hide-all': {
      display: 'none',
    },
  },
}))

function ArticleBody({ refresherKey, children }) {
  const classes = useStyles()
  return (
    <Box id='articleBody' className={classes.body} key={refresherKey}>
      {children}
    </Box>
  )
}

const expressArticleTag = async (tp, user, bExpress) => {
  try {
    if (bExpress && user.id) {
      await tp.push(['setTags', ['express']])
    }
  } catch (e) {
    throw Error(e.message)
  }
}

export default function Article({ article, issue, relatedArticles }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Skeleton animation='wave' variant='rect' width='100%' height='100px' />
    )
  }

  const [refresherKey, setRefresherKey] = useState(0)
  const [sidebar, setSidebar] = useState(false)
  const dateFormat = require('dateformat')

  const { user } = useContext(AppContext)

  let tp = null
  if (typeof window !== 'undefined' && typeof window.tp !== 'undefined') {
    tp = window.tp
    if (tp) {
      expressArticleTag(tp, user, article.fields.express)
    }
  }

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => (
        <img
          src={
            node.data?.target?.fields?.file?.url +
            '?' +
            imageoptimization.qualityParameter +
            '=' +
            imageoptimization.qualityValue
          }
          alt={node.data?.target?.fields?.title}
          style={{ marginTop: '48px', marginBottom: '48px', width: '100%' }}
        />
      ),
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <Box my={2}>
          <TextStyle variant='articleBody'>{children}</TextStyle>
        </Box>
      ),
      [BLOCKS.HEADING_2]: (node, children) => {
        const slug = convertToSlug(children[0])

        return (
          <Typography
            id={slug}
            component='h2'
            variant='h3'
            style={{ marginBlockStart: '48px', marginBlockEnd: '16px' }}
          >
            {children[0]}
          </Typography>
        )
      },
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        return (
          <Box my={6}>
            {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
          </Box>
        )
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        return (
          <Box my={6}>
            {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
          </Box>
        )
      },
      [INLINES.HYPERLINK]: (node, children) => {
        if (node.data.uri.includes('#')) {
          const domId = node.data.uri.split('#')[1]
          return (
            <Link
              clickAction={() => navigateTo(domId)}
              label={children}
              size='large'
            />
          )
        } else {
          return (
            <Link
              href={node.data.uri}
              label={children}
              size='large'
              target={
                node.data.uri?.toLowerCase().includes('https://ascd.org') ||
                !node.data.uri?.toLowerCase().includes('https://')
                  ? ''
                  : '_blank'
              }
            />
          )
        }
      },
      // [BLOCKS.QUOTE]: (node, children) => {
      //   return (
      //     <Box my={6} display='flex'>
      //       <Box width='10%' pr={3}>
      //         <Image
      //           src='/images/quote.svg'
      //           style={{ backgroundColor: 'transparent' }}
      //         ></Image>
      //       </Box>
      //       <Box width='90%'>
      //         <TextStyle variant='h2'>
      //           {documentToPlainTextString(node)}
      //         </TextStyle>
      //       </Box>
      //     </Box>
      //   )
      // },
    },

    renderText: (text) => {
      if (text.indexOf('<SUPSCRPT>') > 0) {
        let cleanedText = ''

        cleanedText = text.replace(/<\/SUPSCRPT>/g, '')

        return cleanedText
          .split('<SUPSCRPT>')
          .reduce((children, textSegment, index) => {
            return [
              ...children,
              index > 0 && <sup>{textSegment[0]}</sup>,
              textSegment.slice(1),
            ]
          }, [])
      } else {
        return text.split('\n').flatMap((text, i) => [i > 0 && <br />, text])
      }
    },
  }

  const classes = useStyles()

  const navigateTo = (id) => {
    const el = window.document.getElementById(id)
    if (el) {
      const r = el.getBoundingClientRect()
      window.scrollTo({
        top: pageYOffset + r.top - 150,
        behavior: 'smooth',
      })
    }
  }

  const convertToSlug = (title) => {
    const titleStr = title && typeof title === 'string' ? title : title[1]
    return titleStr
      ? titleStr
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      : ''
  }

  const toc_items = article.fields.body?.content
    .filter((node) => node.nodeType == 'heading-2')
    .filter((node) => {
      const title = documentToPlainTextString(node)
      const titleStr = title && typeof title === 'string' ? title : title[1]
      if (titleStr) return true
      return false
    })
    .map((node) => {
      return {
        id: convertToSlug(documentToPlainTextString(node)),
        label: documentToPlainTextString(node),
      }
    })

  if (article.fields.blurb) {
    toc_items.unshift({ id: 'abstract', label: 'Abstract' })
  }

  const readingTime = () => {
    const text = document.getElementById('articleBody').innerText
    const wpm = 225
    const words = text.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return time
  }

  const paywall = true

  return (
    <Layout>
      <SEOHead seo={article?.fields?.seo ? article.fields.seo : article} />
      {article.fields.pdf && article.fields?.pdfFile?.fields?.file ? (
        <Container>
          <Box my={[5, 10]}>
            <PdfTitleBar
              title={article.fields.title}
              volume={article.fields.volumeNo}
              number={article.fields.issueNo}
              issueDate={dateFormat(article.fields.issueDate, 'longDate')}
            />
          </Box>

          <Box mb={10}>
            <PdfIframe
              title={article.fields.title}
              pdf={
                article.fields?.pdfFile?.fields?.file.url +
                '?' +
                imageoptimization.qualityParameter +
                '=' +
                imageoptimization.qualityValue
              }
            />
          </Box>
        </Container>
      ) : (
        <>
          <HeroArticle article={article} minuteRead={() => readingTime()} />
          <Grid container>
            <Grid item md={2} xs={false}>
              <Box
                ml={[2, 2, 2, 5]}
                my={6}
                className={classes.toc}
                display={['none', 'none', 'block']}
              >
                {toc_items && (
                  <TOCNav
                    toc_items={toc_items}
                    activeBorderWidth='4px'
                    backgroundColor='white'
                    borderLeft
                    maxWidth='290px'
                  />
                )}
              </Box>
            </Grid>
            <Grid item md={8} xs={12}>
              <Container maxWidth='lg' className={classes.root}>
                <Box id='abstract' className={classes.articleText} my={6}>
                  <TextStyle variant='articleAbstract'>
                    {documentToReactComponents(article.fields.blurb, options)}
                  </TextStyle>

                  <Box mt={3} className={classes.topics}>
                    {article.fields.premium && (
                      <TopicTag
                        label='Premium Resource'
                        variant='premium'
                        marginRight='15px'
                        textTransform='uppercase'
                      />
                    )}
                    {article.fields.topic && (
                      <TopicTag
                        key={article.fields.topic?.fields?.title}
                        label={article.fields.topic?.fields?.title}
                        variant='basicSmall'
                        marginRight='8px'
                        textTransform='uppercase'
                        onclick={() =>
                          router.push(
                            paths.search({
                              types: ['article'],
                              topics: [article.fields.topic.fields.title],
                            })
                          )
                        }
                      />
                    )}
                    {article.fields.topicSecondary
                      ?.filter((topic) => topic.fields)
                      .map((topic, key) => (
                        <TopicTag
                          key={key}
                          label={topic.fields.title}
                          variant='basicSmall'
                          marginRight='8px'
                          textTransform='uppercase'
                          onclick={() =>
                            router.push(
                              paths.search({
                                types: ['article'],
                                topics: [topic.fields.title],
                              })
                            )
                          }
                        />
                      ))}
                  </Box>

                  {paywall && (
                    <div
                      id='piano-bottom-ribbon'
                      className={classes.bottomRibbon}
                    />
                  )}
                  {paywall && (
                    <div id='piano-signup-wrapper'>
                      <div id='piano-container-template' />
                      <div id='piano-container' />
                    </div>
                  )}
                </Box>
                {article.fields.image && (
                  <Box className={classes.media} id='piano-hide-1'>
                    <Image
                      src={
                        article.fields?.image?.fields?.imageBynder
                          ? article.fields?.image?.fields?.imageBynder[0]?.src +
                            '?' +
                            imageoptimization.qualityParameter +
                            '=' +
                            imageoptimization.qualityValue
                          : article.fields?.image?.fields?.imageContentful
                              ?.fields?.file?.url
                          ? article.fields?.image?.fields?.imageContentful
                              ?.fields?.file?.url +
                            '?' +
                            imageoptimization.qualityParameter +
                            '=' +
                            imageoptimization.qualityValue
                          : '/images/ASCDImageFiller.png'
                      }
                      alt={article.fields?.image?.fields?.alternate}
                      style={{
                        paddingTop: 0,
                        width: '100%',
                        height: '460px',
                      }}
                      imageStyle={{
                        width: 'inherit',
                        height: 'inherit',
                      }}
                      cover='true'
                    />
                  </Box>
                )}
                <Box
                  mt={6}
                  ml={2}
                  display={['block', 'block', 'none']}
                  width='100%'
                >
                  {toc_items && (
                    <TOCNav
                      toc_items={toc_items}
                      activeBorderWidth='4px'
                      activeBorderColor='black'
                      backgroundColor='white'
                      borderLeft
                      maxWidth='290px'
                    />
                  )}
                </Box>
                <Box className={classes.articleText} my={6} id='piano-hide-2'>
                  <ArticleBody refresherKey={refresherKey}>
                    {documentToReactComponents(article.fields.body, options)}
                  </ArticleBody>

                  {article.fields.references &&
                    article.fields.references.content.length > 0 && (
                      <Box mt={6} id='references'>
                        <ArticleEndnote
                          title='References'
                          notes={article.fields.references}
                        />
                      </Box>
                    )}
                  {article.fields.endnotes &&
                    article.fields.endnotes.content.length > 0 && (
                      <Box mt={6} id='endnotes'>
                        <ArticleEndnote
                          title='End Notes'
                          notes={article.fields.endnotes}
                        />
                      </Box>
                    )}
                  {article.fields.authors && (
                    <Box mt={7} id='authors'>
                      <ArticleAuthors authors={article.fields.authors} />
                    </Box>
                  )}

                  <Box mt={9}>
                    <TextCTA
                      title='Want to add  your own highlights and notes for this article to access later?'
                      ctaLabel='Become a member today'
                      ctaLink={paths.subscribe}
                    />
                  </Box>

                  {relatedArticles.length > 0 && (
                    <Box mt={11}>
                      <ContentList
                        title='Related Articles'
                        ctaLabel='View all'
                        ctaLink={paths.search({
                          types: ['blog', 'article'],
                          topics: [article.fields.topic?.fields?.title],
                        })}
                        items={relatedArticles.slice(0, 5)}
                        variant='article'
                        lines={2}
                      />
                    </Box>
                  )}
                </Box>
              </Container>
            </Grid>
            <Grid item md={2} xs={12}>
              {relatedArticles.length > 0 && (
                <Box width='90%' mt={150} display={['none', 'none', 'block']}>
                  <ContentList
                    title='Related Articles'
                    items={relatedArticles.slice(0, 5)}
                    variant='article'
                    noImage
                    lines={3}
                  />
                </Box>
              )}

              {issue && (
                <Box
                  mt={[0, 0, 100]}
                  mb={8}
                  width='100%'
                  display='flex'
                  justifyContent={['center', 'center', 'flex-start']}
                >
                  <ArticleIssue issue={issue} />
                </Box>
              )}

              {user && user.id && (
                <Annotator
                  userId={user.id}
                  contentId={article.sys.id}
                  contentTitle={article.fields.title}
                  contentImgSrc={
                    article.fields?.image?.fields?.imageBynder
                      ? article.fields?.image?.fields?.imageBynder[0]?.src +
                        '?' +
                        imageoptimization.qualityParameter +
                        '=' +
                        imageoptimization.qualityValue
                      : article.fields?.image?.fields?.imageContentful?.fields
                          ?.file?.url
                      ? article.fields?.image?.fields?.imageContentful?.fields
                          ?.file?.url +
                        '?' +
                        imageoptimization.qualityParameter +
                        '=' +
                        imageoptimization.qualityValue
                      : '/images/ASCDImageFiller.png'
                  }
                  contentSlug={article.fields.slug}
                  updateSidebar={(status) => setSidebar(status)}
                  domId='articleBody'
                  reload={() => setRefresherKey(Math.random())}
                  refresherKey={refresherKey}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  )
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: 'article',
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
    content_type: 'article',
    'fields.slug': params.slug,
    include: 4,
  })

  if (!data || !data.items || data.items.length == 0) {
    return {
      notFound: true,
    }
  }

  const issue = await client.getEntries({
    content_type: 'pubissue',
    'fields.issueNo': data.items[0].fields.issueNo,
    'fields.volNo': data.items[0].fields.volumeNo,
    select:
      'fields.issueNo,fields.volNo,fields.slug,fields.title,fields.thumbnail',
    limit: 1,
  })

  const relatedArticles = await client.getEntries({
    content_type: 'article',
    'sys.id[ne]': data.items[0].sys.id,
    'fields.topic.sys.contentType.sys.id': 'categoryTopics',
    'fields.topic.fields.title': data.items[0].fields.topic?.fields
      ? data.items[0].fields.topic.fields.title
      : '',
    order: '-fields.issueDate',
  })

  return {
    props: {
      article: data.items.length ? data.items[0] : null,
      issue: issue.items.length ? issue.items[0] : null,
      relatedArticles: relatedArticles.items,
    },
    // Re-generate the post at most once per 10 seconds
    // if a request comes in
    // revalidate: 10,
  }
}
