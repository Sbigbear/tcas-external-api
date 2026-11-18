// ระบบภายนอก (จำลอง) — แยกจากแอป TCAS โดยสิ้นเชิง
// เปรียบเสมือน 2 หน่วยงาน:
//   1) ระบบโรงเรียน  -> GET /api/school/students      (ใช้ SCHOOL_API_KEY)
//   2) ระบบ TCAS     -> GET /api/tcas/scores           (ใช้ TCAS_API_KEY)
// รันในเครื่อง:  node server.js   (บน Vercel ใช้ไฟล์ในโฟลเดอร์ api/ แทน)

import http from 'node:http'
import { handleIndex, handleScores, handleStudents } from './lib/handlers.js'

const PORT = process.env.PORT || 4000

const routes = {
  '/': () => handleIndex(),
  '/api/school/students': handleStudents,
  '/api/tcas/scores': handleScores,
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  console.log(new Date().toLocaleTimeString('th-TH'), req.method, url.pathname + url.search)

  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
  }

  if (req.method !== 'GET') return send(405, { message: 'Method not allowed' })
  const route = routes[url.pathname]
  if (!route) return send(404, { message: 'ไม่พบ endpoint นี้' })

  const { status, body } = route(url.searchParams, req.headers['x-api-key'])
  send(status, body)
})

server.listen(PORT, () => console.log(`External API running at http://localhost:${PORT}`))
