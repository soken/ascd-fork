import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import paths from '@/paths/path'
import SnipcartButton from '@/components/snipcart/snipcartbutton'
import { useRouter } from 'next/router'
import TextStyle from '../atoms/textstyle'

const useStyles = makeStyles((theme) => ({
  tile: {
    position: 'relative',
    width: 205,
    height: '100%',
    padding: 10,
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow:
        '0px 8px 10px rgba(0, 0, 0, 0.03), 0px 3px 14px rgba(0, 0, 0, 0.04), 0px 5px 5px rgba(0, 0, 0, 0.08)!important',
      borderRadius: 4,
      '& $title': {
        color: theme.palette.hover.main,
        textDecoration: 'underline',
      },
    },
  },
  tileNoHover: {
    position: 'relative',
    width: 205,
    height: '100%',
    minHeight: 382,
    padding: 10,
    '& $cardActionRoot': {
      cursor: 'auto',
    },
  },
  media: {
    width: 185,
    height: 240,
    backgroundSize: '185px 240px',
  },
  details: {
    width: 170,
    height: 110,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  title: {
    marginTop: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2 /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
  author: {
    marginTop: theme.spacing(1),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    lineHeight: theme.typography.pxToRem(20),
    letterSpacing: 0.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 1 /* number of lines to show */,
    '-webkit-box-orient': 'vertical',
  },
  price: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 700,
    lineHeight: theme.typography.pxToRem(18),
    letterSpacing: '0.2px',
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  cardActionRoot: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
  button: {
    '& button': {
      '&:hover, &:focus': {
        color: theme.palette.text.secondary,
        border: '2px solid',
        borderColor: theme.palette.hover.main,
        textDecoration: 'underline',
        backgroundColor: theme.palette.hover.main,
      },
    },
  },
  snipcartBtn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    padding: '8px 16px',
    border: '2px solid #fff',
    borderRadius: '2px',
    height: 40,
    minWidth: '100%',
    padding: '0px 16px',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.hover.main,
      textDecoration: 'underline',
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 117,
    },
  },
  snipcartBtnSmall: {
    height: 32,
    fontSize: 12,
    lineHeight: '20px',
    padding: '0px 16px',
  },
}))

export default function CartTile({
  snipcart,
  onclick = null,
  noHover = false,
}) {
  const classes = useStyles({ noHover })
  const router = useRouter()

  return (
    <Card
      className={noHover ? classes.tileNoHover : classes.tile}
      square
      elevation={0}
    >
      <CardActionArea
        onClick={() =>
          noHover
            ? void 0
            : router.push(
                paths.book({
                  slug: snipcart.dataItemUrl,
                  variant: snipcart.dataItemId,
                })
              )
        }
        classes={{
          root: classes.cardActionRoot,
          focusHighlight: classes.focusHighlight,
        }}
        disableRipple
      >
        <CardMedia
          image={snipcart.dataItemImage}
          title={snipcart.dataItemName}
          className={classes.media}
        />

        <CardContent className={classes.details}>
          <Box height='78px'>
            <Box className={classes.title}>
              <TextStyle variant='h7'>{snipcart.dataItemName}</TextStyle>
            </Box>
            {snipcart?.dataItemAuthors[0].fields && (
              <Typography className={classes.author}>
                By {snipcart.dataItemAuthors[0].fields.title}
                {snipcart.dataItemAuthors.length > 1 ? ' Et al' : ''}
              </Typography>
            )}
          </Box>
          <Typography className={classes.price}>
            ${snipcart.dataItemPrice}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box className={classes.button}>
        <SnipcartButton
          className={noHover ? classes.snipcartBtn : classes.snipcartBtnSmall}
          snipcart={snipcart}
          onclick={() => (onclick ? onclick() : void 0)}
        />
      </Box>
    </Card>
  )
}
