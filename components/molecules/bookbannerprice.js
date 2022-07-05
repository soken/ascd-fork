import { Box, FormControl, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@/components/atoms/link'
import paths from '@/paths/path'
import TextStyle from '@/components/atoms/textstyle'
import { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
  select: {
    display: 'flex',
    justifyContent: 'center',
    '& *': {
      textTransform: 'uppercase',
    },
    '& svg': {
      color: theme.palette.grey.medium,
    },
  },
  formControl: {
    margin: theme.spacing(0),
    marginLeft: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  subheading: {
    '& a': {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
    },
  },
}))

export default function BookBannerPrice({
  version,
  versions,
  onchange,
  useMemberBookPrice,
}) {
  const classes = useStyles()

  const [currentVersion, setCurrentVersion] = React.useState(null)
  const [options, setOptions] = React.useState([])

  const handleChange = (event) => {
    setCurrentVersion(event.target.value)
    onchange(event.target.value)
  }

  useEffect(() => {
    if (version) {
      setCurrentVersion(version.fields?.productNumber)
    }
  }, [version])

  useEffect(() => {
    if (versions) {
      const versionOptions = versions.map((v) => {
        return {
          label: v?.fields?.bookType.fields.title,
          value: v?.fields?.productNumber,
        }
      })
      setOptions(versionOptions)
    }
  }, [versions])

  return (
    <Box>
      <Box display='flex' alignItems='flex-end' mb={1}>
        <TextStyle variant='h3'>
          $
          {useMemberBookPrice
            ? version?.fields?.priceMember
            : version?.fields?.priceNonMember}
        </TextStyle>
        <FormControl className={classes.formControl}>
          <Select
            labelId='select-book-version-label'
            id='select-book-version'
            value={currentVersion}
            onChange={handleChange}
            className={classes.select}
            disableUnderline
            autoWidth
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <TextStyle variant='buttonSmall'>{option.label}</TextStyle>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {!useMemberBookPrice ? (
        <TextStyle variant='subtitle2'>
          $ {version?.fields?.priceMember} member price{' '}
          <Link href={paths.subscribe} color='#005E47' label='join now' />
        </TextStyle>
      ) : (
        <TextStyle variant='subtitle2'>
          $ {version?.fields?.priceNonMember} non-member price
        </TextStyle>
      )}
    </Box>
  )
}
