"use client"

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  Avatar,
  // Button,
  ChatContainer,
  //   ChatHeader,
  ConversationHeader,
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

export default function FullChatDemo() {
  const [messages, setMessages] = useState<MessageModel[]>([])

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
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  let containerWidth = "100%"
  if (width > 900) {
    containerWidth = "40%"
    // } else if (width > 700) {
    //   containerWidth = "30%"
  }

  return (
    <div className="flex h-screen justify-start" dir="ltr">
      <MainContainer style={{ width: containerWidth }}>
        <ChatContainer>
          <ConversationHeader>
            <Avatar src="../apple-icon.png" name="Floy" />
            <ConversationHeader.Content userName="فلوی" className="font-anjoman-max" />
          </ConversationHeader>
          <MessageList
          // typingIndicator={typing ? <TypingIndicator content="Alice is typing" /> : null}
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="text-primary-500 font-semibold xs:text-2xl sm-md2:text-3xl text-3xl md:text-2xl lg:text-3xl">
                  !برنامه سفرت رو با فولی بچین
                </div>
                <div className="text-Gray-N700 mt-5 max-w-xs font-normal sm-md2:text-md text-md md:text-sm lg:text-md" dir="rtl">
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
    </div>
  )
}
