import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import TextStyle from '@/components/atoms/textstyle'
import { Link, Box } from '@material-ui/core'
import { components } from '@/const/components'
import imageoptimization from '@/const/imageoptimization'

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      return (
        <Box my={6}>
          {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
        </Box>
      )
    },
    [INLINES.EMBEDDED_ENTRY]: (node, children) => {
      return (
        <Box my={6}>
          {components(node.data.target, Math.floor(Math.random() * 10 + 1))}
        </Box>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <Link
          href={node.data.uri}
          target={
            node.data.uri?.toLowerCase().startsWith('https://ascd.org')
              ? ''
              : '_blank'
          }
        >
          {children}
        </Link>
      )
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      return <Link href={node.data?.target?.fields?.slug}>{children}</Link>
    },
    [INLINES.ASSET_HYPERLINK]: (node, children) => {
      return (
        <Link
          href={
            node.data?.target?.fields?.file?.url +
            '?' +
            imageoptimization.qualityParameter +
            '=' +
            imageoptimization.qualityValue
          }
        >
          {children}
        </Link>
      )
    },
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
        style={{ marginTop: '20px' }}
      />
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Box my={2}>
        <TextStyle variant='body2'>{children}</TextStyle>
      </Box>
    ),
  },
}
export default options
