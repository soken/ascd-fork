import React from 'react'
import { client } from '@/lib/contentful'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import Layout from '@/components/layout'
import SEOHead from '@/const/head'
import { Box, Container, Divider, Grid } from '@material-ui/core'
import Banner from '@/components/molecules/banner'
import _ from 'lodash'
import { sortBy } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FilterDropdown from '@/components/atoms/filterdropdown'
import TwoColumnCta from '@/components/molecules/twocolumncta'
import Directory from '@/components/molecules/directory'
import TextStyle from '@/components/atoms/textstyle'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'space-betweeen',
    marginTop: '10px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  ddl: {
    width: '100%',
  },
  medium: {
    width: '120px',
    height: '120px',
  },
  textField: {
    width: '100%',
    height: 56,
  },
  input: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: 700,
    lineHeight: theme.typography.pxToRem(26),
    letterSpacing: 0.2,
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(20),
      lineHeight: theme.typography.pxToRem(28),
    },
  },
  groupHeader: {
    color: '#C4C4C4',
  },
  divider: {
    backgroundColor: '#C5CED1',
    height: '40px',
    marginTop: -25,
  },
}))

export default function AllAuthors({ authors, SEO }) {
  const classes = useStyles()

  const sortedAuthors = sortBy(authors, (item) =>
    item.fields.lastName.trim().toUpperCase()
  )

  const result = _(sortedAuthors)
    .filter((author) => author.fields.lastName)
    .groupBy((o) => {
      const ln = o.fields.lastName.trim()
      return ln[0].toUpperCase()
    })
    .map((contacts, letter) => ({ letter, contacts }))
    .value()

  const [state, setState] = useState({
    topicsFilter: [],
  })
  const [topic, setTopic] = useState('')
  const [searchText, setSearchText] = useState('')

  const { topicsFilter } = state

  useEffect(() => {
    const topicsFilter = authors
      .map((myItem) => myItem.fields.expertise)
      .flat()
      .map((exp) => exp?.fields?.title)
      .reduce((unique, o) => {
        if (!unique.some((obj) => obj === o)) {
          unique.push(o)
        }
        return unique
      }, [])
      .sort()

    topicsFilter.unshift(`All Topics`)

    setState({ ...state, topicsFilter: topicsFilter })
  }, [])

  useEffect(() => {
    if (topicsFilter.length > 0) {
      setTopic(topicsFilter[0])
    }
  }, [topicsFilter])

  return (
    <Layout>
      <SEOHead seo={SEO} />
      <Banner
        header1='Meet the ASCD Authors'
        header2='Get to know our ASCD authors shaping the education landscape'
      />
      <Container>
        <Grid container className={classes.searchBar} spacing={4}>
          <Grid item xs={12} md={10}>
            <Input
              placeholder='Search by name'
              onChange={(e) => setSearchText(e.target.value)}
              className={classes.textField}
              classes={{
                input: classes.input,
              }}
              endAdornment={
                <InputAdornment position='end'>
                  <Divider
                    orientation='vertical'
                    variant='middle'
                    flexItem
                    className={classes.divider}
                  />
                  <Box>
                    <SearchIcon />
                  </Box>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FilterDropdown
              items={topicsFilter}
              defaultValue={topic}
              action={(filterVal) => setTopic(filterVal)}
              marginLeft='0px'
            />
          </Grid>
        </Grid>
      </Container>
      {result.map((item, index) => {
        const filteredContacts = item.contacts
          .filter((subitem) => {
            if (topic !== `All Topics`) {
              if (
                !subitem.fields.expertise ||
                (subitem.fields.expertise &&
                  !subitem.fields.expertise.some(
                    (obj) => obj.fields?.title === topic
                  ))
              )
                return false
            }
            return true
          })
          .filter((subitem) => {
            if (searchText !== '') {
              if (
                !(subitem.fields.firstName + subitem.fields.lastName)
                  .toUpperCase()
                  .replace(/\s/g, '')
                  .includes(searchText.toUpperCase().replace(/\s/g, ''))
              )
                return false
            }
            return true
          })
        return (
          filteredContacts.length > 0 && (
            <Container key={item.letter}>
              <Box my={2} ml={2}>
                <TextStyle variant='h1'> {item.letter} </TextStyle>
              </Box>
              <Directory items={filteredContacts} />
            </Container>
          )
        )
      })}
      <Container>
        <Box my={11}>
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
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const maxEntries = 1000
  let offset = 0
  let items = []
  let processedEntries = null
  while (processedEntries !== 0) {
    const entries = await client.getEntries({
      content_type: 'profile',
      'fields.authorStatus[ne]': 'Archive',
      select:
        'fields.title,fields.thumbnail,fields.slug,fields.lastName,fields.firstName,fields.expertise',
      skip: offset,
      limit: maxEntries,
    })

    processedEntries = entries.items.length

    if (processedEntries > 0) {
      offset += processedEntries
      items.push(...entries.items)
    }
  }

  const SEOData = await client.getEntries({
    content_type: 'seo',
    'fields.id': 'authors',
  })

  return {
    props: {
      authors: items,
      SEO: SEOData.items.length ? SEOData.items[0] : {},
    },
  }
}
