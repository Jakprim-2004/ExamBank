"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "ค้นหา..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex w-full items-center space-x-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-8 glass border-none focus-visible:ring-primary/50 rounded-full"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="button" onClick={handleSearch} className="rounded-full">
        <Search className="mr-2 h-4 w-4" />
        ค้นหา
      </Button>
    </div>
  )
}
