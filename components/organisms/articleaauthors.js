import { Box, Divider } from '@material-ui/core'
import TextStyle from '@/components/atoms/textstyle'
import HorizontalCard from '@/components/molecules/horizontalcard'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import paths from '@/paths/path'
import { Fragment } from 'react'
import options from '@/const/options'

export default function ArticleAuthors({ authors, title }) {
  return (
    <Box>
      {title && (
        <Box>
          <TextStyle variant='h3'>{title}</TextStyle>
        </Box>
      )}
      {authors
        .filter((author) => author.fields)
        .map((author, key) => {
          const divider = authors.length > key + 1
          return (
            <Fragment key={key}>
              <Box my={5}>
                <HorizontalCard
                  key={author.fields.slug}
                  body={documentToReactComponents(
                    author.fields.description,
                    options
                  )}
                  image={author.fields.thumbnail}
                  ctaLink={paths.author({ slug: author.fields.slug })}
                  reverse
                  variant='author'
                />
              </Box>
              {divider && <Divider />}
            </Fragment>
          )
        })}
    </Box>
  )
}
