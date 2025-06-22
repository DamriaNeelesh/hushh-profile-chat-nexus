import { useChat } from "@/contexts/ChatContext";
import { MessageSquare, UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatContextIndicator = () => {
  const { state } = useChat();
  const { currentContext } = state;
  const isMobile = useIsMobile();

  let title = "My Assistant";
  let description = "You are chatting with your own Assistant";
  let icon = <MessageSquare className="h-5 w-5 text-hushh-600" />;

  if (currentContext.type === "delegated" && currentContext.grantorName) {
    title = `${currentContext.grantorName}'s Assistant`;
    description = `You have been granted access to chat with ${currentContext.grantorName}'s Assistant`;
    icon = <UserIcon className="h-5 w-5 text-hushh-600" />;
  }

  return (
    <div className="bg-white border-b px-3 md:px-6 py-2 md:py-3 flex items-center sticky top-0 z-10 w-full">
      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-hushh-50 border border-hushh-200 flex items-center justify-center mr-2 md:mr-3">
        {icon}
      </div>
      <div className="overflow-hidden">
        <h2 className="font-medium text-sm md:text-lg truncate">
          Chatting with: <span className="text-hushh-700">{title}</span>
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground truncate">{description}</p>
      </div>
    </div>
  );
};

export default ChatContextIndicator;
