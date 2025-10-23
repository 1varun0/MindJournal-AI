"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
        <textarea
          id="journal"
          aria-label="Write about your thoughts and feelings today"
          placeholder="Write about your thoughts and feelings today..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-56 w-full resize-y rounded-md border bg-input p-4 font-sans text-base leading-relaxed text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
        />
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