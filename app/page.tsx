"use client"; // ChatInterface is a client component

import ChatInterface from "@/components/chat/ChatInterface";
import Sidebar from "@/components/layout/Sidebar";
export default function HomePage() {
  return (
    <div className="h-full flex flex-row">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-grow w-full">
        <ChatInterface />
      </div>
    </div>
  );
} 