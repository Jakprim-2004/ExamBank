"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Loader2, Save } from "lucide-react"
import { getExamById, updateExam } from "@/lib/db"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"

export default function EditExam({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [examName, setExamName] = useState("")
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const questionsContainerRef = useRef<HTMLDivElement>(null)
  const lastQuestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true)
        const exam = await getExamById(params.id)

        if (exam) {
          setExamName(exam.name)
          setQuestions(exam.questions)
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

  // เมื่อเพิ่มคำถามใหม่ ให้เลื่อนไปยังคำถามล่าสุด
  useEffect(() => {
    if (!loading && lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [questions.length, loading])

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: "question" | "answer", value: string) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // Update exam in Firestore
      await updateExam(params.id, {
        name: examName,
        questions: questions,
      })

      toast({
        title: "บันทึกการแก้ไขเรียบร้อยแล้ว",
        description: "ข้อสอบถูกอัปเดตเรียบร้อยแล้ว",
      })

      // Redirect to the exam page
      router.push(`/exam/${params.id}`)
    } catch (error) {
      console.error("Error updating exam:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการแก้ไขได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (!examName && questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบข้อสอบที่ต้องการ</h1>
          <Link href="/">
            <Button>กลับไปหน้าหลัก</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto py-10 px-4 max-w-3xl">
          <div className="mb-6">
            <Link href={`/exam/${params.id}`} className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้าข้อสอบ
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="glass-card dark:glass-dark border-none animate-fade-in">
              <CardHeader>
                <CardTitle>แก้ไขข้อสอบ</CardTitle>
                <CardDescription>แก้ไขรายละเอียดข้อสอบและคำถามพร้อมเฉลย</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="exam-name">ชื่อข้อสอบ</Label>
                  <Input
                    id="exam-name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="เช่น คณิตศาสตร์ ม.3 เทอม 1"
                    required
                    className="glass border-none focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">คำถามและเฉลย</h3>
                    <Badge variant="outline">{questions.length} ข้อ</Badge>
                  </div>

                  {/* เพิ่ม div ที่มี scroll สำหรับรายการคำถาม */}
                  <div className="questions-container" ref={questionsContainerRef}>
                    <div className={`space-y-4 ${questions.length <= 5 ? "staggered-animation" : ""}`}>
                      {questions.map((q, index) => (
                        <Card
                          key={index}
                          className="glass border-none staggered-item"
                          ref={index === questions.length - 1 ? lastQuestionRef : null}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base flex items-center">
                                <Badge
                                  variant="outline"
                                  className="mr-2 h-6 w-6 rounded-full flex items-center justify-center p-0"
                                >
                                  {index + 1}
                                </Badge>
                                ข้อที่ {index + 1}
                              </CardTitle>
                              {questions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuestion(index)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <div className="space-y-2">
                              <Label htmlFor={`question-${index}`}>คำถาม</Label>
                              <Textarea
                                id={`question-${index}`}
                                value={q.question}
                                onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                placeholder="พิมพ์คำถามที่นี่"
                                required
                                className="glass border-none focus-visible:ring-primary/50 min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`answer-${index}`}>คำตอบที่ถูกต้อง</Label>
                              <Input
                                id={`answer-${index}`}
                                value={q.answer}
                                onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                                placeholder="พิมพ์คำตอบที่ถูกต้อง"
                                required
                                className="glass border-none focus-visible:ring-primary/50"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full glass hover:bg-secondary/50"
                    onClick={addQuestion}
                    disabled={questions.length >= 60}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มคำถาม
                  </Button>
                  {questions.length >= 50 && (
                    <p className="text-sm text-muted-foreground text-center">จำกัดไว้ที่ 60 ข้อต่อชุดข้อสอบ</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full glass hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      บันทึกการแก้ไข
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} ระบบจัดเก็บข้อสอบ. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  )
}
