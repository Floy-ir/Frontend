 
 "use client"

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  // Avatar,
  // Button,
  ChatContainer,
  //   ChatHeader,
  // ConversationHeader,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  // Search,
  // Sidebar,
  // Status,
  // TypingIndicator,
} from "@chatscope/chat-ui-kit-react"
import type { MessageModel } from "@chatscope/chat-ui-kit-react"
import { Dot } from "lucide-react"
import React, { useEffect, useState } from "react"

import { MobileTabs } from "@/components/TripPlanner/MobileTabs"
import { TripPlannerPanel } from "@/components/TripPlanner/TripPlannerPanel"

import { mockMashhadTrip } from "./mockTripData"

export default function FullChatDemo() {
  const [messages, setMessages] = useState<MessageModel[]>([])
  // const [messages, setMessages] = useState<MessageModel[]>([
  //   {
  //     message: "سلام! به فلوی خوش اومدی 🌟",
  //     sentTime: "10:00",
  //     sender: "Floy",
  //     direction: "incoming",
  //     position: "single",
  //   },
  //   {
  //     message: "سلام، ممنونم! می‌خوام یه سفر برنامه‌ریزی کنم ✈️",
  //     sentTime: "10:01",
  //     sender: "You",
  //     direction: "outgoing",
  //     position: "single",
  //   },
  // ])

  const [input, setInput] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [typing, setTyping] = useState(false)

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const newMessage = {
      message: text,
      sentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "You",
      direction: "outgoing",
      position: "single",
    } as MessageModel
    setMessages([...messages, newMessage])
    setInput("")
    setTyping(false)
  }
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    handleResize() // set initial width
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isDesktop = width > 900

  // Chat component
  const chatComponent = (
    <MainContainer style={{ width: "100%" }}>
      <ChatContainer>
        {/* <ConversationHeader>
          <Avatar src="/favicon/android-chrome-192x192.png" name="Floy" />
          <ConversationHeader.Content userName="فلوی" className="font-anjoman-max" />
        </ConversationHeader> */}
        <MessageList
        // typingIndicator={typing ? <TypingIndicator content="Alice is typing" /> : null}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-primary-500 xs:text-2xl sm-md2:text-3xl text-3xl font-semibold md:text-2xl lg:text-3xl">
                !برنامه سفرت رو با فولی بچین
              </div>
              <div
                className="text-Gray-N700 sm-md2:text-md text-md lg:text-md mt-5 max-w-xs font-normal md:text-sm"
                dir="rtl"
              >
                تاریخ، مبدا و مقصدت رو بگو تا بهترین پرواز و برنامه سفر رو برات پیدا کنیم.
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="flex items-center justify-center">
                {/* #ededed */}
                {msg.direction === "incoming" && <Dot size={60} color="#5a28ee" className="mt-2 -mr-6" />}
                <Message model={msg} />
              </div>
            ))
          )}
        </MessageList>
        <MessageInput
          placeholder="برنامه سفرت چیه؟"
          value={input}
          onChange={(val) => {
            setInput(val)
            setTyping(val.length > 0)
          }}
          onSend={handleSend}
          attachButton={false}
          sendButton={true}
        />
      </ChatContainer>
    </MainContainer>
  )

  // Trip panel component
  const tripComponent = <TripPlannerPanel tripPlan={mockMashhadTrip} />

  // Desktop layout: side by side
  if (isDesktop) {
    return (
      <div className="flex h-screen" dir="ltr">
        {/* Chat Section - 40% width */}
        <div className="w-[40%] shrink-0">
          {chatComponent}
        </div>
        {/* Trip Planner Section - 60% width */}
        <div className="w-[60%] shrink-0 border-l border-gray-200">{tripComponent}</div>
        {/* Chat Section - 40% width */}
        <div className="w-[40%] shrink-0">{chatComponent}</div>
      </div>
    )
  }

  // Mobile layout: tabs
  return <MobileTabs chatContent={chatComponent} tripContent={tripComponent} />
}
