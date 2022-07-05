import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  FilledInput,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FooterMenu from '@/components/molecules/footermenu'
import SocialButtons from '@/components/molecules/socialbuttons'
import Link from '@/components/atoms/link'
import NLink from 'next/link'
import SendIcon from '@material-ui/icons/Send'
import Image from 'material-ui-image'
import TextStyle from '@/components/atoms/textstyle'
import paths from '@/paths/path'

const useStyles = makeStyles((theme) => ({
  greyBg: {
    backgroundColor: theme.palette.background.main,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    background: theme.palette.accent.darkGreen,
    borderTopLeftRadius: 48,
    '& *': {
      color: theme.palette.common.white,
    },
    [theme.breakpoints.up('md')]: {
      borderTopLeftRadius: 96,
      alignContent: 'flex-start',
      height: 400,
    },
  },
  container: {
    padding: '50px 3vw 5px',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between',
      textAlign: 'left',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '50px 3vw 5px',
    },
    [theme.breakpoints.up('xl')]: {
      padding: '50px 10vw 5px',
    },
    '& > div': {
      [theme.breakpoints.down('sm')]: {
        maxWidth: '450px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
  },
  logo: {
    '& > div': {
      margin: 'auto',
      [theme.breakpoints.up('md')]: {
        marginLeft: 0,
      },
    },
  },
  footerFirstColumn: {
    width: '30%',
    [theme.breakpoints.down('lg')]: {
      width: '25%',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '48px',
      width: '100%',
    },
    '& > .MuiBox-root': {
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
      },
    },
  },
  footerColumns: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '65%',
    [theme.breakpoints.down('xl')]: {
      marginLeft: 40,
    },
    [theme.breakpoints.down('lg')]: {
      width: '60%',
      marginLeft: 0,
    },
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
    },
  },
  footerColumn: {
    flex: 1,
    '& > .MuiBox-root': {
      [theme.breakpoints.down('sm')]: {
        paddingRight: 0,
        marginBottom: '28px',
        marginTop: 0,
      },
      [theme.breakpoints.up('md')]: {
        paddingRight: 0,
        marginLeft: '20px',
      },
      [theme.breakpoints.up('lg')]: {
        marginLeft: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        marginLeft: 60,
      },
    },
    '&:last-of-type': {
      [theme.breakpoints.up('md')]: {
        minWidth: 240,
      },
      '& > .MuiBox-root': {
        [theme.breakpoints.up('lg')]: {
          marginLeft: '20px',
        },
        [theme.breakpoints.up('xl')]: {
          marginLeft: '20px',
        },
        [theme.breakpoints.down('sm')]: {
          marginBottom: 32,
        },
      },
    },
    '&:nth-of-type(3)': {
      '& > .MuiBox-root': {
        [theme.breakpoints.down('sm')]: {
          marginBottom: '48px',
        },
      },
    },
  },
  bottomStack: {
    padding: '0 1vw 5px',
    [theme.breakpoints.up('lg')]: {
      padding: '0 3vw 5px',
    },
    [theme.breakpoints.up('xl')]: {
      padding: '0 10vw 5px',
    },
  },
  text: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '400',
  },
  newsletterTextfield: {
    width: '100%',
    backgroundColor: theme.palette.common.white,
    borderRadius: '4px',
    '& label': {
      color: theme.palette.common.black,
    },
    '& .MuiFilledInput-root, .MuiFilledInput-root:hover': {
      backgroundColor: theme.palette.common.white,
      '& input': {
        color: theme.palette.grey.medium,
      },
      '& .MuiInputAdornment-root': {
        cursor: 'pointer',
      },
      '& .MuiInputAdornment-root svg path': {
        color: theme.palette.grey.medium,
      },
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(12px, 10px) scale(0.75)',
    },
  },
  newsletterTextfieldLabel: {
    paddingRight: 38,
    transform: 'translate(14px, 12px) scale(1)',
    [theme.breakpoints.up('md')]: {
      transform: 'translate(14px, 20px) scale(1)',
    },
    [theme.breakpoints.up('lg')]: {
      transform: 'translate(14px, 20px) scale(1)',
    },
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(14px, 21px) scale(1)',
    },
  },
  divider: {
    marginBottom: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subLink: {
    '& a': {
      opacity: 0.8,
      textDecoration: 'underline',
      '&:hover': {
        opacity: 1,
      },
    },
  },
  copyrightLine: {
    flexDirection: 'column-reverse',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '450px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '& $copyrightLine > .MuiBox-root': {
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
        marginTop: '10px',
        justifyContent: 'space-between',
        '& $subLink': {
          margin: '0 12px',
        },
      },
    },
  },
  socialButtons: {
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
}))

