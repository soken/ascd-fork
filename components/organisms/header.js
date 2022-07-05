import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import paths from '@/paths/path'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Toolbar,
  Button,
  Badge,
} from '@material-ui/core'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchPopover from '@/components/molecules/searchpopover'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import CloseIcon from '@material-ui/icons/Close'
import useSWR from 'swr'
import Image from 'material-ui-image'
import dynamic from 'next/dynamic'
import { AppContext } from '@/context/state'
import NavMenu from '@/components/molecules/navmenu'

const PianoProfile = dynamic(() => import('@/components/piano/pianoprofile'), {
  ssr: false,
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    background: theme.palette.background.light,
    height: 56,
    paddingLeft: '2vw',
    paddingRight: '2vw',
    color: theme.palette.text.primary,
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    [theme.breakpoints.up('md')]: {
      height: 72,
    },
    [theme.breakpoints.up('xl')]: {
      height: 72,
      paddingLeft: '10vw',
      paddingRight: '10vw',
    },
  },
  desktopToolbar: {
    height: 72,
    position: 'relative',
  },
  mobileToolbar: {
    height: 56,
    minHeight: 56,
  },
  divider: {
    backgroundColor: '#C5CED1',
    height: '32px',
    margin: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    border: '2px solid white',
    boxShadow: theme.shadows[3],
  },
  skipLink: {
    position: 'absolute',
    color: theme.palette.text.secondary,
    background: theme.palette.primary.main,
    fontSize: '18px',
    padding: '12px 16px',
    borderRadius: '4px',
    boxShadow: theme.shadows[3],
    left: '43.5%',
    [theme.breakpoints.down('xs')]: {
      left: '35%',
    },
    transform: 'translateX(-50%)',
    transform: 'translateY(-180%)',
    transition: 'transform 0.3s',
    zIndex: '100',
    '&:focus': {
      background: theme.palette.hover.main,
      transform: 'translateY(-20%)',
    },
  },
  popoverHolder: {
    width: 300,
    borderRadius: '8px',
  },
  drawerHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0px 0px 0px 32px',
    padding: '20px 20px 32px',
  },
  drawerHeaderTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '28px',
  },
  drawerHeaderClose: {
    color: theme.palette.text.secondary,

    '&:hover': {
      color: theme.palette.text.secondary,
    },
  },
  buttonSearchMobile: {
    width: '100%',
    fontWeight: '400',
    height: 56,
    justifyContent: 'flex-start',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.hover.main,
    },
    '& .MuiButton-label': {
      justifyContent: 'space-between',
    },
  },
}))

