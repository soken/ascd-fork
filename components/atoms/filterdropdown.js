import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, Select, MenuItem } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginLeft: (props) =>
      props.marginLeft ? props.marginLeft : theme.spacing(1),
  },
  select: {
    height: (props) => (props.height ? props.height : 'inherit'),
    width: (props) => (props.width ? props.width : 'inherit'),
    padding: (props) => (props.width && props.height ? '0' : 'initial'),
    overflow: 'hidden',
  },
}))

export default function FilterDropdown({
  items,
  defaultValue,
  action,
  ...props
}) {
  const classes = useStyles(props)
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    if (typeof defaultValue == 'object') {
      setValue(defaultValue.value)
    }
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = (event) => {
    setValue(event.target.value)
    action(event.target.value)
  }

  const _renderItems = (items) => {
    return items.map((item, key) => (
      <MenuItem key={key} value={typeof item == 'object' ? item.value : item}>
        {typeof item == 'object' ? item.label : item}
      </MenuItem>
    ))
  }
  return (
    <FormControl variant='outlined' fullWidth className={classes.formControl}>
      <Select
        labelId='select-category-label'
        id='select-category'
        value={value}
        onChange={handleChange}
        className={classes.select}
      >
        {_renderItems(items)}
      </Select>
    </FormControl>
  )
}
