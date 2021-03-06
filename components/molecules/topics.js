import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import TextStyle from '@/components/atoms/textstyle'
import TopicTag from '@/components/molecules/topictag'
import paths from '@/paths/path'

const useStyles = makeStyles((theme) => ({
  root: {
    display: (props) => (props.center ? 'flex' : null),
    justifyContent: (props) => (props.center ? 'center' : null),
    alignItems: (props) => (props.center ? 'center' : null),
    flexDirection: (props) => (props.center ? 'column' : null),
    background: (props) => props.background,
    maxWidth: (props) => props.maxWidth,
  },
  topic: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.accent.paleGreen,
    textTransform: 'uppercase',
    border: 'none',
    padding: '12px, 16px, 12px, 16px',
    '&:hover': {
      backgroundColor: theme.palette.hover.primary + '!important',
      color: theme.palette.text.secondary + '!important',
      textDecoration: 'underline',
    },
  },
  topicsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: (props) => (props.center ? 'center' : 'left'),
    flexBasis: '100%',
    maxWidth: '90%',
  },
}))

export default function Topics({ title, topics, contentType, ...props }) {
  const classes = useStyles(props)
  const router = useRouter()

  const sortedTopics = [...new Set(topics)]

  sortedTopics.sort()

  return (
    <Box className={classes.root}>
      <Box textAlign={props.center ? 'center' : 'left'}>
        <TextStyle variant={props.titleVariant ? props.titleVariant : 'h2'}>
          {title}
        </TextStyle>
      </Box>
      <Box mt={4} className={classes.topicsContainer}>
        {sortedTopics.map((topic, key) => (
          <Box key={key} p={0.5}>
            <TopicTag
              label={topic}
              onclick={
                contentType
                  ? () =>
                      router.push(
                        paths.search({
                          types: [contentType],
                          topics: [topic],
                        })
                      )
                  : () =>
                      router.push(
                        paths.search({
                          topics: [topic],
                        })
                      )
              }
              ondelete={props.ondelete ? props.ondelete : null}
              deleteIcon={<img src='/images/closeIcon.svg' />}
              variant={props.variant ? props.variant : 'basic'}
              textTransform='uppercase'
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
