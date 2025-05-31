"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Loader2, Trash2, AlertCircle, Star, Calendar, CheckCircle, User, Search } from "lucide-react"
import { getExamById, deleteExam, type Exam } from "@/lib/db"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function ExamDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredQuestions, setFilteredQuestions] = useState<{ question: string; answer: string }[]>([])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true)
        const examData = await getExamById(params.id)
        setExam(examData)
        if (examData) {
          setFilteredQuestions(examData.questions)
        }
      } catch (error) {
        console.error("Error loading exam:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลข้อสอบได้",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadExam()
  }, [params.id, toast])

  // Filter questions based on search term
  useEffect(() => {
    if (!exam) return

    if (!searchTerm.trim()) {
      setFilteredQuestions(exam.questions)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = exam.questions.filter(
      (q) => q.question.toLowerCase().includes(term) || q.answer.toLowerCase().includes(term),
    )
    setFilteredQuestions(filtered)
  }, [searchTerm, exam])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteExam(params.id)
      toast({
        title: "ลบข้อสอบเรียบร้อยแล้ว",
        description: "ข้อสอบถูกลบออกจากระบบเรียบร้อยแล้ว",
      })
      router.push("/")
    } catch (error) {
      console.error("Error deleting exam:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อสอบได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // Function to render rating stars
  const renderRating = (count: number) => {
    return (
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`rating-star ${i < count ? "fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout((window as any).searchTimeout)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-10 px-4 text-center flex-1 flex items-center justify-center">
          <div>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-10 px-4 text-center flex-1 flex items-center justify-center">
          <div className="modern-card p-8 rounded-xl max-w-md w-full">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-4">ไม่พบข้อสอบที่ต้องการ</h1>
            <p className="text-muted-foreground mb-6">ข้อสอบอาจถูกลบไปแล้วหรือไม่มีอยู่ในระบบ</p>
            <Link href="/">
              <Button className="w-full rounded-full">กลับไปหน้าหลัก</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto py-10 px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้าหลัก
            </Link>
          </div>

          <div className="modern-card-highlight p-6 mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="ml-2">
                    {exam.questionCount} ข้อ
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mt-2">{exam.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>สร้างเมื่อ: {exam.createdAt.toString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>ผู้สร้าง: Admin</span>
                  </div>
                </div>
                <div className="mt-3">{renderRating(4)}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/exam/${params.id}/edit`}>
                  <Button variant="outline" className="rounded-full">
                    <Edit className="mr-2 h-4 w-4" />
                    แก้ไข
                  </Button>
                </Link>

                <Button variant="destructive" className="rounded-full" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  ลบ
                </Button>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogContent className="modern-card border-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการลบข้อสอบ</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className="glass border-none rounded-full"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        ยกเลิก
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive/80 hover:bg-destructive rounded-full"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังลบ...
                          </>
                        ) : (
                          "ลบข้อสอบ"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Search bar for questions and answers */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ค้นหาคำถามหรือคำตอบ..."
                className="w-full pl-9 pr-4 glass border-none focus-visible:ring-primary/50 rounded-full"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  // Use setTimeout to debounce the search
                  clearTimeout((window as any).searchTimeout)
                  ;(window as any).searchTimeout = setTimeout(() => {
                    setSearchTerm(e.target.value)
                  }, 300)
                }}
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-muted-foreground">
                พบ {filteredQuestions.length} รายการที่ตรงกับ "{searchTerm}"
              </p>
            )}
          </div>

          {filteredQuestions.length > 0 ? (
            <ExamQuestions questions={filteredQuestions} />
          ) : (
            <div className="text-center py-10 modern-card">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">ไม่พบคำถามหรือคำตอบที่ตรงกับการค้นหา</h2>
              <p className="text-muted-foreground">ลองค้นหาด้วยคำอื่น</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} ExamBank. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  )
}

function ExamQuestions({ questions }: { questions: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-6 staggered-animation">
      {questions.map((q, index) => (
        <ExamQuestion key={index} number={index + 1} question={q.question} answer={q.answer} />
      ))}
    </div>
  )
}

function ExamQuestion({
  number,
  question,
  answer,
}: {
  number: number
  question: string
  answer: string
}) {
  return (
    <Card className="modern-card border-none staggered-item">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Badge variant="outline" className="mr-2 h-6 w-6 rounded-full flex items-center justify-center p-0">
            {number}
          </Badge>
          คำถามข้อที่ {number}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <CardDescription className="text-sm font-medium text-foreground">คำถาม</CardDescription>
          <p className="mt-1 p-3 bg-background/50 rounded-md">{question}</p>
        </div>
        <div>
          <CardDescription className="text-sm font-medium text-foreground">คำตอบที่ถูกต้อง</CardDescription>
          <p className="mt-1 p-3 bg-primary/5 rounded-md font-medium text-primary dark:text-primary/90 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            {answer}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
