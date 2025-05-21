"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // Here you would handle the feedback submission
    console.log("Feedback submitted:", feedback)
    setFeedback("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[500px] p-6 bg-white rounded-[16px] border border-[#F5F5F5] shadow-md"
        style={{ padding: "24px" }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-[18px] font-normal text-[#0A0A0A] mb-2">Leave Feedback</h2>
            <p className="text-[14px] font-normal text-[#A3A3A3]">
              We'd love to hear what went well or how we can improve the product experience.
            </p>
          </div>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback"
            className="min-h-[120px] border border-[#F5F5F5] rounded-[8px] p-4 text-[14px] resize-none"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #F5F5F5")}
            onBlur={(e) => (e.target.style.border = "1px solid #F5F5F5")}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-[8px] text-[14px] font-medium text-[#0A0A0A] hover:bg-[#FAFAFA] border border-[#F5F5F5]"
              style={{ padding: "10px 16px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-[14px] font-medium"
              style={{ padding: "10px 16px" }}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
