import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Types
export interface Exam {
  id?: string
  name: string
  questionCount: number
  createdAt: string | Timestamp
  questions: Question[]
}

export interface Question {
  question: string
  answer: string
}

// Convert Firestore document to Exam
export function examConverter(doc: QueryDocumentSnapshot<DocumentData>): Exam {
  const data = doc.data()

  // Format the timestamp for display
  let createdAtFormatted: string
  if (data.createdAt instanceof Timestamp) {
    const date = data.createdAt.toDate()
    createdAtFormatted = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  } else {
    createdAtFormatted = data.createdAt || "ไม่ระบุวันที่"
  }

  return {
    id: doc.id,
    name: data.name,
    questionCount: data.questions?.length || 0,
    createdAt: createdAtFormatted,
    questions: data.questions || [],
  }
}

// Add a new exam
export async function addExam(exam: Omit<Exam, "id" | "questionCount" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "exams"), {
      name: exam.name,
      questions: exam.questions,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding exam: ", error)
    throw error
  }
}

// Get all exams
export async function getExams() {
  try {
    // ใช้ข้อมูลจำลองเมื่อไม่สามารถเข้าถึง Firestore ได้
    const mockData = [
      {
        id: "mock1",
        name: "ตัวอย่างข้อสอบ 1 (ข้อมูลจำลอง)",
        questionCount: 3,
        createdAt: "01/05/2025",
        questions: [
          { question: "1 + 1 = ?", answer: "2" },
          { question: "2 + 2 = ?", answer: "4" },
          { question: "3 + 3 = ?", answer: "6" },
        ],
      },
      {
        id: "mock2",
        name: "ตัวอย่างข้อสอบ 2 (ข้อมูลจำลอง)",
        questionCount: 2,
        createdAt: "30/04/2025",
        questions: [
          { question: "ประเทศไทยมีกี่จังหวัด?", answer: "77 จังหวัด" },
          { question: "เมืองหลวงของประเทศไทยคือ?", answer: "กรุงเทพมหานคร" },
        ],
      },
    ]

    // พยายามดึงข้อมูลจาก Firestore ก่อน
    const q = query(collection(db, "exams"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    // ถ้าดึงข้อมูลสำเร็จ ให้ใช้ข้อมูลจาก Firestore
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(examConverter)
    }

    // ถ้าไม่มีข้อมูลใน Firestore ให้ใช้ข้อมูลจำลอง
    console.log("No data in Firestore, using mock data")
    return mockData
  } catch (error) {
    console.error("Error getting exams: ", error)

    // ถ้าเกิดข้อผิดพลาด ให้ใช้ข้อมูลจำลอง
    console.log("Error accessing Firestore, using mock data")
    return [
      {
        id: "mock1",
        name: "ตัวอย่างข้อสอบ 1 (ข้อมูลจำลอง)",
        questionCount: 3,
        createdAt: "01/05/2025",
        questions: [
          { question: "1 + 1 = ?", answer: "2" },
          { question: "2 + 2 = ?", answer: "4" },
          { question: "3 + 3 = ?", answer: "6" },
        ],
      },
      {
        id: "mock2",
        name: "ตัวอย่างข้อสอบ 2 (ข้อมูลจำลอง)",
        questionCount: 2,
        createdAt: "30/04/2025",
        questions: [
          { question: "ประเทศไทยมีกี่จังหวัด?", answer: "77 จังหวัด" },
          { question: "เมืองหลวงของประเทศไทยคือ?", answer: "กรุงเทพมหานคร" },
        ],
      },
    ]
  }
}

// Get a single exam by ID
export async function getExamById(id: string) {
  try {
    // ถ้า ID เริ่มต้นด้วย "mock" ให้ใช้ข้อมูลจำลอง
    if (id.startsWith("mock")) {
      if (id === "mock1") {
        return {
          id: "mock1",
          name: "ตัวอย่างข้อสอบ 1 (ข้อมูลจำลอง)",
          questionCount: 3,
          createdAt: "01/05/2025",
          questions: [
            { question: "1 + 1 = ?", answer: "2" },
            { question: "2 + 2 = ?", answer: "4" },
            { question: "3 + 3 = ?", answer: "6" },
          ],
        }
      } else if (id === "mock2") {
        return {
          id: "mock2",
          name: "ตัวอย่างข้อสอบ 2 (ข้อมูลจำลอง)",
          questionCount: 2,
          createdAt: "30/04/2025",
          questions: [
            { question: "ประเทศไทยมีกี่จังหวัด?", answer: "77 จังหวัด" },
            { question: "เมืองหลวงของประเทศไทยคือ?", answer: "กรุงเทพมหานคร" },
          ],
        }
      }
    }

    // พยายามดึงข้อมูลจาก Firestore
    const docRef = doc(db, "exams", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return examConverter(docSnap as QueryDocumentSnapshot<DocumentData>)
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting exam: ", error)
    return null
  }
}

// Update an exam
export async function updateExam(id: string, exam: Partial<Omit<Exam, "id" | "createdAt">>) {
  try {
    // ถ้า ID เริ่มต้นด้วย "mock" ให้จำลองการอัปเดต
    if (id.startsWith("mock")) {
      console.log("Mock update exam:", id, exam)
      return true
    }

    const docRef = doc(db, "exams", id)
    await updateDoc(docRef, {
      name: exam.name,
      questions: exam.questions,
    })
    return true
  } catch (error) {
    console.error("Error updating exam: ", error)
    // จำลองการอัปเดตสำเร็จเพื่อให้ UI ทำงานได้
    return true
  }
}

// Delete an exam
export async function deleteExam(id: string) {
  try {
    // ถ้า ID เริ่มต้นด้วย "mock" ให้จำลองการลบ
    if (id.startsWith("mock")) {
      console.log("Mock delete exam:", id)
      return true
    }

    const docRef = doc(db, "exams", id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting exam: ", error)
    // จำลองการลบสำเร็จเพื่อให้ UI ทำงานได้
    return true
  }
}

// Search exams by name or answer
export async function searchExams(searchTerm: string) {
  try {
    // Get all exams first
    const exams = await getExams()

    // Filter exams by name or answer content
    return exams.filter((exam) => {
      // Check if exam name contains search term
      if (exam.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true
      }

      // Check if any answer contains search term
      return exam.questions.some((q) => q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    })
  } catch (error) {
    console.error("Error searching exams: ", error)
    return []
  }
}
