import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Grid } from '@material-ui/core'
import CtaItem from '@/components/atoms/ctaitem'
import TextStyle from '@/components/atoms/textstyle'
import CtaButton from '@/components/atoms/ctabutton'
import BannerMessage from '@/components/atoms/bannermessage'
import ReactMarkdown from 'react-markdown'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props) =>
      props.isHeader
        ? theme.palette.grey.extraLight
        : theme.palette.common.white,
    borderBottomLeftRadius: 64,
    width: '100%',
    paddingBottom: theme.spacing(7),
    [theme.breakpoints.up('md')]: {
      height: 556,
      borderBottomLeftRadius: 180,
      paddingBottom: 0,
    },
  },
  container: {
    height: '100%',
    paddingTop: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(7),
      paddingRight: theme.spacing(7),
    },
    [theme.breakpoints.up('md')]: {
      paddingTop: 0,
    },
  },
  gridContainer: {
    height: '100%',
  },
  leftContent: {
    marginTop: 5,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginTop: 67,
      width: 427,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  rightContent: {
    marginTop: 0,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginTop: 60,
      width: 470,
    },
    '& .MuiGrid-spacing-xs-5 > .MuiGrid-item': {
      [theme.breakpoints.down('xs')]: {
        padding: '16px 18px',
      },
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  btnGroup: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
  },
  bannerHolder: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginTop: -22,
    },
  },
  banner: {
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    '& a': {
      textDecoration: 'underline',
    },
  },
}))

export default function Jumbotron({ valuepropositions, isHeader = false }) {
  const classes = useStyles({ isHeader })

  if (!valuepropositions) {
    return ''
  }

  const {
    title,
    ctaTagline,
    ctaValuePropositionItems,
    ctaAdditionalInfo,
    cta1 = null,
    cta2 = null,
  } = valuepropositions.fields

  return (
    <>
      <Box className={classes.root}>
        <Container
          maxWidth='lg'
          disableGutters={isHeader ? false : true}
          className={isHeader ? classes.container : ''}
        >
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} container justify='flex-start'>
              <Box className={classes.leftContent}>
                <TextStyle variant='h1'>{title}</TextStyle>
                <Box mt={2} mb={5}>
                  <TextStyle variant='subtitle1'>{ctaTagline}</TextStyle>
                </Box>
                <Grid container spacing={1} className={classes.btnGroup}>
                  <Grid item xs={12} md={6}>
                    {cta1 && (
                      <CtaButton
                        variant='contained'
                        color='primary'
                        label='Primary Button'
                        fullWidth
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {cta2 && (
                      <CtaButton
                        variant='outlined'
                        color='primary'
                        label='Secondary Button'
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} container justify='flex-end'>
              <Box className={classes.rightContent}>
                <Grid container spacing={5}>
                  {ctaValuePropositionItems &&
                    ctaValuePropositionItems.map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <CtaItem
                          icon={item.fields.icon}
                          tagline={item.fields.itemTagline}
                          subtagline={item.fields.itemDescription}
                          url={item.fields.itemCtaUrl}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {isHeader && (
        <Box
          display='flex'
          justifyContent='center'
          className={classes.bannerHolder}
        >
          <Box className={classes.banner}>
            <BannerMessage>
              <ReactMarkdown>{ctaAdditionalInfo}</ReactMarkdown>
            </BannerMessage>
          </Box>
        </Box>
      )}
    </>
  )
}
