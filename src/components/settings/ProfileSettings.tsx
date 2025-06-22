import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const connectedSources = [
  { id: "gmail", name: "Gmail", status: "connected" },
  { id: "gdrive", name: "Google Drive", status: "connected" },
  { id: "calendar", name: "Google Calendar", status: "connected" },
  { id: "dropbox", name: "Dropbox", status: "disconnected" },
];

const ProfileSettings = () => {
  const { state: { user }, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDeleteAccount = () => {
    // In a real app, we'd make an API call to delete the account
    toast({
      title: "Account Deletion Requested",
      description: "This is a stub. In a real app, your account would be scheduled for deletion.",
    });
    
    // Log the user out after a short delay
    setTimeout(() => {
      logout();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your Assistant settings and connected sources
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Assistant Information</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Your basic account details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Name</div>
              <div className="text-sm md:text-base">{user?.name || "User"}</div>
            </div>
            <div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Email Address</div>
              <div className="text-sm md:text-base">{user?.email || "user@example.com"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Sources */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Connected Sources</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Manage the data sources connected to your Assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="space-y-3 md:space-y-4">
            {connectedSources.map((source) => (
              <div key={source.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 md:pb-4 last:border-0 last:pb-0">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="mr-3 md:mr-4 h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center text-sm md:text-base">
                    {source.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base">{source.name}</div>
                    <div className="flex items-center mt-1">
                      {source.status === "connected" ? (
                        <Badge variant="outline" className="text-xs md:text-sm bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs md:text-sm bg-gray-100 text-gray-500 border-gray-200">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={source.status === "connected" ? "destructive" : "secondary"}
                  size={isMobile ? "sm" : "default"}
                  className="text-xs md:text-sm w-full sm:w-auto"
                >
                  {source.status === "connected" ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Security</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Delete your Hushh account and all associated data. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size={isMobile ? "sm" : "default"}
                className="text-xs md:text-sm"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] w-[400px] md:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base md:text-lg">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs md:text-sm">
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-xs md:text-sm">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground text-xs md:text-sm">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
