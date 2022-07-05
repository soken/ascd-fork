import { Box, Container } from '@material-ui/core'
import { client } from '@/lib/contentful'
import Layout from '@/components/layout'
import SEOHead from '@/const/head'
import IssueBannerTitle from '@/components/molecules/issuebannertitle'
import AccordionList from '@/components/organisms/accordionlist'
import TextCTA from '@/components/molecules/textcta'
import { useRouter } from 'next/router'

export default function FAQ({ faqs, SEO }) {
  const router = useRouter()

  let myItems = faqs.map((faq) => {
    return {
      title: faq.fields.question,
      details: faq.fields.answer,
      slug: faq.fields.slug,
      filterCategory: faq.fields.services,
    }
  })

  return (
    <Layout>
      <SEOHead seo={SEO} />
      <Container maxWidth='lg'>
        <Box mt={10}>
          <IssueBannerTitle
            landing={{
              title: 'Frequently Asked Questions',
              subtitle:
                'Find answers to common questions across all ASCD resources, events, and services',
            }}
            align='center'
          />
        </Box>
      </Container>
      <Box mx={4}>
        <TextCTA
          title='Cannot find what you are looking for? Get in touch with our team.'
          ctaLabel='Contact Us'
          ctaLink='/'
          bgColor='transparent'
        />
      </Box>
      <Container maxWidth='lg'>
        <Box my={12}>
          <AccordionList
            filterType='Services'
            collapseText='Hide Answer'
            expandText='View Answer'
            myItems={myItems}
            service={router.query.service}
            slug={router.asPath?.split('#').pop()}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const faq = await client.getEntries({
    content_type: 'faq',
  })
  const SEOData = await client.getEntries({
    content_type: 'seo',
    'fields.id': 'faq',
  })

  return {
    props: {
      faqs: faq.items,
      SEO: SEOData.items.length ? SEOData.items[0] : {},
    },
  }
}
