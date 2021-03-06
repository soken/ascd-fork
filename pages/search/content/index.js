import { algoliaSearchIndex } from '@/lib/algolia'
import { client } from '@/lib/contentful'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { Box, Container, Typography } from '@material-ui/core'
import Head from 'next/head'
import React from 'react'
import paths from '@/paths/path'

// const importContent = process.env.NEXT_PUBLIC_ALGOLIA_REINDEX
//   ? process.env.NEXT_PUBLIC_ALGOLIA_REINDEX
//   : false

const maxPubIssueEntries = 1
const maxBookEntries = 1
const maxEntries = 50
const debug = false

async function _indexContentToAlgolia(contentToIndex) {
  const indexedContent = await algoliaSearchIndex.saveObjects(contentToIndex)
  debug ? console.log(indexedContent.objectIDs) : null
  return indexedContent.objectIDs ? indexedContent.objectIDs : {}
}
function _indexArticles(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'article',
    url: paths.article({ slug: item.fields.slug }),
    title: item.fields.title,
    content: documentToPlainTextString(item.fields.body),
    topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
    dateTimeStamp: item.fields.issueDate,
    grade: _helperGetCategories(item.fields.grade),
    subject: _helperGetCategories(item.fields.subject),
    role: _helperGetCategories(item.fields.role),
    keywords: _helperGetKeywords(
      item.fields.keywords,
      item.fields.secondaryKeywords
    ),
    premium: item.fields.premium,
    author: _helperGetAuthor(item.fields.authors),
    featured: item.fields.featured,
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexBlogs(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'blog',
    url: paths.blog({ slug: item.fields.slug }),
    title: item.fields.title,
    content: documentToPlainTextString(item.fields.body),
    topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
    dateTimeStamp: item.fields.date,
    thumbnail: _helperGetImage(item.fields.thumbnail),
    author: _helperGetAuthor(item.fields.authors),
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexBooks(data) {
  const contentToIndex = []
  data.map((item) => {
    const book = {
      objectID: item.sys.id,
      type: 'book',
      url: paths.book({ slug: item.fields.slug }),
      content: documentToPlainTextString(item.fields.description),
      topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
      yearPublished: new Date(item.fields.datePublished).getFullYear(),
      language: _helperGetLanguages(item.fields.languages),
      premium: item.fields.premium,
      author: _helperGetAuthor(item.fields.authors),
      thumbnail: _helperGetImage(item.fields.thumbnail),
      description: documentToPlainTextString(item.fields.description),
      featured: item.fields.featured,
    }
    item.fields.bookVersions?.map((version) => {
      book.title = `${item.fields.title} - ${version.fields?.bookType?.fields?.title}`
      book.priceMember = version.fields?.priceMember
      book.priceNonmember = version.fields?.priceNonMember
      book.digitalFileGuid = version.fields?.digitalFileGuid
      book.taxJarId = version?.fields?.taxJar?.fields?.taxJarId
        ? version.fields.taxJar.fields.taxJarId
        : ''
      book.dateTimeStamp = version.fields?.dateRelease
      book.bookFilters = _helperGetBookFilters(
        item.fields?.featured,
        version.fields?.dateRelease,
        item.fields?.quickRead
      )
      book.productNumber = version.fields?.productNumber
    })
    contentToIndex.push(book)
  })
  return _indexContentToAlgolia(contentToIndex)
}
function _indexPages(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'page',
    url: `/${item.fields.slug}`,
    title: item.fields.title,
    content: item.fields.summary,
    dateTimeStamp: item.sys.updatedAt,
    // topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexPodcasts(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'podcast',
    url: paths.podcast({ slug: item.fields.slug }),
    title: item.fields.title,
    content: documentToPlainTextString(item.fields.description),
    topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
    dateTimeStamp: item.fields.date,
    premium: item.fields.premium,
    author: _helperGetAuthor(item.fields.authors),
    thumbnail: _helperGetImage(item.fields.thumbnail),
    featured: item.fields.featured,
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexVideos(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'video',
    url: paths.video({ slug: item.fields.slug }),
    title: item.fields.title,
    content: documentToPlainTextString(item.fields.description),
    topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
    dateTimeStamp: item.fields.videoDate,
    premium: item.fields.premium,
    author: _helperGetAuthor(item.fields.authors),
    thumbnail: _helperGetImage(item.fields.thumbnail),
    featured: item.fields.featured,
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexWebinars(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'webinar',
    url: paths.webinar({ slug: item.fields.slug }),
    title: item.fields.title,
    content: documentToPlainTextString(item.fields.description),
    topic: _helperGetTopics(item.fields.topic, item.fields.topicSecondary),
    dateTimeStamp: item.fields.date,
    premium: item.fields.premium,
    author: _helperGetAuthor(item.fields.authors),
    thumbnail: _helperGetImage(item.fields.thumbnail),
    featured: item.fields.featured,
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _indexPublications(data) {
  const contentToIndex = data.map((item) => ({
    objectID: item.sys.id,
    type: 'pubissue',
    url: paths.el({ slug: item.fields.slug }),
    title: item.fields.title,
    thumbnail: _helperGetImage(item.fields.thumbnail),
    shortDescription: documentToPlainTextString(item.fields.shortDescription),
    description: documentToPlainTextString(item.fields.description),
    volNo: item.fields.volNo,
    issueNo: item.fields.issueNo,
    dateTimeStamp: item.fields.publicationDate,
    express: item.fields.express,
    topic: _helperGetTopics(item.fields.topics, item.fields.topicSecondary),
    // articles: _helperGetValues(item.fields.articles),
    podcast: _helperGetTopics(item.fields.podcast),
    video: _helperGetTopics(item.fields.video),
    featuredImage: _helperGetTopics(item.fields.featuredImage),
  }))
  return _indexContentToAlgolia(contentToIndex)
}
function _helperGetImage(image) {
  const imageUrl = image?.fields?.imageBynder
    ? image?.fields?.imageBynder[0]?.src
    : image?.fields?.imageContentful?.fields?.file?.url
    ? image?.fields?.imageContentful?.fields?.file?.url
    : '/images/ASCDImageFiller.png'

  return imageUrl
}
function _helperGetTopics(topic, topicSecondary) {
  // Process secondary topics.
  let topics = []
  if (topicSecondary)
    topics = topicSecondary.map((item) =>
      item.fields !== undefined ? item.fields.title : ''
    )
  // Add main topic.
  topic && topic.fields ? topics.push(topic.fields.title) : ''
  return topics
}
function _helperGetCategories(category) {
  if (!category) {
    return []
  }
  // Process secondary topics.
  let keywords = []
  keywords = category.map((item) =>
    item.fields !== undefined ? item.fields.title : ''
  )
  return keywords
}
function _helperGetKeywords(primaryKeyword, secondaryKeyword) {
  let keywords,
    pkeywords,
    skeywords = []
  pkeywords = _helperGetValues(primaryKeyword)
  skeywords = _helperGetCategories(secondaryKeyword)
  keywords = pkeywords.concat(skeywords)
  return keywords
}
function _helperGetValues(multiValuedDataSet) {
  if (!multiValuedDataSet) {
    return []
  }
  // Process secondary topics.
  let returnedValues = []
  returnedValues = multiValuedDataSet.map((item) =>
    item.fields !== undefined ? item.fields.title : null
  )

  returnedValues = returnedValues.filter((el) => {
    return el != null
  })

  return returnedValues
}
function _helperGetLanguages(languages) {
  if (!languages) {
    return []
  }
  return languages.map((item) => (item.fields ? item.fields.title : ''))
}
function _helperGetBookFilters(featured, dateReleased, quickRead) {
  const values = []
  if (featured) values.push('Featured')
  if (dateReleased) {
    const released = Date.parse(dateReleased)
    const today = new Date().getTime()
    if (released >= today - 90 * 24 * 60 * 60 * 1000 && released <= today)
      values.push('New Releases')
    if (released > today) values.push('Upcoming Pre-Order Books')
  }
  if (quickRead) values.push('Quick Read / Guides')
  return values
}
function _helperGetAuthor(authors) {
  let authorList = []

  if (authors) {
    authorList = authors.map((item) =>
      item.fields !== undefined ? item.fields.title : null
    )
  }
  authorList = authorList.filter((el) => {
    return el != null
  })
  return authorList
}
export default function SearchContent({ importComplete }) {
  return (
    // <Layout>
    <div>
      <Head>
        <title>ASCD: Professional Learning &amp; Community for Educators</title>
      </Head>
      <Container maxWidth='lg'>
        <Box my={20}>
          {importComplete ? (
            <Box>
              Import Completed. Please check for changes directly on the Search
              page.
            </Box>
          ) : (
            <Typography>
              To start indexing, append <code>?import=true</code> to the URL to
              import. Then, do each content type by batch by appending below:
              <ul>
                <li>
                  <code>&amp;batch=1</code> - Publications
                </li>
                <li>
                  <code>&amp;batch=2</code> - Books
                </li>
                <li>
                  <code>&amp;batch=3</code> - Articles
                </li>
                <li>
                  <code>&amp;batch=4</code> - Blogs
                </li>
                <li>
                  <code>&amp;batch=5</code> - Pages
                </li>
                <li>
                  <code>&amp;batch=6</code> - Podcasts
                </li>
                <li>
                  <code>&amp;batch=7</code> - Videos
                </li>
                <li>
                  <code>&amp;batch=8</code> - Webinars
                </li>
              </ul>
            </Typography>
          )}
        </Box>
      </Container>
    </div>
    // </Layout>
  )
}

export async function getServerSideProps(context) {
  if (context.query.import) {
    let contentType = ''
    let offset = 0
    let items = []
    let processedEntries = null
    switch (context.query.batch) {
      case '1':
        // Index Publications.
        contentType = 'pubissue'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxPubIssueEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexPublications(items)
        break
      case '2':
        // Index Books.
        contentType = 'book'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxBookEntries,
            include: 2,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexBooks(items)
        break
      case '3':
        // Index Articles.
        contentType = 'article'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexArticles(items)
        break
      case '4':
        // Index Blogs.
        contentType = 'blog'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexBlogs(items)
        break
      case '5':
        // Index Pages.
        contentType = 'page'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexPages(items)
        break
      case '6':
        // Index Podcast.
        contentType = 'podcast'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexPodcasts(items)
        break
      case '7':
        // Index Videos.
        contentType = 'video'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexVideos(items)
        break
      case '8':
      default:
        // Index Webinars.
        contentType = 'webinar'
        offset = 0
        items = []
        processedEntries = null
        while (processedEntries !== 0) {
          const entries = await client.getEntries({
            content_type: contentType,
            skip: offset,
            limit: maxEntries,
          })

          processedEntries = entries.items.length

          if (processedEntries > 0) {
            offset += processedEntries
            items.push(...entries.items)
          }
        }
        _indexWebinars(items)
        break
    }

    return {
      props: {
        importComplete: true,
      },
    }
  }
  return {
    props: {
      importComplete: false,
    },
  }
}
/* export async function getStaticProps() {
  console.log(typeof window)

  if (!importContent) {

    return {
      props: {},
    }
  }
  console.log("#### Reindexing Algolia Search ####")
  let contentType = ''
  let offset = 0
  let items = []
  let processedEntries = null

  // Index Publications.
  contentType = 'pubissue'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxPubIssueEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexPublications(items)

  // Index Books.
  contentType = 'book'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexBooks(items)

  // Index Articles.
  contentType = 'article'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexArticles(items)

  // Index Blogs.
  contentType = 'blog'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexBlogs(items)

  // Index Pages.
  contentType = 'page'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexPages(items)

  // Index Podcast.
  contentType = 'podcast'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexPodcasts(items)

  // Index Videos.
  contentType = 'video'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexVideos(items)

  // Index Webinars.
  contentType = 'webinar'
  offset = 0
  items = []
  processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: contentType,
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }
  _indexWebinars(items)

  return {
    props: {},
  }
}
 */
