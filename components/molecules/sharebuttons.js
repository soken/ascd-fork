import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

const useStyles = makeStyles(() => ({
  root: {},
}))

const _renderEmailSubject = (title) => {
  return `${title} via ASCD`
}

const _renderEmailBody = (url, title) => {
  return `${title} via ASCD`
}

const _renderShareUrl = (url) => {
  const baseprotocol = process.env.NEXT_PUBLIC_BASE_PROTOCOL
  const basepath = process.env.NEXT_PUBLIC_BASE_PATH

  return `${baseprotocol}://${basepath}${url}`
}

export default function ShareButtons({ url, title, showEmailLink }) {
  const classes = useStyles()

  return (
    <Box display='flex' flexDirection='row'>
      <Box mr={1}>
        <FacebookShareButton
          url={_renderShareUrl(url)}
          quote={`${title} via ASCD`}
        >
          <FacebookIcon size={38} borderRadius={10} />
        </FacebookShareButton>
      </Box>
      <Box mr={1}>
        <LinkedinShareButton
          url={_renderShareUrl(url)}
          title={title}
          summary={title}
          source='via ASCD'
        >
          <LinkedinIcon size={38} borderRadius={10} />
        </LinkedinShareButton>
      </Box>
      <Box mr={1}>
        <TwitterShareButton url={_renderShareUrl(url)} title={title} via='ASCD'>
          <TwitterIcon size={38} borderRadius={10} />
        </TwitterShareButton>
      </Box>
      {showEmailLink ? (
        <EmailShareButton
          url={_renderShareUrl(url)}
          subject={_renderEmailSubject(title)}
          body={_renderEmailBody(_renderShareUrl(url), title)}
        >
          <EmailIcon size={38} borderRadius={10} />
        </EmailShareButton>
      ) : (
        ''
      )}
    </Box>
  )
}
