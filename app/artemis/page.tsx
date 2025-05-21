"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  MoreHorizontalIcon,
  ZapIcon,
  ShieldIcon,
  CircleAlertIcon,
  PenSquareIcon,
  PaperclipIcon,
  ArrowUpIcon,
  XIcon,
  MapPinIcon,
} from "@/components/icons/lucide-icons"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { format } from "date-fns"
import { AvatarIcon } from "@/components/icons"
import { GoogleGenAI } from "@google/genai"

type SectionType = "artemis" | "monitor" | "activity" | "feedback"

interface Message {
  id: string
  content: string
  sender: "user" | "artemis"
  timestamp: Date
  isNew?: boolean
  attachedFiles?: File[]
}

function TypewriterEffect({
  text,
  speed = 30,
  showEffect = true,
  isThinking = false,
}: {
  text: string
  speed?: number
  showEffect?: boolean
  isThinking?: boolean
}) {
  const [displayedText, setDisplayedText] = useState(showEffect ? "" : text)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(!showEffect)

  useEffect(() => {
    if (isThinking) {
      return; // Don't animate for thinking state
    }
    
    if (!showEffect) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, showEffect, isThinking])

  if (isThinking) {
    return (
      <div className="flex items-center">
        <span>Analyzing your request</span>
        <span className="ml-1 inline-flex">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-300">.</span>
          <span className="animate-pulse delay-600">.</span>
        </span>
      </div>
    )
  }

  return (
    <>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </>
  )
}

async function generateGeminiResponse(prompt: string, systemPrompt = "", imageData?: string | null) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });
    
    let response;
    
    if (imageData) {
      // If we have image data, include it in the content
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] } }
            ]
          }
        ],
        config: {
          systemInstruction: systemPrompt || "You are Artemis, a helpful AI assistant. Keep your responses concise, under 5 lines. Do not use symbols like * or #.",
          maxOutputTokens: 100,
          temperature: 0.7,
        },
      });
    } else {
      // Text-only prompt
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        config: {
          systemInstruction: systemPrompt || "You are Artemis, a helpful AI assistant. Keep your responses concise, under 5 lines. Do not use symbols like * or #.",
          maxOutputTokens: 100,
          temperature: 0.7,
        },
      });
    }

    // Get response text
    const text = response.text || "";
    
    // Ensure response is no more than 5 lines
    const lines = text.split("\n");
    return lines.slice(0, 5).join("\n");
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm having trouble processing your request right now. Please try again.";
  }
}

// Fallback responses in case API is not available
const fallbackResponses = [
  "I've analyzed your request and found no security concerns at this time. Your system appears to be functioning normally.",
  "Based on the information provided, I recommend updating your security protocols to address potential vulnerabilities.",
  "Your recent activity shows normal patterns. No suspicious behavior has been detected in the monitored areas.",
  "I've processed your query and can confirm that all systems are currently operational with no alerts to report.",
  "The data suggests everything is working as expected. No immediate action is required at this time.",
]

