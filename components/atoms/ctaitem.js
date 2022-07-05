import { makeStyles } from '@material-ui/core/styles'
import { Box, Grid, Typography } from '@material-ui/core'
import Image from 'material-ui-image'
import { useRouter } from 'next/router'
import imageoptimization from '@/const/imageoptimization'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',

    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      width: 199,
    },
  },
  media: {
    height: 96,
  },
  tagline: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 700,
    lineHeight: theme.typography.pxToRem(18),
    letterSpacing: 0.2,
    marginTop: 8,
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
    },
  },
  subTagline: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: 400,
    lineHeight: theme.typography.pxToRem(22),
    letterSpacing: 0.2,
    marginTop: 8,
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
    },
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
}))

export default function CtaItem({ icon, tagline, subtagline, url }) {
  const classes = useStyles()
  const router = useRouter()

  return (
    <Box
      className={classes.root}
      role='button'
      aria-label={`${tagline} button`}
      onClick={() => router.push(url)}
    >
      <Grid container alignItems='center'>
        <Grid item xs={4} md={12} className={classes.gridItem}>
          <Image
            src={
              icon?.fields?.imageBynder
                ? icon?.fields?.imageBynder[0]?.src +
                  '?' +
                  imageoptimization.qualityParameter +
                  '=' +
                  imageoptimization.qualityValue
                : icon?.fields?.imageContentful?.fields?.file?.url
                ? icon?.fields?.imageContentful?.fields?.file?.url +
                  '?' +
                  imageoptimization.qualityParameter +
                  '=' +
                  imageoptimization.qualityValue
                : '/images/ASCDImageFiller.png'
            }
            alt={icon?.fields?.alternate}
            style={{
              backgroundColor: 'transparent',
              width: 96,
              height: 96,
              paddingTop: 0,
            }}
            imageStyle={{ width: 96, height: 96 }}
          />
        </Grid>
        <Grid item xs={8} md={12} className={classes.gridItem}>
          <Typography className={classes.tagline}>{tagline}</Typography>
          <Typography className={classes.subTagline}>{subtagline}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