const about = [
  {
    label: 'Who we are',
    href: '/about',
  },
  {
    label: 'Career opportunities',
    href: 'https://theapplicantmanager.com/careers?co=ai',
  },
  {
    label: 'Government relations',
    href: '/government-relations',
  },
  {
    label: 'News & Media',
    href: '/news-media',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]
const involved = [
  {
    label: 'Membership',
    href: '/memberships',
  },
  {
    label: 'Affiliates',
    href: '/affiliates',
  },
  {
    label: 'Emerging Leaders',
    href: '/emerging-leaders',
  },
  {
    label: 'Communities',
    href: '/communities',
  },
  {
    label: 'Write for ASCD',
    href: '/write-for-ascd',
  },
]
const partner = [
  {
    label: 'Advertisers',
    href: '/advertisers',
  },
  {
    label: 'Distributors',
    href: '/distributors',
  },
  {
    label: 'Event Sponsors',
    href: 'http://events.ascd.org/sponsors-and-exhibitors',
  },
  {
    label: 'Exhibitors',
    href: 'http://events.ascd.org/sponsors-and-exhibitors',
  },
  {
    label: 'More opportunities',
    href: '/partners',
  },
]
export default function Footer({ grey }) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    email: '',
  })

  const handleNewsletter = (event) => {
    setValues({ ...values, email: event.target.value })
  }

  return (
    <footer className={grey ? classes.greyBg : ''}>
      <Container maxWidth={false} className={classes.root}>
        <Grid container className={classes.container}>
          <Grid className={classes.footerFirstColumn}>
            <Box mb={3} className={classes.logo}>
              <NLink href='/'>
                <Image
                  src={'/images/fulllogo_white.svg'}
                  alt='ascd logo'
                  style={{
                    paddingTop: 0,
                    width: '109px',
                    height: '29px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                  imageStyle={{ position: 'static' }}
                />
              </NLink>
            </Box>
            <Box mr={[0, 7]}>
              <Typography variant='h6' className={classes.text}>
                ASCD empowers educators to achieve excellence in learning,
                teaching, and leading so that every child is healthy, safe,
                engaged, supported, and challenged.
              </Typography>
            </Box>
          </Grid>
          <Grid container justify='flex-end' className={classes.footerColumns}>
            <Grid item className={classes.footerColumn}>
              <FooterMenu title='About ASCD' items={about} />
            </Grid>
            <Grid item className={classes.footerColumn}>
              <FooterMenu title='Get Involved' items={involved} />
            </Grid>
            <Grid item className={classes.footerColumn}>
              <FooterMenu title='Partner with Us' items={partner} />
            </Grid>
            <Grid item className={classes.footerColumn}>
              <Box mt={[4, 0]}>
                <TextStyle variant='h5'>Sign up for our newsletter</TextStyle>
                <Box mt={2} mb={4}>
                  <FormControl
                    className={classes.newsletterTextfield}
                    variant='outlined'
                  >
                    <InputLabel
                      color='primary'
                      htmlFor='footer-newsletter-signup'
                      className={classes.newsletterTextfieldLabel}
                    >
                      Your email address
                    </InputLabel>
                    <FilledInput
                      id='footer-newsletter-signup'
                      type='text'
                      value={values.email}
                      onChange={(e) => handleNewsletter(e)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <SendIcon />
                        </InputAdornment>
                      }
                      fullWidth
                      labelWidth={150}
                    />
                  </FormControl>
                </Box>
                <TextStyle variant='h5'>Questions?</TextStyle>
                <Box mt={0.75}>
                  <Link href='/faq' label='Check out our FAQ' size='small' />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Box mb={2} mt={0} className={classes.bottomStack}>
          <Divider className={classes.divider} />
          <Box
            display='flex'
            justifyContent='space-between'
            className={classes.copyrightLine}
          >
            <Box display='flex' className={classes.copyrightLine}>
              <Box mr={[0, 5]} mt={[3, 0]}>
                <TextStyle variant='caption'>
                  &copy; 2021 ASCD. All Rights Reserved.
                </TextStyle>
              </Box>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                mt={[3, 0]}
              >
                <Box mr={3} className={classes.subLink}>
                  <TextStyle variant='caption'>
                    <NLink href='/privacy-policy'> Privacy Policy</NLink>
                  </TextStyle>
                </Box>
                <Box mr={3} className={classes.subLink}>
                  <TextStyle variant='caption'>
                    <NLink href='/terms-of-use'>Terms of Use</NLink>
                  </TextStyle>
                </Box>
                <Box mr={3} className={classes.subLink}>
                  <TextStyle variant='caption'>
                    <NLink href='/governance'>Governance</NLink>
                  </TextStyle>
                </Box>
              </Box>
            </Box>
            <Box className={classes.socialButtons}>
              <SocialButtons />
            </Box>
          </Box>
        </Box>
      </Container>
    </footer>
  )
}
