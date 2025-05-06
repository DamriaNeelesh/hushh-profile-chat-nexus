
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

const connectedSources = [
  { id: "gmail", name: "Gmail", status: "connected" },
  { id: "gdrive", name: "Google Drive", status: "connected" },
  { id: "calendar", name: "Google Calendar", status: "connected" },
  { id: "dropbox", name: "Dropbox", status: "disconnected" },
];

const ProfileSettings = () => {
  const { state: { user }, logout } = useAuth();
  const { toast } = useToast();

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile settings and connected sources
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your basic account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
              <div>{user?.name || "User"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Email Address</div>
              <div>{user?.email || "user@example.com"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Sources</CardTitle>
          <CardDescription>
            Manage the data sources connected to your Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {source.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="flex items-center mt-1">
                      {source.status === "connected" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={source.status === "connected" ? "destructive" : "secondary"}
                  size="sm"
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
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Delete your Hushh account and all associated data. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
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
