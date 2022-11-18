import {app} from './app'

const SERVER_PORT = parseInt(process.env.PORT) || 3001

const server = app.listen(SERVER_PORT, () => {
  console.log(`User API started on port ${SERVER_PORT}`)
})

export {server}
