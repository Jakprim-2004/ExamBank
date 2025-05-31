import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function FirebaseErrorMessage() {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>ไม่สามารถเข้าถึงฐานข้อมูลได้</AlertTitle>
      <AlertDescription>
        <p className="mb-2">เกิดข้อผิดพลาดในการเข้าถึงฐานข้อมูล Firebase เนื่องจากไม่มีสิทธิ์เพียงพอ</p>
        <p className="mb-2">คุณต้องตั้งค่า Firebase Security Rules ให้อนุญาตการอ่านและเขียนข้อมูล</p>
        <div className="mt-4 p-3 bg-muted rounded-md">
          <pre className="text-xs overflow-auto">
            {`// ตัวอย่าง Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // อนุญาตทุกคนให้อ่านและเขียนข้อมูล (สำหรับการพัฒนา)
    }
  }
}`}
          </pre>
        </div>
        <p className="mt-4">
          <Link
            href="https://console.firebase.google.com/project/studentloan-54a93/firestore/rules"
            className="text-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ไปที่ Firebase Console เพื่อแก้ไข Security Rules
          </Link>
        </p>
      </AlertDescription>
    </Alert>
  )
}
