import { useContext } from 'react'
import { Box, Grid, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import ImageTile from '@/components/molecules/imagetile'
import IssueTile from '@/components/molecules/issuetile'
import ViewAllCTA from '@/components/atoms/viewallcta'
import CartTile from '@/components/molecules/carttile'
import { AppContext } from '@/context/state'
import { hasMemberBookPrice } from '@/lib/access-validator'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  gridScrollable: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    maxWidth: '1600px',
    overflowX: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  title: {
    color: theme.palette.primary.light,
  },
  container: {
    position: 'relative',
    maxWidth: '1600px',
    [theme.breakpoints.down('md')]: {
      marginRight: '-16px',
    },
  },
  gridItem: {
    paddingBottom: `30px !important`,
  },
  sliderLeftCartTile: {},
  sliderRightCartTile: {},
  sliderLeft: {
    position: 'absolute',
    left: -30,
    top: 'calc(50% - 68px)',
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      left: -22,
    },
    '&$sliderLeftCartTile': {
      top: 'calc(50% - 136px)',
    },
  },
  sliderRight: {
    position: 'absolute',
    right: 2,
    top: 'calc(50% - 68px)',
    zIndex: 1,
    display: (length) => (length > 2 ? 'block' : 'none'),
    [theme.breakpoints.up('md')]: {
      right: -25,
      display: (length) => (length > 4 ? 'block' : 'none'),
    },
    [theme.breakpoints.up('sm')]: {
      right: -5,
    },
    '&$sliderRightCartTile': {
      top: 'calc(50% - 50px)',
    },
  },
  sliderBtn: {
    width: 40,
    height: 40,
    marginLeft: 20,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.light,
    border: '1px solid #C5CED1',
    boxShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.03), 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 3px 3px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.hover.main,
      color: theme.palette.text.secondary,
      border: '1px solid #0C8671',
    },
    '& svg': {
      width: 28,
      height: 28,
    },
  },
}))

