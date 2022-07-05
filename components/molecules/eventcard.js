import { Card, CardContent, CardMedia, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TextStyle from '@/components/atoms/textstyle'
import ViewAllCTA from '@/components/atoms/viewallcta'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  media: {
    minWidth: 295,
    height: 190,
    [theme.breakpoints.up('md')]: {
      minWidth: 206,
      height: 190,
    },
    '& img': {
      objectFit: 'cover',
      borderRadius: '4px',
    },
  },
  mainmedia: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
}))

export default function EventCard({
  image,
  alt,
  title,
  body,
  ctaLabel,
  ctaLink,
}) {
  const classes = useStyles()

  return (
    <Card elevation='0' className={classes.root}>
      {image && (
        <CardMedia title={alt} className={classes.media}>
          <img src={image} alt={alt} width='100%' height='190px' />
        </CardMedia>
      )}
      <CardContent className={classes.cardContent}>
        <TextStyle variant='h5'>{title}</TextStyle>
        <TextStyle variant='subtitle3'>{body}</TextStyle>
        {ctaLabel && (
          <Box mt={2}>
            <ViewAllCTA href={ctaLink} label={ctaLabel} />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
