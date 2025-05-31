import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  // ถ้าเกิดข้อผิดพลาดในการเริ่มต้น Firebase ให้ลองอีกครั้ง
  if (error instanceof Error && error.message.includes("already exists")) {
    app = initializeApp(firebaseConfig, "secondary")
  } else {
    console.error("Error initializing Firebase:", error)
  }
}

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Analytics (only on client-side)
export const initAnalytics = () => {
  if (typeof window !== "undefined") {
    try {
      return getAnalytics(app)
    } catch (error) {
      console.error("Error initializing Analytics:", error)
      return null
    }
  }
  return null
}

export default app
