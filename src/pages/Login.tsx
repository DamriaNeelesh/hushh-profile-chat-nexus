
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hushh-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-hushh-700">hushh</h1>
          <p className="mt-2 text-muted-foreground">Your Personal Data Agent</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
