# TCAS External API (ระบบภายนอกจำลอง)

เซิร์ฟเวอร์นี้แยกจากแอป `my-tcas-app-demo` เพื่อจำลอง "ระบบของหน่วยงานอื่น"
แอป TCAS จะดึงข้อมูลจากที่นี่ผ่าน HTTP + API key

| Endpoint | หน่วยงาน | Header ที่ต้องส่ง |
|---|---|---|
| `GET /api/school/students` | โรงเรียน (เกรด ปพ.1) | `x-api-key: <SCHOOL_API_KEY>` |
| `GET /api/tcas/scores` | ทปอ. (คะแนน TGAT/TPAT/A-Level) | `x-api-key: <TCAS_API_KEY>` |

## โครงสร้าง
- `lib/handlers.js` — โค้ดหลัก (ตรวจ API key + ส่งข้อมูล)
- `server.js` — รันในเครื่อง
- `api/` — ฟังก์ชันสำหรับ Vercel (เรียกโค้ดหลักตัวเดียวกัน)
- `data/` — ข้อมูลนักเรียน / คะแนน

## รันในเครื่อง

```bash
npm start
```

เปิด http://localhost:4000 (ค่าเริ่มต้น key คือ `school-demo-key` และ `tcas-demo-key`)

## Deploy ขึ้น Vercel

1. push โฟลเดอร์นี้ขึ้น GitHub เป็น repo ใหม่
2. Vercel → Add New → Project → เลือก repo นี้ → Framework Preset: **Other** → Deploy
3. Settings → Environment Variables ใส่ `SCHOOL_API_KEY`, `TCAS_API_KEY` (ตั้งเป็นค่าลับของตัวเอง ห้ามใช้ demo key) แล้ว Redeploy
4. นำ URL ที่ได้ไปใส่ใน Environment Variables ของแอป TCAS:
   - `SCHOOL_API_URL` = `https://<โปรเจกต์นี้>.vercel.app/api/school/students`
   - `TCAS_API_URL` = `https://<โปรเจกต์นี้>.vercel.app/api/tcas/scores`
   - `SCHOOL_API_KEY`, `TCAS_API_KEY` = ค่าเดียวกับข้อ 3
