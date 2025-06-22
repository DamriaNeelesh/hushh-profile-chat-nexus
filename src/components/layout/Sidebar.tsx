import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  Key, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const { logout, state: { user } } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Reset sidebar state when switching between mobile and desktop
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);

  const sidebarItems = [
    {
      title: "My Assistant Chat",
      icon: <MessageSquare size={20} />,
      path: "/",
    },
    {
      title: "Shared With Me",
      icon: <Users size={20} />,
      path: "/shared",
    },
    {
      title: "Grant Access",
      icon: <Key size={20} />,
      path: "/grant",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Header with Logo */}
      <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
        {(!collapsed || isMobile) && (
          <div className="font-bold text-xl text-hushh-600">hushh</div>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-full p-2 h-8 w-8",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 h-8 w-8"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className={cn(
        "p-4 border-b border-sidebar-border flex items-center gap-3",
        collapsed && !isMobile ? "justify-center" : "justify-start"
      )}>
        <div className="w-8 h-8 rounded-full bg-hushh-100 flex items-center justify-center text-hushh-700">
          <User size={16} />
        </div>
        {(!collapsed || isMobile) && (
          <div className="truncate">
            <div className="font-medium text-sm">{user?.name || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <TooltipProvider>
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full justify-start",
                        collapsed && !isMobile ? "px-2" : "px-3"
                      )}
                    >
                      <span className={cn(collapsed && !isMobile ? "mx-auto" : "mr-3")}>{item.icon}</span>
                      {(!collapsed || isMobile) && <span>{item.title}</span>}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={logout} 
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                collapsed && !isMobile ? "px-2" : "px-3"
              )}
            >
              <span className={cn(collapsed && !isMobile ? "mx-auto" : "mr-3")}><LogOut size={20} /></span>
              {(!collapsed || isMobile) && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && !isMobile && (
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </>
  );

  // Mobile sidebar with sheet component
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden fixed top-4 left-4 z-50"
            >
              <Menu size={24} />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "min-h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64",
      "hidden md:flex" // Hide on mobile
    )}>
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
