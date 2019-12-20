/*
  A simple nodejs express server to serve the static site in order to test it.
*/
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('./gh-pages'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