export default function HorizontalScroll({
  title,
  ctaLabel = 'View all ',
  ctaLink = '/',
  items,
  type,
}) {
  const classes = useStyles(items.length)
  const { userAccessData } = useContext(AppContext)
  const useMemberBookPrice = hasMemberBookPrice(userAccessData)

  const scrollerRef = React.createRef()

  //To refactor later to acheve proper show/hide arrows logic
  const [sliderLeftArrow, showSliderLeftArrow] = React.useState(false)
  //const [sliderRightArrow, showSliderRightArrow] = React.useState(true)

  const slideWidth = () => {
    const childWidth = scrollerRef.current.firstElementChild.clientWidth
    const containerWidth = scrollerRef.current.clientWidth
    const containerLeftPadding = parseFloat(
      window
        .getComputedStyle(scrollerRef.current)
        .getPropertyValue('padding-left')
    )
    const scrollwidth = containerWidth - (childWidth + containerLeftPadding)

    return scrollwidth
  }

  const goLeft = () => {
    scrollerRef.current.scrollBy({
      left: -slideWidth(),
      top: 0,
      behavior: 'smooth',
    })
  }

  const goRight = () => {
    scrollerRef.current.scrollBy({
      left: slideWidth(),
      top: 0,
      behavior: 'smooth',
    })
    showSliderLeftArrow(true)
  }

  const sliderItems = items.slice(0, 12)

  const _renderSliderLeft = () => {
    if (sliderLeftArrow) {
      return (
        <Box
          className={
            type == 'carttile'
              ? `${classes.sliderLeft} ${classes.sliderLeftCartTile}`
              : classes.sliderLeft
          }
        >
          <IconButton
            aria-label='slide left'
            className={classes.sliderBtn}
            onClick={() => goLeft()}
          >
            <KeyboardArrowLeftIcon style={{ fontSize: 65 }} />
          </IconButton>
        </Box>
      )
    } else {
      return
    }
  }

  const _renderSliderRight = () => {
    // if (sliderRightArrow) {
    return (
      <Box
        className={
          type == 'carttile'
            ? `${classes.sliderRight} ${classes.sliderRightCartTile}`
            : classes.sliderRight
        }
      >
        <IconButton
          aria-label='slide right'
          className={classes.sliderBtn}
          onClick={() => goRight()}
        >
          <KeyboardArrowRightIcon style={{ fontSize: 65 }} />
        </IconButton>
      </Box>
    )
    //} else {return}
  }

  const _renderCartTile = (items) => {
    return items.map((item) => {
      return item.fields.bookVersions.map((version) => (
        <Grid
          item
          key={version.fields?.productNumber}
          className={classes.gridItem}
        >
          <CartTile
            snipcart={{
              label: 'Add to Cart',
              dataItemId: version.fields?.productNumber,
              dataItemName: item.fields?.title,
              dataItemAuthors: item.fields?.authors,
              dataItemUrl: item.fields?.slug,
              dataItemImage: item.fields?.thumbnail?.fields?.imageBynder
                ? item.fields?.thumbnail?.fields?.imageBynder[0]?.src +
                  '?' +
                  imageoptimization.qualityParameter +
                  '=' +
                  imageoptimization.qualityValue
                : item.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                    ?.url
                ? item.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                    ?.url +
                  '?' +
                  imageoptimization.qualityParameter +
                  '=' +
                  imageoptimization.qualityValue
                : '/images/ASCDImageFiller.png',
              dataItemDescription: item.fields?.description,
              dataItemPrice: useMemberBookPrice
                ? version.fields?.priceMember
                : version.fields?.priceNonMember,
              dataItemCustom1Value: version?.fields?.taxJar?.fields?.taxJarId
                ? version.fields.taxJar.fields.taxJarId
                : '',
              digitalFileGuid: version.fields?.digitalFileGuid,
            }}
          />
        </Grid>
      ))
    })
  }

  const _renderIssueTile = (items) => {
    return items.map((item) => (
      <Grid item key={item.fields.issueNo} className={classes.gridItem}>
        <IssueTile
          slug={item.fields.slug}
          imageUrl={
            item.fields?.thumbnail?.fields?.imageBynder
              ? item.fields?.thumbnail?.fields?.imageBynder[0]?.src +
                '?' +
                imageoptimization.qualityParameter +
                '=' +
                imageoptimization.qualityValue
              : item.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                  ?.url
              ? item.fields?.thumbnail?.fields?.imageContentful?.fields?.file
                  ?.url +
                '?' +
                imageoptimization.qualityParameter +
                '=' +
                imageoptimization.qualityValue
              : '/images/ASCDImageFiller.png'
          }
          title={item.fields.alternate}
          issue={item}
        />
      </Grid>
    ))
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography component='h2' variant='h4'>
          {title}
        </Typography>
        <ViewAllCTA href={ctaLink} label={ctaLabel} lg />
      </Box>

      <Box mt={1} ml={-1.25} className={classes.container}>
        <Grid
          container
          spacing={2}
          ref={scrollerRef}
          className={classes.gridScrollable}
        >
          {/* {type == 'imagetile' &&
            sliderItems.map((item, key) => (
              <Grid item key={`item-${key}`} className={classes.gridItem}>
                <ImageTile
                  slug={item.fields.slug}
                  imageUrl={
                    item.fields?.image?.fields?.imageBynder
                      ? item.fields?.image?.fields?.imageBynder[0]?.src
                      : item.fields?.image?.fields?.imageContentful?.fields
                          ?.file?.url
                  }
                  title={item.fields.title}
                />
              </Grid>
            ))} */}
          {type == 'carttile' && _renderCartTile(sliderItems)}
          {type == 'issuetile' && _renderIssueTile(sliderItems)}
        </Grid>
        {_renderSliderLeft()}
        {_renderSliderRight()}
      </Box>
    </>
  )
}
