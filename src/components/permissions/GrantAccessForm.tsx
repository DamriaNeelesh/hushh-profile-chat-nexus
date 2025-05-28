import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Loader2 } from "lucide-react";

const grantSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  scope: z.array(z.string()).min(1, "Select at least one scope"),
  duration: z.string(),
});

type GrantFormValues = z.infer<typeof grantSchema>;

const scopeOptions = [
  { id: "financial", label: "Access Financial Insights" },
  { id: "receipts", label: "Access Receipt Information" },
  { id: "calendar", label: "Access Calendar Information" },
  { id: "contacts", label: "Access Contact Information" },
];

const durationOptions = [
  { value: "24h", label: "24 hours" },
  { value: "1w", label: "1 week" },
  { value: "1m", label: "1 month" },
  { value: "indefinite", label: "Indefinite" },
];

const GrantAccessForm = () => {
  const permissions = usePermissions();
  const { grantPermission, state } = permissions || { grantPermission: async () => {}, state: { isLoading: false } };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GrantFormValues>({
    resolver: zodResolver(grantSchema),
    defaultValues: {
      recipientEmail: "",
      scope: [],
      duration: "1w",
    },
  });

  const onSubmit = async (data: GrantFormValues) => {
    setIsSubmitting(true);
    
    // Calculate expiry date based on duration
    let expiresAt: string | null = null;
    const now = new Date();
    
    if (data.duration === "24h") {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (data.duration === "1w") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (data.duration === "1m") {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }
    
    try {
      await grantPermission({
        recipientEmail: data.recipientEmail,
        scope: data.scope,
        expiresAt: expiresAt,
      });

      // Reset form after successful submission
      form.reset({
        recipientEmail: "",
        scope: [],
        duration: "1w",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Grant Access to Your Profile</CardTitle>
        <CardDescription>
          Allow other Hushh users to chat with your Profile
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient's Hushh Email</FormLabel>
                  <FormControl>
                    <Input placeholder="colleague@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The recipient must have a Hushh account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scope"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Scope</FormLabel>
                    <FormDescription>
                      Select what information the recipient can access.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {scopeOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="scope"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.label)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.label])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.label
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How long the access should last.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting || state.isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Granting Access...
                </>
              ) : (
                "Grant Chat Access"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GrantAccessForm;
