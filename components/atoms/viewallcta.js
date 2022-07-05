import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TextStyle from '@/components/atoms/textstyle'
import Link from 'next/link'
import CallMadeIcon from '@material-ui/icons/CallMade';

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.hover.main,
      '& $forwardArrowIcon': {
        color: theme.palette.hover.main,
      },
    },
  },
  forwardArrowIcon: {
    width: 22,
    paddingTop: 6,
    color: theme.palette.primary.main,
    transform: 'rotate(45deg)',
  },
}))
export default function ViewAllCTA({ label, href, sm, lg }) {
  const classes = useStyles()

  const textSize = (sm, lg, label) => {
    if (sm) {
      return (
        <TextStyle component='span' variant='buttonSmall'>
          {label}
        </TextStyle>
      )
    } else if (lg) {
      return (
        <TextStyle component='span' variant='buttonLarge'>
          {label}
        </TextStyle>
      )
    } else {
      return (
        <TextStyle component='span' variant='buttonMedium'>
          {label}
        </TextStyle>
      )
    }
  }

  return (
    <>
      <Link href={href} passHref aria-label='View All link'>
        <a className={classes.label}>
          {textSize(sm, lg, label)}
          <Box pl={0.75}>
            <CallMadeIcon className={classes.forwardArrowIcon}/>
          </Box>
        </a>
      </Link>
    </>
  )
}
