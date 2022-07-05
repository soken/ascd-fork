import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Avatar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TopicTag from '@/components/molecules/topictag'
import { useRouter } from 'next/router'
import TextStyle from '@/components/atoms/textstyle'
import ViewAllCTA from '@/components/atoms/viewallcta'
import Image from 'material-ui-image'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: ({ lines }) => (lines > 2 ? 0 : 126),
    margin: ({ variant }) => (variant == 'author' ? '-20px' : ''),
    padding: ({ variant }) => (variant == 'author' ? 20 : 10),
    '&:hover': {
      '& $titleLine': {
        color: theme.palette.hover.main,
        textDecoration: 'underline',
      },
      boxShadow:
        '0px 12px 17px rgba(0, 0, 0, 0.03), 0px 5px 22px rgba(0, 0, 0, 0.04), 0px 7px 8px rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.common.white,
    },
    backgroundColor: 'transparent',
  },
  mediaAuthor: {
    width: 128,
    height: 128,
    border: '4px solid white',
    boxShadow: theme.shadows[4],
  },
  mediaEvent: {
    width: 120,
    height: 96,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    [theme.breakpoints.up('md')]: {
      width: 150,
      height: 110,
    },
    objectFit: 'cover',
  },
  mediaEl: {
    width: 120,
    height: 100,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    [theme.breakpoints.up('md')]: {
      width: 200,
      height: 124,
    },
    objectFit: 'cover',
  },
  titleLine: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': ({ lines }) => lines /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
  bodyLine: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2 /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
  authorDesc: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 4 /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
  cardActionRoot: {
    display: 'flex',
    paddingLeft: ({ variant }) => variant == 'author' && theme.spacing(3),
    paddingRight: ({ variant }) => variant == 'author' && theme.spacing(3),
    flexDirection: ({ reverse, variant }) =>
      variant == 'author' ? 'column' : reverse ? 'row-reverse' : 'row',
    '&:hover $focusHighlight': {
      opacity: 0,
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
      flexDirection: ({ reverse }) => (reverse ? 'row-reverse' : 'row'),
    },
  },
  focusHighlight: {},
  cardContentRoot: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingLeft: ({ reverse }) => (reverse ? 0 : ''),

    [theme.breakpoints.up('md')]: {
      paddingRight: ({ reverse }) => (reverse ? 70 : ''),
    },
  },
  noPadding: {
    padding: 0,
  },
}))

export default function HorizontalCard({
  premium,
  label,
  title,
  date,
  image,
  ctaLink,
  body,
  reverse = false, // image is left
  variant = 'event', // el, article, event, author (same as paths)
  noImage = false,
  lines = 2,
}) {
  const classes = useStyles({ reverse, variant, lines })
  const router = useRouter()
  const imgUrl = image?.fields?.imageBynder
    ? `${image.fields.imageBynder[0]?.src}?${imageoptimization.qualityParameter}=${imageoptimization.qualityValue}`
    : image?.fields?.imageContentful?.fields?.file?.url
    ? `${image?.fields?.imageContentful?.fields?.file?.url}?${imageoptimization.qualityParameter}=${imageoptimization.qualityValue}`
    : '/images/ASCDImageFiller.png'

  return (
    <Card className={classes.root} elevation={0}>
      <CardActionArea
        onClick={() => (ctaLink ? router.push(ctaLink) : null)}
        classes={{
          root: classes.cardActionRoot,
          focusHighlight: classes.focusHighlight,
        }}
        disableRipple
      >
        {!noImage && (
          <CardMedia title={image?.fields?.title}>
            {variant == 'author' ? (
              <Avatar
                alt={image?.fields?.title}
                src={imgUrl}
                className={classes.mediaAuthor}
              />
            ) : (
              <img
                style={{ borderRadius: 4, backgroundColor: '#E4E9EC' }}
                src={imgUrl}
                alt={image?.fields?.title}
                className={
                  variant == 'event' ? classes.mediaEvent : classes.mediaEl
                }
              />
            )}
          </CardMedia>
        )}

        <CardContent
          className={`${classes.cardContentRoot} ${
            lines > 2 && classes.noPadding
          }`}
        >
          <Box display='flex'>
            {premium && (
              <Image
                src='/images/premium.svg'
                style={{ width: 20, height: 20, paddingTop: 0, marginRight: 5 }}
              />
            )}
            {label && <TopicTag variant='special' label={label} />}
          </Box>

          {title && (
            <Box className={classes.titleLine}>
              <TextStyle variant={lines > 2 ? 'h6' : 'h5'}>{title}</TextStyle>
            </Box>
          )}

          {body && (
            <Box
              display='flex'
              flexDirection='column'
              alignContent='space-between'
              height='100%'
            >
              <Box
                className={
                  variant == 'author' ? classes.authorDesc : classes.bodyLine
                }
              >
                <TextStyle variant='body2'>{body}</TextStyle>
              </Box>
              {variant == 'author' && (
                <Box mt={2}>
                  <ViewAllCTA href={ctaLink} label='Learn More' lg />
                </Box>
              )}
            </Box>
          )}

          {date && (
            <Box mt={1.5}>
              <TextStyle variant='caption' color='#546366'>
                {date}
              </TextStyle>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