export default function Header() {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  })
  const router = useRouter()
  const { mobileView, drawerOpen } = state

  const {
    user,
    topics,
    setTopics,
    grades,
    setGrades,
    subjects,
    setSubjects,
    roles,
    setRoles,
  } = useContext(AppContext)

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 960
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }))
    }
    setResponsiveness()
    window.addEventListener('resize', () => setResponsiveness())
  }, [])

  const classes = useStyles()

  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/get-search-categories`, fetcher)

  if (error) {
    console.error(error)
  }

  setTopics(data?.topics)
  setGrades(data?.grades)
  setSubjects(data?.subjects)
  // setRoles(data?.roles)

  const selectedTopics = data?.topics.filter((currentElement) => {
    return (
      currentElement.fields.title == 'Equity' ||
      currentElement.fields.title == 'Leadership' ||
      currentElement.fields.title == 'Assessment' ||
      currentElement.fields.title == 'Technology' ||
      currentElement.fields.title == 'Curriculum' ||
      currentElement.fields.title == 'Social Emotional Learning'
    )
  })

  const [searchPopover, setSearchPopover] = useState(null)

  const openSearchPopover = (event) => {
    setSearchPopover(event.target)
  }

  const closeSearchPopover = () => {
    setSearchPopover(null)
  }

  const [searchPopoverValue, setSearchPopoverValue] = useState('')

  const triggerSearch = () => {
    setSearchPopover(null)
    router.push(
      paths.search({
        query: searchPopoverValue ? searchPopoverValue : '',
      })
    )
  }

  const onEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      triggerSearch()
    }
  }

  const searchPopoverPlaceholder =
    'Search articles, topics, people, events, books, and more…'
  const searchPopoverPlaceholderMobile = 'Search…'

  const displayDesktop = () => {
    return (
      <Toolbar disableGutters className={classes.desktopToolbar}>
        <Grid container alignItems='center'>
          <Grid item md={8} container>
            <a href='#mainContent' className={classes.skipLink}>
              Skip to main content
            </a>
            <Box mr={1.75} tabIndex='0'>
              <Link href='/' className={classes.logoLink}>
                <Image
                  src={'/images/logo.svg'}
                  alt='ascd logo'
                  style={{
                    paddingTop: 0,
                    //width: '109px',
                    height: '36px',
                    cursor: 'pointer',
                  }}
                  imageStyle={{ position: 'static' }}
                />
              </Link>
            </Box>
            <NavMenu isLoggedIn={user.id} />
          </Grid>
          <Grid item md={4}>
            <Box display='flex' alignItems='center' justifyContent='flex-end'>
              <Box mr={3}>
                <IconButton
                  aria-label='Open search panel'
                  onClick={openSearchPopover}
                >
                  <SearchIcon />
                </IconButton>
                <SearchPopover
                  searchPopover={searchPopover}
                  closeSearchPopover={closeSearchPopover}
                  searchPopoverPlaceholder={searchPopoverPlaceholder}
                  searchPopoverValue={searchPopoverValue}
                  setSearchPopoverValue={(event) =>
                    setSearchPopoverValue(event.target.value)
                  }
                  resetSearchPopoverValue={() => setSearchPopoverValue('')}
                  triggerSearch={triggerSearch}
                  onEnterKeyPress={onEnterKeyPress}
                  onCancelKeyPress={() => setSearchPopoverValue('')}
                  topics={selectedTopics}
                  grades={grades}
                  subjects={subjects}
                  center={false}
                  maxWidth={'100%'}
                  background={'transparent'}
                />
              </Box>
              <Divider
                orientation='vertical'
                flexItem
                className={classes.divider}
              />
              <Box mx={3}>
                <IconButton
                  aria-label='checkout cart'
                  className='header__summary snipcart-checkout snipcart-summary'
                >
                  {/* <Badge badgeContent={4} color='secondary'> */}
                  <ShoppingCartIcon />
                  {/* </Badge> */}

                  {/* <span className='snipcart-items-count'>0</span>
                  <span className='snipcart-total-price'>$0.00</span> */}
                </IconButton>
              </Box>
              <PianoProfile />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    )
  }

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }))
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }))
    return (
      <Toolbar className={classes.mobileToolbar}>
        <a href='#mainContent' className={classes.skipLink}>
          Skip to content
        </a>
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Grid container alignItems='center'>
          <Grid item xs={6}>
            <Box ml={1}>
              <Link href='/'>
                <Image
                  src={'/images/logo.svg'}
                  alt='ascd logo'
                  style={{ paddingTop: 0, width: '109px', height: '29px' }}
                  imageStyle={{ position: 'static' }}
                />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={6} container justify='flex-end'>
            <IconButton
              aria-label='checkout cart'
              className='header__summary snipcart-checkout snipcart-summary'
              style={{ marginRight: '10px' }}
            >
              <ShoppingCartIcon />
              {/* <Badge badgeContent={4} color='secondary'>
                <ShoppingCartIcon />
              </Badge> */}
            </IconButton>
            <PianoProfile mobile />
          </Grid>
        </Grid>

        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <Box className={classes.drawerHeader}>
            <Box className={classes.drawerHeaderTop}>
              <IconButton
                className={classes.drawerHeaderClose}
                onClick={handleDrawerClose}
              >
                <CloseIcon />
              </IconButton>
              <Box tabIndex='0'>
                <Link href='/'>
                  <Image
                    src={'/images/fulllogo_white.svg'}
                    alt='ascd logo'
                    style={{
                      paddingTop: 0,
                      width: '109px',
                      height: '29px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      marginLeft: '14px',
                    }}
                    imageStyle={{ position: 'static' }}
                  />
                </Link>
              </Box>
            </Box>
            <Button
              id='search-button-mobile'
              variant='contained'
              endIcon={<SearchIcon />}
              className={classes.buttonSearchMobile}
              onClick={openSearchPopover}
            >
              Search topics, events, books...
            </Button>
            <SearchPopover
              searchPopover={searchPopover}
              closeSearchPopover={closeSearchPopover}
              searchPopoverValue={searchPopoverValue}
              setSearchPopoverValue={(event) =>
                setSearchPopoverValue(event.target.value)
              }
              resetSearchPopoverValue={() => setSearchPopoverValue('')}
              searchPopoverPlaceholder={searchPopoverPlaceholderMobile}
              triggerSearch={triggerSearch}
              onEnterKeyPress={onEnterKeyPress}
              onCancelKeyPress={() => setSearchPopoverValue('')}
              topics={selectedTopics}
              grades={grades}
              subjects={subjects}
              center={false}
              maxWidth={'100%'}
              background={'transparent'}
            />
          </Box>
          <NavMenu mobile isLoggedIn={user.id} />
        </Drawer>
      </Toolbar>
    )
  }

  return (
    <>
      <AppBar elevation={0} className={classes.bar}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </>
  )
}
