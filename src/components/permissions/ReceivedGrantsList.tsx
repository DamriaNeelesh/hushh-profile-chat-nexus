'use client'
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useChat } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";

const ReceivedGrantsList = () => {
  const permissions = usePermissions();
  const { fetchGrants, state } = permissions || { fetchGrants: async () => {}, state: { grantsReceived: [], isLoading: false } };
  const { setContext } = useChat();
  const { grantsReceived, isLoading } = state;
  
  // Get active grants
  const activeGrants = grantsReceived.filter(grant => grant.isActive);

  useEffect(() => {
    if (fetchGrants) {
      fetchGrants();
    }
  }, [fetchGrants]);

  const handleStartChat = (grantorUserId: string, grantorName?: string) => {
    setContext({
      type: "delegated",
      targetUserId: grantorUserId,
      grantorName: grantorName || "User"
    });
    
    // Use window.location instead of Next.js router to avoid the error
    window.location.href = "/";
  };

  if (isLoading && activeGrants.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Profiles Shared With You</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          These users have granted you access to chat with their Profiles
        </p>
      </div>

      {activeGrants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 md:py-12 text-muted-foreground">
            <p className="text-sm md:text-base">No profiles have been shared with you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {activeGrants.map((grant) => (
            <Card key={grant.id} className="overflow-hidden">
              <div className="border-l-4 border-hushh-500 h-full">
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg">{grant.grantorName || "User"} has shared their Profile with you</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {grant.expiresAt
                      ? `Expires ${formatExpiryDate(grant.expiresAt)}`
                      : "Never expires"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 pt-0 md:pt-0">
                  <div>
                    <h4 className="text-xs md:text-sm font-medium mb-2">Access scope:</h4>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {grant.scope.map((scope, index) => (
                        <Badge key={index} variant="outline" className="text-xs md:text-sm bg-hushh-50 text-hushh-700 border-hushh-200">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartChat(grant.grantorUserId, grant.grantorName)}
                    className="w-full sm:w-auto text-xs md:text-sm"
                  >
                    <MessageSquare className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Chat with {grant.grantorName || "User"}'s Profile
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to handle date formatting safely on the client side
const formatExpiryDate = (isoDateString: string) => {
  try {
    // Only execute this on the client side
    if (typeof window !== 'undefined') {
      return formatDistanceToNow(new Date(isoDateString), { addSuffix: true });
    }
    return 'soon'; // Fallback for server-side rendering
  } catch (error) {
    return 'soon'; // Fallback if date is invalid
  }
};

export default ReceivedGrantsList;
