
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useChat } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";

const ReceivedGrantsList = () => {
  const { fetchGrants, state } = usePermissions();
  const { setContext } = useChat();
  const navigate = useNavigate();
  const { grantsReceived, isLoading } = state;
  
  // Get active grants
  const activeGrants = grantsReceived.filter(grant => grant.isActive);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const handleStartChat = (grantorUserId: string, grantorName?: string) => {
    setContext({
      type: "delegated",
      targetUserId: grantorUserId,
      grantorName: grantorName || "User"
    });
    navigate("/");
  };

  if (isLoading && activeGrants.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Profiles Shared With You</h1>
        <p className="text-muted-foreground">
          These users have granted you access to chat with their Profiles
        </p>
      </div>

      {activeGrants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <p>No profiles have been shared with you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeGrants.map((grant) => (
            <Card key={grant.id} className="overflow-hidden">
              <div className="border-l-4 border-hushh-500 h-full">
                <CardHeader>
                  <CardTitle>{grant.grantorName || "User"} has shared their Profile with you</CardTitle>
                  <CardDescription>
                    {grant.expiresAt
                      ? `Expires ${formatDistanceToNow(new Date(grant.expiresAt), { addSuffix: true })}`
                      : "Never expires"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Access scope:</h4>
                    <div className="flex flex-wrap gap-2">
                      {grant.scope.map((scope, index) => (
                        <Badge key={index} variant="outline" className="bg-hushh-50 text-hushh-700 border-hushh-200">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartChat(grant.grantorUserId, grant.grantorName)}
                    className="w-full sm:w-auto"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
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

export default ReceivedGrantsList;
