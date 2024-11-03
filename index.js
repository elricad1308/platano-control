import express from 'express'
import { spawn } from 'child_process'

const app = express()
const net = spawn('./net/NetApp/bin/Debug/NetApp.exe')

app.get('/', (req, res) => {
  const game = req.query.game
  const x = req.query.x
  const y = req.query.y
  const a = req.query.a
  const b = req.query.b
  const start = req.query.start

  net.stdin.write(`${game},${x},${y},${a},${b},${start}\r\n`)
  
  res.status(200).send('ok')
})

app.use('/public', express.static('public'))

app.listen(3000, () => {
  console.log('Server started in port 3000')
})
