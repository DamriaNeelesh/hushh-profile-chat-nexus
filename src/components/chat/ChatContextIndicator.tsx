import { useChat } from "@/contexts/ChatContext";
import { MessageSquare, UserIcon } from "lucide-react";

const ChatContextIndicator = () => {
  const { state } = useChat();
  const { currentContext } = state;

  let title = "My Assistant";
  let description = "You are chatting with your own Assistant";
  let icon = <MessageSquare className="h-5 w-5 text-hushh-600" />;

  if (currentContext.type === "delegated" && currentContext.grantorName) {
    title = `${currentContext.grantorName}'s Assistant`;
    description = `You have been granted access to chat with ${currentContext.grantorName}'s Assistant`;
    icon = <UserIcon className="h-5 w-5 text-hushh-600" />;
  }

  return (
    <div className="bg-white border-b px-6 py-3 flex items-center sticky top-0 z-10 w-full">
      <div className="h-10 w-10 rounded-full bg-hushh-50 border border-hushh-200 flex items-center justify-center mr-3">
        {icon}
      </div>
      <div>
        <h2 className="font-medium text-lg">Chatting with: <span className="text-hushh-700">{title}</span></h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ChatContextIndicator;
