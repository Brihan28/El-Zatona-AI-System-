import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/api/auth/forgot-password",
      { email }
    );

    setToken(res.data.resetToken);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full">Send Reset Token</Button>
        </form>

        {token && (
          <p className="text-sm text-green-500">
            Token: {token}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;