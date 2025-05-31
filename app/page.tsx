"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2, Search, BookOpen, Star, TrendingUp, Calendar } from "lucide-react"
import { getExams, searchExams, type Exam } from "@/lib/db"
import { initAnalytics } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import { FirebaseErrorMessage } from "@/components/firebase-error-message"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [firebaseError, setFirebaseError] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Get sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true")
    }
  }, [])

  useEffect(() => {
    // Initialize Firebase Analytics
    initAnalytics()

    // Load exams only once on initial render
    loadExams()
  }, [])

  // Separate effect for handling search params
  useEffect(() => {
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
      handleSearch(searchFromUrl)
    }
  }, [searchParams])

  const loadExams = async () => {
    try {
      setLoading(true)
      setFirebaseError(false)
      const examData = await getExams()
      setExams(examData)
    } catch (error) {
      console.error("Error loading exams:", error)
      setFirebaseError(true)
      // Set some mock data to prevent infinite loading state
      setExams([
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
      ])
      toast({
        title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        description: "กำลังใช้ข้อมูลจำลองแทน",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)

    if (!term.trim()) {
      // If search is cleared, load all exams
      loadExams()
      return
    }

    try {
      setSearching(true)
      const results = await searchExams(term)
      setExams(results)
    } catch (error) {
      console.error("Error searching exams:", error)
      toast({
        title: "เกิดข้อผิดพลาดในการค้นหา",
        description: "ไม่สามารถค้นหาข้อมูลได้ กำลังแสดงข้อมูลทั้งหมดแทน",
        variant: "destructive",
      })
      loadExams() // Fallback to loading all exams
    } finally {
      setSearching(false)
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
        <div className="container mx-auto py-10 px-4">
          {/* Welcome Section */}
          <section className="mb-12">
            <div className="modern-card-highlight p-8 md:p-10">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">ยินดีต้อนรับสู่ ExamBank</h1>
                <p className="text-muted-foreground text-lg mb-6">
                  แพลตฟอร์มจัดเก็บและแชร์ข้อสอบที่ช่วยให้คุณเรียนรู้ได้อย่างมีประสิทธิภาพ
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/add-exam">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      เพิ่มข้อสอบใหม่
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {firebaseError && <FirebaseErrorMessage />}

          {/* All Exams or Search Results */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                {searchTerm ? (
                  <>
                    <Search className="mr-2 h-5 w-5 text-primary" />
                    ผลการค้นหา "{searchTerm}"
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    ข้อสอบทั้งหมด
                  </>
                )}
              </h2>
              {searchTerm && <p className="text-sm text-muted-foreground">พบ {exams.length} รายการ</p>}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {exams.map((exam, index) => (
                    <Link href={`/exam/${exam.id}`} key={exam.id} className="block">
                      <div className="modern-card p-6 h-full flex flex-col staggered-item">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="shrink-0">
                            {exam.questionCount} ข้อ
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mt-2 mb-2 line-clamp-2">{exam.name}</h3>
                        <div className="mt-2 mb-4">{renderRating(3 + Math.floor(Math.random() * 3))}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-auto">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>สร้างเมื่อ: {exam.createdAt.toString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {exams.length === 0 && (
                  <div className="text-center py-20 modern-card animate-fade-in">
                    {searchTerm ? (
                      <div className="p-8">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-4">ไม่พบข้อสอบที่ตรงกับการค้นหา</h2>
                        <p className="text-muted-foreground mb-8">ลองค้นหาด้วยคำอื่น หรือเพิ่มข้อสอบใหม่</p>
                        <Button variant="outline" onClick={() => handleSearch("")} className="rounded-full px-6">
                          แสดงข้อสอบทั้งหมด
                        </Button>
                      </div>
                    ) : (
                      <div className="p-8">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-4">ยังไม่มีข้อสอบในระบบ</h2>
                        <p className="text-muted-foreground mb-8">เริ่มต้นด้วยการเพิ่มข้อสอบใหม่</p>
                        <Link href="/add-exam">
                          <Button className="rounded-full px-6">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            เพิ่มข้อสอบใหม่
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <footer
        className={`border-t py-6 md:py-0 transition-all duration-300 ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} ExamBank. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  )
}
