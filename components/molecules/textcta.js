import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ViewAllCTA from '@/components/atoms/viewallcta'
import CtaButton from '@/components/atoms/ctabutton'
import TextStyle from '@/components/atoms/textstyle'
import { useRouter } from 'next/router'
const useStyles = makeStyles((theme) => ({
  textcta: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    backgroundColor: (props) =>
      props.bgColor == 'primary'
        ? theme.palette.primary.main
        : theme.palette.grey.extraLight,
    color: (props) =>
      props.bgColor == 'primary' ? theme.palette.common.white : 'initial',
  },
  underline: {
    textDecoration: 'underline',
  },
}))
export default function TextCTA({
  title,
  description,
  button,
  ctaLabel,
  ctaLink,
  ...props
}) {
  const classes = useStyles(props)
  const router = useRouter()
  return (
    <Box py={5} className={classes.textcta}>
      <Box maxWidth='650px' textAlign='center' px={3}>
        {title && <TextStyle variant='h4'>{title}</TextStyle>}
      </Box>
      <Box maxWidth='650px' textAlign='center' pt={1} px={3}>
        <TextStyle variant='subtitle1'>{description}</TextStyle>
      </Box>
      {ctaLabel && (
        <Box mt={2}>
          {button ? (
            <CtaButton
              variant='contained'
              color={props.bgColor == 'primary' ? 'secondary' : 'primary'}
              width='100%'
              height='42'
              label={ctaLabel}
              onclick={() => router.push(ctaLink)}
            />
          ) : (
            <ViewAllCTA href={ctaLink} label={ctaLabel} lg />
            // <>
            // <Link href={ctaLink} label={ctaLabel} size='small' />
            // <Link href={ctaLink} label={ctaLabel} size='medium' />
            // <Link href={ctaLink} label={ctaLabel} size='large' />
            // </>
          )}
        </Box>
      )}
    </Box>
  )
}