export default function ArtemisPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("artemis")
  const [message, setMessage] = useState("")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [chats, setChats] = useState<{ id: string; title: string; messages: Message[] }[]>([
    { id: "default", title: "New chat", messages: [] },
    { id: "chat1", title: "Leadership skills", messages: [] },
    { id: "chat2", title: "Project planning", messages: [] },
    { id: "chat3", title: "Team management", messages: [] },
  ])
  const [activeChat, setActiveChat] = useState("default")
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false)

  const [showHistoryView, setShowHistoryView] = useState(false)

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [message])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
        setShowHistoryView(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Helper function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && attachedFiles.length === 0) return
    if (isProcessing) return

    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      isNew: false,
      attachedFiles: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Update the chat with new messages
    setChats(chats.map((chat) => (chat.id === activeChat ? { ...chat, messages: updatedMessages } : chat)))

    const userQuery = message
    setMessage("")
    setAttachedFiles([])

    // Add thinking message
    const thinkingId = (Date.now() + 1).toString()
    const thinkingMessage: Message = {
      id: thinkingId,
      content: "Analyzing your request...",
      sender: "artemis",
      timestamp: new Date(),
      isNew: true,
    }
    
    setMessages([...updatedMessages, thinkingMessage])

    try {
      // Process image if attached
      let imageData = null;
      if (attachedFiles.length > 0) {
        const imageFile = attachedFiles.find((file) => file.type.startsWith("image/"));
        if (imageFile) {
          imageData = await readFileAsDataURL(imageFile);
        }
      }

      // Generate response using Gemini
      let responseText;
      try {
        responseText = await generateGeminiResponse(
          userQuery,
          "You are Artemis, an AI security assistant. Keep responses concise, under 5 lines. No symbols.",
          imageData,
        );
      } catch (error) {
        console.error("Error with Gemini API:", error);
        // Use fallback response if API fails
        responseText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }

      // Replace thinking message with actual response
      const artemisMessage: Message = {
        id: thinkingId, // Use the same ID to replace the thinking message
        content: responseText,
        sender: "artemis",
        timestamp: new Date(),
        isNew: true,
      }

      const newUpdatedMessages = [...updatedMessages, artemisMessage]
      setMessages(newUpdatedMessages)

      // Update the chat with new messages including AI response
      setChats(chats.map((chat) => (chat.id === activeChat ? { ...chat, messages: newUpdatedMessages } : chat)))

      // After animation completes
      const animationTime = artemisMessage.content.length * 30 + 1000
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === artemisMessage.id ? { ...msg, isNew: false } : msg)))

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: chat.messages.map((msg) => (msg.id === artemisMessage.id ? { ...msg, isNew: false } : msg)),
              }
            }
            return chat
          }),
        )
      }, animationTime)
    } catch (error) {
      console.error("Error in message handling:", error)

      // Replace thinking with error message
      const errorMessage: Message = {
        id: thinkingId, // Use the same ID to replace the thinking message
        content: "I'm having trouble processing your request right now. Please try again.",
        sender: "artemis",
        timestamp: new Date(),
        isNew: false,
      }

      setMessages([...updatedMessages, errorMessage])
      setChats(
        chats.map((chat) =>
          chat.id === activeChat ? { ...chat, messages: [...updatedMessages, errorMessage] } : chat,
        ),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachedFile = (fileName: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  const showWelcomeMessage = messages.length === 0

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <div className="flex items-center text-gray-500 text-sm">
            <span>Artemis</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{chats.find((chat) => chat.id === activeChat)?.title || "New chat"}</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => {
                const newChatId = Date.now().toString()
                setChats([...chats, { id: newChatId, title: "New chat", messages: [] }])
                setActiveChat(newChatId)
                setMessages([])
              }}
              className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="New chat"
            >
              <PenSquareIcon size={12} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        {showWelcomeMessage ? (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center max-w-3xl w-full px-6">
              <h1 className="text-[24px] font-medium mb-8">How can I help you today?</h1>

              {/* Input Area */}
              <div className="w-full flex flex-col">
                <div className="relative">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center border border-[#F5F5F5] rounded-[32px] px-6 py-3 bg-white w-full"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#193BE2] to-[#0091FF]"></div>
                    </div>
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 outline-none resize-none max-h-32 text-[14px] font-normal my-auto bg-transparent"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mr-2 max-w-[200px] overflow-hidden">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 border border-[#F5F5F5] bg-white rounded-full px-2 py-0.5 text-[10px]"
                          >
                            <span className="truncate max-w-[80px] text-[12px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachedFile(file.name)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <XIcon size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 ml-2">
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileAttachment}
                          className="hidden"
                          multiple
                        />
                        <button
                          type="button"
                          className="p-2 bg-white rounded-[32px] text-[#0A0A0A] flex items-center justify-center relative"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <PaperclipIcon size={12} />
                          {attachedFiles.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {attachedFiles.length}
                            </span>
                          )}
                        </button>
                      </>
                      <button
                        type="submit"
                        className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center"
                        disabled={(!message.trim() && attachedFiles.length === 0) || isProcessing}
                      >
                        <ArrowUpIcon size={12} />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-2.5 mt-6 w-full">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
                    style={{ "--hover-color": "#4F46E5" } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = "#4F46E51A"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
                    }}
                    onClick={() => {
                      setMessage("Can you provide a security overview?")
                      handleSendMessage(new Event("submit") as any)
                    }}
                    disabled={isProcessing}
                  >
                    <div className="w-4 h-4 flex-shrink-0" style={{ color: "#4F46E5" }}>
                      <ShieldIcon size={12} />
                    </div>
                    <span className="whitespace-nowrap truncate">Security overview</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
                    style={{ "--hover-color": "#F59E0B" } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = "#F59E0B1A"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
                    }}
                    onClick={() => {
                      setMessage("Show me my recent activity")
                      handleSendMessage(new Event("submit") as any)
                    }}
                    disabled={isProcessing}
                  >
                    <div className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B" }}>
                      <ZapIcon size={12} />
                    </div>
                    <span className="whitespace-nowrap truncate">Recent activity</span>
                  </Button>

                  {/* <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
                    style={{ "--hover-color": "#EF4444" } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = "#EF44441A"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
                    }}
                    onClick={() => {
                      setMessage("Are there any active threats to my security?")
                      handleSendMessage(new Event("submit") as any)
                    }}
                    disabled={isProcessing}
                  >
                    <div className="w-4 h-4 flex-shrink-0" style={{ color: "#EF4444" }}>
                      <CircleAlertIcon size={12} />
                    </div>
                    <span className="whitespace-nowrap truncate">Threats</span>
                  </Button> */}

                  {/* Botón especial con efecto de barrido de luz */}
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
                    style={
                      {
                        "--hover-color": "#6B7280",
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = `#6B72801A` // 10% opacity
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
                    }}
                    onClick={() => {
                      setMessage("What is the current status of New York?")
                      handleSendMessage(new Event("submit") as any)
                    }}
                    disabled={isProcessing}
                  >
                    <div className="w-4 h-4 flex-shrink-0" style={{ color: "#6B7280" }}>
                      <MapPinIcon size={12} />
                    </div>
                    <span className="whitespace-nowrap truncate">New York status</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
                    style={{ "--hover-color": "#6B7280" } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = "#6B72801A"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
                    }}
                    onClick={() => {
                      setMessage("What else can you help me with?")
                      handleSendMessage(new Event("submit") as any)
                    }}
                    disabled={isProcessing}
                  >
                    <div className="w-4 h-4 flex-shrink-0" style={{ color: "#6B7280" }}>
                      <MoreHorizontalIcon size={12} />
                    </div>
                    <span className="whitespace-nowrap truncate">More</span>
                  </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-[14px] font-normal text-[#A3A3A3] mt-8 w-full">
                  Artemis is currently in beta development and may produce errors. Your{" "}
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="font-medium text-[#0A0A0A] cursor-pointer hover:underline"
                  >
                    feedback
                  </button>{" "}
                  helps us improve.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat messages */}
            <div className="flex-1 overflow-auto">
              <div className="w-full max-w-3xl mx-auto px-6 py-8 pb-32">
                <div className="flex flex-col space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div
                          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${
                            msg.sender === "user" ? "ml-3" : "mr-3"
                          }`}
                        >
                          {msg.sender === "user" ? (
                            <AvatarIcon className="w-full h-full" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#193BE2] to-[#0091FF]">
                              {/* AI orb */}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div
                            className={`px-4 py-3 ${
                              msg.sender === "user"
                                ? "bg-white border border-[#F5F5F5] rounded-tl-xl rounded-tr-none rounded-bl-xl rounded-br-xl"
                                : "bg-[#FAFAFA] bg-opacity-25 border border-[#F5F5F5] rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-xl"
                            }`}
                          >
                            <p className="text-[14px] text-[#0A0A0A] mb-1">
                              {msg.sender === "user" ? (
                                msg.content
                              ) : (
                                <TypewriterEffect 
                                  text={msg.content} 
                                  showEffect={msg.isNew} 
                                  isThinking={msg.content === "Analyzing your request..." && msg.isNew}
                                />
                              )}
                            </p>

                            {/* Mostrar archivos adjuntos si existen */}
                            {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 mb-2">
                                {msg.attachedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 border border-[#F5F5F5] bg-white rounded-full px-2 py-0.5"
                                  >
                                    <span className="truncate max-w-[120px] text-[12px]">{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div
                              className={`text-[12px] text-[#A3A3A3] ${
                                msg.sender === "user" ? "text-right" : "text-left"
                              }`}
                            >
                              {msg.sender === "user" ? "You" : "Artemis"} - {format(msg.timestamp, "HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input area at bottom when in chat mode */}
            <div className="fixed bottom-0 left-16 right-0 bg-white p-4 z-10">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <div className="flex items-center border border-[#F5F5F5] rounded-[32px] px-6 py-3 bg-white w-full">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#193BE2] to-[#0091FF]"></div>
                    </div>
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 outline-none resize-none max-h-32 text-[14px] font-normal my-auto bg-transparent"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mr-2 max-w-[200px] overflow-hidden">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 border border-[#F5F5F5] bg-white rounded-full px-2 py-0.5 text-[10px]"
                          >
                            <span className="truncate max-w-[80px] text-[12px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachedFile(file.name)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <XIcon size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 ml-2">
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileAttachment}
                          className="hidden"
                          multiple
                        />
                        <button
                          type="button"
                          className="p-2 bg-white rounded-[32px] text-[#0A0A0A] flex items-center justify-center relative"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <PaperclipIcon size={12} />
                          {attachedFiles.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {attachedFiles.length}
                            </span>
                          )}
                        </button>
                      </>
                      <button
                        type="submit"
                        className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center"
                        disabled={(!message.trim() && attachedFiles.length === 0) || isProcessing}
                      >
                        <ArrowUpIcon size={12} />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Footer text */}
                <div className="text-center text-[14px] font-normal text-[#A3A3A3] mt-4 w-full">
                  Artemis is currently in beta development and may produce errors. Your{" "}
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="font-medium text-[#0A0A0A] cursor-pointer hover:underline"
                  >
                    feedback
                  </button>{" "}
                  helps us improve.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Are you absolutely sure?</h2>
            <p className="text-gray-500 mb-6">
              This action cannot be undone. This will permanently delete this chat and all its messages.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false)
                  setChatToDelete(null)
                }}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (chatToDelete) {
                    if (chats.length > 1) {
                      const newChats = chats.filter((chat) => chat.id !== chatToDelete)
                      setChats(newChats)
                      setActiveChat(newChats[0].id)
                      setMessages([])
                    } else {
                      // If it's the last chat, just clear messages
                      setMessages([])
                    }
                    setDeleteConfirmOpen(false)
                    setChatToDelete(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteAllConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Delete all chats?</h2>
            <p className="text-gray-500 mb-6">
              This action cannot be undone. This will permanently delete all your chats and conversation history.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteAllConfirmOpen(false)} className="px-4 py-2">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Keep only the default chat and clear its messages
                  setChats([{ id: "default", title: "New chat", messages: [] }])
                  setActiveChat("default")
                  setMessages([])
                  setDeleteAllConfirmOpen(false)
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                Delete All
              </Button>
            </div>
          </div>
        </div>
      )}

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}
