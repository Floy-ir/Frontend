"use client"

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import React, { useState, useEffect } from "react"
import {
  Avatar,
  Button,
  ChatContainer,
  //   ChatHeader,
  ConversationHeader,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  Search,
  Sidebar,
  Status,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react"

export default function FullChatDemo() {
  const [messages, setMessages] = useState([
    {
      message: "Hello there!",
      sentTime: "10:00 AM",
      sender: "Alice",
      direction: "incoming",
      position: "single",
    },
    {
      message: "Hi! How are you?",
      sentTime: "10:01 AM",
      sender: "You",
      direction: "outgoing",
      position: "single",
    },
  ])

  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const newMessage = {
      message: text,
      sentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "You",
      direction: "outgoing",
      position: "single",
    }
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

  const containerWidth = width >= 900 ? "33%" : "100%"

  return (
    <div className="flex h-screen justify-start" dir="ltr">
      <MainContainer style={{ width: containerWidth }}>
        <ChatContainer>
          <ConversationHeader>
            <Avatar src="../apple-icon.png" name="Floy" />
            <ConversationHeader.Content userName="فلوی" className="font-anjoman-max" />
          </ConversationHeader>
          <MessageList
          //   typingIndicator={typing ? <TypingIndicator content="Alice is typing" /> : null}
          >
            {messages.map((msg, i) => (
              <Message key={i} model={msg} />
            ))}
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
