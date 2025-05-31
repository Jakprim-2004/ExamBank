# ExamBank - ระบบจัดเก็บข้อสอบ



## ✨ คุณสมบัติหลัก

- 📝 **เพิ่มข้อสอบใหม่** - สร้างข้อสอบพร้อมคำถามและเฉลย
- 🔍 **ค้นหาข้อสอบ** - ค้นหาข้อสอบจากชื่อหรือเนื้อหาคำตอบ
- ✏️ **แก้ไขข้อสอบ** - แก้ไขข้อสอบที่มีอยู่แล้ว
- 🗑️ **ลบข้อสอบ** - ลบข้อสอบที่ไม่ต้องการ
- 📱 **Responsive Design** - ใช้งานได้ทั้งมือถือและคอมพิวเตอร์
- 🌙 **Dark/Light Mode** - เปลี่ยนธีมตามความชอบ
- 🎨 **UI สวยงาม** - ใช้ shadcn/ui และ Tailwind CSS
- ⚡ **ประสิทธิภาพสูง** - สร้างด้วย Next.js 15

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- npm หรือ yarn
- Firebase Project

### 1. Clone โปรเจค

```bash
git clone https://github.com/yourusername/exambank.git
cd exambank
```

### 2. ติดตั้ง Dependencies

```bash
npm install
# หรือ
yarn install
```

### 3. ตั้งค่า Firebase

1. สร้าง Firebase Project ที่ [Firebase Console](https://console.firebase.google.com/)
2. เปิดใช้งาน Firestore Database
3. คัดลอก Firebase Configuration
4. แก้ไขไฟล์ `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
}
```

### 4. ตั้งค่า Firestore Security Rules

ไปที่ Firebase Console > Firestore Database > Rules และใส่:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // สำหรับการพัฒนา
    }
  }
}
```

**⚠️ หมายเหตุ**: Rules นี้อนุญาตให้ทุกคนเข้าถึงข้อมูลได้ ใช้สำหรับการพัฒนาเท่านั้น

### 5. รันโปรเจค

```bash
npm run dev
# หรือ
yarn dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

```text
exambank/
├── app/                    # Next.js App Router
│   ├── add-exam/          # หน้าเพิ่มข้อสอบ
│   ├── exam/[id]/         # หน้ารายละเอียดข้อสอบ
│   │   └── edit/          # หน้าแก้ไขข้อสอบ
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # หน้าหลัก
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header component
│   ├── search-bar.tsx    # Search component
│   └── theme-toggle.tsx  # Theme toggle
├── lib/                  # Utilities
│   ├── db.ts            # Database functions
│   ├── firebase.ts      # Firebase config
│   └── utils.ts         # Utility functions
├── hooks/               # Custom hooks
└── public/             # Static files
```

## 🎯 การใช้งาน

### เพิ่มข้อสอบใหม่

1. คลิกปุ่ม "เพิ่มข้อสอบใหม่"
2. กรอกชื่อข้อสอบ
3. เพิ่มคำถามและคำตอบ
4. คลิก "บันทึกข้อสอบ"

### ค้นหาข้อสอบ

- ใช้ช่องค้นหาในหน้าหลักเพื่อค้นหาจากชื่อข้อสอบ
- ใช้ช่องค้นหาในหน้ารายละเอียดเพื่อค้นหาคำถามหรือคำตอบ

### แก้ไขข้อสอบ

1. เข้าไปในหน้ารายละเอียดข้อสอบ
2. คลิกปุ่ม "แก้ไข"
3. แก้ไขข้อมูลที่ต้องการ
4. คลิก "บันทึกการแก้ไข"






```
