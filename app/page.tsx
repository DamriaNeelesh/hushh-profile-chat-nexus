"use client"; // ChatInterface is a client component

import React from "react";
import ChatInterface from "../src/components/chat/ChatInterface";
import { useIsMobile } from "../src/hooks/use-mobile";

export default function HomePage() {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow w-full">
        <ChatInterface />
      </div>
    </div>
  );
} 