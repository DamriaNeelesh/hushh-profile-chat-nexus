
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/contexts/PermissionsContext";
import { formatDistanceToNow } from "date-fns";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ActiveGrantsList = () => {
  const { fetchGrants, revokePermission, state } = usePermissions();
  const { grantsIssued, isLoading } = state;
  
  // Get active grants
  const activeGrants = grantsIssued.filter(grant => grant.isActive);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  if (isLoading && activeGrants.length === 0) {
    return (
      <Card className="border-0 shadow-none mt-8">
        <CardHeader className="px-0">
          <CardTitle>Active Permissions</CardTitle>
          <CardDescription>
            Users who can chat with your Profile
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none mt-8">
      <CardHeader className="px-0">
        <CardTitle>Active Permissions</CardTitle>
        <CardDescription>
          Users who can chat with your Profile
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {activeGrants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            <p>You haven't granted access to anyone yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGrants.map((grant) => (
              <div 
                key={grant.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">{grant.recipientName || grant.recipientEmail}</div>
                  <div className="text-sm text-muted-foreground">
                    {grant.recipientEmail}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {grant.scope.map((scope, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {grant.expiresAt
                      ? `Expires ${formatDistanceToNow(new Date(grant.expiresAt), { addSuffix: true })}`
                      : "Never expires"}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => revokePermission(grant.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveGrantsList;
