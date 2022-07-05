import { Box } from '@material-ui/core'

export default function HubSpotForm() {
  let hbspt = undefined
  if (typeof window !== 'undefined' && typeof window.hbspt !== 'undefined') {
    hbspt = window.hbspt

    if (hbspt) {
      hbspt.forms.create({
        target: '[id="hubforms"]',
        region: 'na1',
        portalId: '8020079',
        formId: '9d7a7496-8391-406c-a4c3-8e93db114c8b',
      })
    }
  }

  return <Box id='hubforms' mt={2}></Box>
}
