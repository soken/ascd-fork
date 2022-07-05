import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import TextStyle from '@/components/atoms/textstyle'

const useStyles = makeStyles({
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    '& *': {
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
    },
    margin: '3px 0px',
    
  },
})

const _renderMenuItems = (items) => {
  const classes = useStyles()
  return items.map(({ label, href }) => (
    <li key={label} className={classes.link}>
      <TextStyle variant='body3'>
        <Link href={href} passHref>
          {label}
        </Link>
      </TextStyle>
    </li>
  ))
}

export default function FooterMenu({ title, items }) {
  const classes = useStyles()
  return (
    <Box pr={[0, 4, 5]} mt={[3, 0]}>
      <TextStyle variant='h5'>{title}</TextStyle>
      <Box mt={1}>
        <ul className={classes.list}>{_renderMenuItems(items)}</ul>
      </Box>
    </Box>
  )
}
