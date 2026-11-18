// โค้ดหลักของระบบภายนอก ใช้ร่วมกันทั้งตอนรันในเครื่อง (server.js) และบน Vercel (api/*.js)
import { readFileSync } from 'node:fs'

const SCHOOL_API_KEY = () => process.env.SCHOOL_API_KEY || 'school-demo-key'
const TCAS_API_KEY = () => process.env.TCAS_API_KEY || 'tcas-demo-key'

// อ่านไฟล์ใหม่ทุกครั้งที่มีคนเรียก -> แก้ข้อมูลแล้วเห็นผลทันทีโดยไม่ต้องรีสตาร์ต
const load = (file) => JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'))

const unauthorized = { status: 401, body: { message: 'API key ไม่ถูกต้อง' } }

// GET /  -> คำอธิบาย endpoint
export function handleIndex() {
  return {
    status: 200,
    body: {
      name: 'TCAS External API (demo)',
      endpoints: ['/api/school/students?schoolCode=SCH001', '/api/tcas/scores?nationalId=...'],
    },
  }
}

// GET /api/school/students  (ระบบโรงเรียน: เกรด ปพ.1)
export function handleStudents(searchParams, apiKey) {
  if (apiKey !== SCHOOL_API_KEY()) return unauthorized
  const schoolCode = searchParams.get('schoolCode')
  let students = load('students.json')
  if (schoolCode) students = students.filter((s) => s.schoolCode === schoolCode)
  return { status: 200, body: { source: 'school-system', fetchedAt: new Date().toISOString(), students } }
}

// GET /api/tcas/scores  (ระบบ ทปอ.: คะแนน TGAT/TPAT/A-Level)
export function handleScores(searchParams, apiKey) {
  if (apiKey !== TCAS_API_KEY()) return unauthorized
  const nationalId = searchParams.get('nationalId')
  let scores = load('tcas_scores.json')
  if (nationalId) scores = scores.filter((s) => s.nationalId === nationalId)
  return { status: 200, body: { source: 'tcas-system', fetchedAt: new Date().toISOString(), scores } }
}

// ตัวช่วยสำหรับ Vercel: แปลง (req, res) ของ Vercel ให้เรียก handler ด้านบน
export function vercelHandler(fn) {
  return (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })
    const url = new URL(req.url, 'http://localhost')
    const { status, body } = fn(url.searchParams, req.headers['x-api-key'])
    console.log(new Date().toISOString(), req.method, url.pathname + url.search, status)
    res.status(status).json(body)
  }
}
