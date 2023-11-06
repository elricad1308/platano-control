import express from 'express'
import { spawn } from 'child_process'

const app = express()
const net = spawn('./net/NetApp/bin/Debug/NetApp.exe')

app.get('/', (req, res) => {
  const move = req.query.move
  const jump = req.query.jump
  const accel = req.query.accel

  net.stdin.write(`${move},${jump},${accel}\r\n`)

  res.status(200).send('ok')
})

app.use('/public', express.static('public'))

app.listen(3000, () => {
  console.log('Server started in port 3000')
})
