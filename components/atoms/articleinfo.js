import { Box } from '@material-ui/core'
import TextStyle from '@/components/atoms/textstyle'
import { makeStyles } from '@material-ui/core/styles'
import TopicTag from '@/components/molecules/topictag'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
  topictag: {
    textTransform: 'uppercase',
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 3 /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
}))

export default function ArticleInfo({
  premium,
  topicTag,
  topicTagColor,
  title,
  authorName,
  datePublished,
  expand = false,
  authorSpace = false,
  ...props
}) {
  const classes = useStyles()

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')
  return (
    <Box
      className={classes.root}
      display='flex'
      flexDirection='column'
      justifyContent={`${expand ? 'space-between' : 'flex-start'}`}
    >
      {topicTag && (
        <Box display='flex'>
          <TopicTag
            variant='special'
            label={topicTag}
            color={topicTagColor ? topicTagColor : 'white'}
            premium={premium}
          />
        </Box>
      )}
      <Box className={classes.title}>
        <TextStyle variant={props.titleVariant ? props.titleVariant : 'h4'}>
          {title}
        </TextStyle>
      </Box>
      <Box mt={authorSpace ? 1.5 : 1}>
        <TextStyle variant='subtitle3'>
          {timeAgo.format(Date.parse(datePublished))}
          {authorName ? ' • ' + authorName : ''}
        </TextStyle>
      </Box>
    </Box>
  )
}
