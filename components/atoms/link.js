import { makeStyles } from '@material-ui/core/styles'
import NextLink from 'next/link'

const useStyles = makeStyles((theme) => ({
  small: {
    fontWeight: '500',
    fontSize: theme.typography.pxToRem(14),
    lineHeight: theme.typography.pxToRem(24),
    letterSpacing: '0.2px',
    color: (props) => (props.color ? props.color : theme.palette.primary.main),
    textDecoration: 'underline',
    '&:hover, &:focus': {
      color: (props) =>
        props.colorHover ? props.colorHover : theme.palette.hover.main,
    },
  },
  medium: {
    fontWeight: '500',
    fontSize: theme.typography.pxToRem(16),
    lineHeight: theme.typography.pxToRem(26),
    letterSpacing: '0.2px',
    color: (props) => (props.color ? props.color : theme.palette.primary.main),
    textDecoration: 'underline',
    '&:hover, &:focus': {
      color: (props) =>
        props.colorHover ? props.colorHover : theme.palette.hover.main,
    },
  },
  large: {
    fontWeight: '500',
    fontSize: theme.typography.pxToRem(18),
    lineHeight: theme.typography.pxToRem(30),
    letterSpacing: '0.2px',
    color: (props) => (props.color ? props.color : theme.palette.primary.main),
    textDecoration: 'underline',
    '&:hover, &:focus': {
      color: (props) =>
        props.colorHover ? props.colorHover : theme.palette.hover.main,
    },
  },
}))

export default function Link({
  label,
  href,
  size,
  clickAction,
  scroll,
  shallow,
  ...props
}) {
  const classes = useStyles(props)

  const LinkSize = (size) => {
    if (size === 'small') {
      return classes.small
    } else if (size === 'medium') {
      return classes.medium
    } else if (size === 'large') {
      return classes.large
    } else {
      return classes.medium
    }
  }

  return href ? (
    <NextLink href={href} passHref scroll={scroll} shallow={shallow}>
      <a className={LinkSize(size)} target={props?.target ? props?.target : ''}>
        {props.children ? <>{props.children}</> : <>{label}</>}
      </a>
    </NextLink>
  ) : (
    <a
      className={LinkSize(size)}
      onClick={() => clickAction()}
      scroll={scroll}
      shallow={shallow}
    >
      {props.children ? <>{props.children}</> : <>{label}</>}
    </a>
  )
}
