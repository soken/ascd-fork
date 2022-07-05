import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'

const useStyles = makeStyles((theme) => ({
  noAnnotations: {
    height: '248px',
    backgroundColor: theme.palette.accent.paleGreen,
  },
  headline: {
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '24px',
    letterSpacing: '0.2px',
  },
  subline: {
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#5F5858',
    marginTop: 8,
  },
}))

export default function NoAnnotations({ message }) {
  const classes = useStyles()
  return (
    <Box
      m={2}
      p={2}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
      className={classes.noAnnotations}
    >
      <FormatQuoteIcon style={{ fontSize: '60px', color: '#969696' }} />
      <Typography className={classes.headline}>
        You don&apos;t have any
      </Typography>
      <Typography className={classes.headline}>notes at the moment</Typography>
      <Typography className={classes.subline}>{message}</Typography>
    </Box>
  )
}
