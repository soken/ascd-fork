import { makeStyles } from '@material-ui/core/styles'
import ExpandMore from '@material-ui/icons/ExpandMore'
import WidgetsIcon from '@material-ui/icons/Widgets'
import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import ContactsIcon from '@material-ui/icons/Contacts'
import CtaButton from '@/components/atoms/ctabutton'
import NavMenuItem from './navmenuitem'
import paths from '@/paths/path'

const useStyles = makeStyles((theme) => ({
  withIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  navigation: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: '18px',
    letterSpacing: '0.2px',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 0 20px',
    },
    '& ul': {
      listStyleType: 'none',
      paddingLeft: 0,
      marginBlockStart: 0,
      marginBlockEnd: 0,
      width: '100%',
      '& li': {
        display: 'block',
        margin: '18px 24px',
        [theme.breakpoints.up('md')]: {
          display: 'inline-block',
          margin: 0,
        },
      },
    },
  },
  navigationMobBottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '& li:first-child': {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '26px',
      letterSpacing: 0.2,
      color: theme.palette.grey.medium,
      marginBottom: 0,
    },
  },
  labelIcon: {
    color: theme.palette.primary.light,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}))

export default function NavMenu({ mobile }) {
  const classes = useStyles()

  const menuItems = [
    {
      id: 'menu-resources',
      label: 'Resources',
      labelIcon: <WidgetsIcon className={classes.labelIcon} />,
      startIcon: <WidgetsIcon />,
      endIcon: <ExpandMore />,
      items: [
        {
          label: 'All Resources',
          href: '/resources',
        },
        {
          label: 'Books',
          href: '/books',
        },
        {
          label: 'EL Magazine',
          href: '/el',
        },
        {
          label: 'Blog',
          href: '/blogs',
        },
        {
          label: 'Videos & Podcasts',
          href: '/videos',
        },
      ],
      ctaViewAll: '/resources',
      rightLinks: [
        {
          label: 'Write for ASCD',
          href: '/write-for-ascd',
        },
        {
          label: 'Meet our Authors',
          href: '/authors',
        },
        {
          label: 'Courses',
          href: 'https://pdo.ascd.org/',
        },
      ],
    },
    {
      id: 'menu-events',
      label: 'Events',
      labelIcon: <EventAvailableIcon className={classes.labelIcon} />,
      startIcon: <EventAvailableIcon />,
      endIcon: <ExpandMore />,
      items: [
        {
          label: 'Upcoming Events',
          href: '/events',
        },
        {
          label: 'Webinars',
          href: '/webinars',
        },
        {
          label: 'Conferences',
          href: paths.event({ slug: '2022-annual-conference' }),
        },
        {
          label: 'Symposiums',
          href: 'https://events.ascd.org/symposiums',
          target: '_blank',
        },
        {
          label: 'Leadership Summit',
          href: 'https://events.ascd.org/leadership-summit',
          target: '_blank',
        },
      ],
      rightLinks: [
        {
          label: 'Past Webinars',
          href: '/webinars',
        },
        {
          label: 'Become a Partner',
          href: '/partners',
        },
        {
          label: 'Sponsors & Exhibitors',
          href: 'http://events.ascd.org/sponsors-and-exhibitors',
        },
      ],
    },
    {
      id: 'menu-services',
      label: 'Services',
      labelIcon: <ContactsIcon className={classes.labelIcon} />,
      startIcon: <ContactsIcon />,
      endIcon: <ExpandMore />,
      items: [
        {
          label: 'Our Services',
          href: '/services',
        },
        {
          label: 'ACTIVATE',
          href: '/activate',
        },
        {
          label: 'Communities',
          href: '/communities',
        },
      ],
    },
  ]

  return (
    <nav aria-label='Main Navigation' className={classes.navigation}>
      <ul>
        {menuItems.map((item) => (
          <NavMenuItem key={item.id} {...item} />
        ))}
      </ul>
      {mobile && (
        <ul className={classes.navigationMobBottom}>
          <li key='Subscribe intro'>Not a member?</li>
          <li key='Subscribe button'>
            <CtaButton
              variant='contained'
              color='primary'
              width='104'
              height='42'
              label='Subscribe to ASCD'
              href={paths.subscribe}
            />
          </li>
        </ul>
      )}
    </nav>
  )
}
