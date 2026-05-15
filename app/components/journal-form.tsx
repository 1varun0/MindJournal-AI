"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles } from "lucide-react"

// 1. Import the necessary Amplify functions
import { generateClient } from "aws-amplify/api"

// 2. Create the secure API client
const client = generateClient()

export function JournalForm() {
  const [entry, setEntry] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("") // Add error state
  const [isSuccess, setIsSuccess] = React.useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entry || isSubmitting) return
    
    setIsSubmitting(true)
    setError("") // Clear previous errors

    try {
      // 3. Use inline GraphQL mutation instead of import
      const result = await client.graphql({
        query: `
          mutation CreateEntry($input: CreateEntryInput!) {
            createEntry(input: $input) {
              id
              content
              createdAt
            }
          }
        `,
        variables: {
          input: {
            content: entry,
            // Add minimal required fields based on your schema
            moodScore: 5, // Default neutral score
            anxietyScore: 3, // Default low anxiety
            stressScore: 3, // Default low stress
            moodCategory: "Neutral" // Default category
          },
        },
      })

      console.log("Entry created successfully:", result)
      setIsSuccess(true)
      setEntry("");
      
      // Force a full page reload to the dashboard to show fresh data
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (error: any) {
      console.error("Full error creating journal entry:", error)
      
      // Better error handling
      const errorMessage = error.errors?.[0]?.message || 
                          error.message || 
                          "Failed to create journal entry. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 4. The mood and anxiety dropdowns have been removed */}

      <div>
        <label htmlFor="journal" className="block text-sm font-medium text-foreground mb-2">
          Journal Entry
        </label>
        <div className="relative">
          <textarea
            id="journal"
            aria-label="Write about your thoughts and feelings today"
            placeholder="Write about your thoughts and feelings today..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={isSubmitting}
            className="min-h-56 w-full resize-y rounded-md border bg-input p-4 font-sans text-base leading-relaxed text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          
          {isSubmitting && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-md border border-blue-200/50 dark:border-blue-700/50 transition-all duration-500">
              <div className="relative mb-4">
                <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-pulse" />
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-blue-500 animate-bounce" />
              </div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 animate-pulse">
                Amazon Bedrock is analyzing your thoughts...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Add error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">Entry submitted successfully! Redirecting...</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          type="submit" 
          aria-label="Submit journal entry" 
          disabled={isSubmitting || !entry.trim()}
        >
          {isSubmitting ? "Analyzing & Saving..." : "Submit Entry"}
        </Button>
      </div>
    </form>
  )
}