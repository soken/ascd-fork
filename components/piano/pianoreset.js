import { Box, Typography } from '@material-ui/core'

const resetPianoAccount = async (tp) => {
  try {
    await tp.push([
      'init',
      function () {
        // Password can be reset only if user is anonymous
        if (!tp.user.isUserValid()) {
          // If URL has reset_token parameter
          var tokenMatch = location.search.match(/reset_token=([A-Za-z0-9]+)/)
          if (tokenMatch) {
            // Get value of the token
            var token = tokenMatch[1]
            // Present password reset form with the found token
            tp.pianoId.show({
              resetPasswordToken: token,
              loggedIn: function () {
                // Once user logs in - refresh the page
                location.reload()
              },
            })
          }
        }
      },
    ])
  } catch (e) {
    throw Error(e.message)
  }
}

export default function PianoAccount({}) {
  let tp = null
  if (typeof window !== 'undefined' && typeof window.tp !== 'undefined') {
    tp = window.tp
    if (tp) {
      resetPianoAccount(tp)
    }
  }

  return (
    <Box id='my-account-title'>
      <Typography variant='h2'>Reset your password</Typography>
      Lacus diam cursus condimentum nam auctor nisi felis ultrices lobortis,
      blandit maecenas donec molestie tempus hendrerit congue.
    </Box>
  )
}
