
import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GitBranch, Mail, Lock, EyeOff, Eye, Github, Twitter } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Safely get auth context values with null checks
  const auth = useAuth();
  
  // Safely destructure auth values with null checks and default values
  const login = auth?.login;
  const isLoading = auth?.isLoading || false;
  const user = auth?.user || null;
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/workflows';

  if (user && !isLoading) {
    return <Navigate to={redirectTo} replace />;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (typeof login === 'function') {
        await login(data.email, data.password);
        navigate(redirectTo);
      }
    } catch (error) {
      console.error("Login submission error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="size-16 flex items-center justify-center rounded-full bg-primary/10 mb-2">
            <GitBranch className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">OpenWorkflow</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-muted/30 bg-card/80 backdrop-blur shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            className="pl-10 bg-background/50 border-input/50 focus-visible:ring-primary/50" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 pr-10 bg-background/50 border-input/50 focus-visible:ring-primary/50" 
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button" 
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      onClick={toggleRememberMe} 
                      className={`size-4 rounded border cursor-pointer flex items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground/50'}`}
                    >
                      {rememberMe && <span className="text-xs text-primary-foreground">✓</span>}
                    </div>
                    <span className="text-sm cursor-pointer text-muted-foreground" onClick={toggleRememberMe}>Remember me</span>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="w-full bg-background/50" disabled>
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="w-full bg-background/50" disabled>
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col border-t border-muted/30 pt-5">
            <div className="rounded-md bg-primary/5 p-3 text-xs space-y-2 w-full">
              <p className="text-center font-medium text-foreground/80">Demo accounts:</p>
              <div className="grid grid-cols-2 gap-x-2 text-muted-foreground">
                <div className="flex flex-col space-y-1">
                  <span>🧑‍💼 Admin:</span>
                  <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">admin@example.com</code>
                  <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">password</code>
                </div>
                <div className="flex flex-col space-y-1">
                  <span>👤 User:</span>
                  <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">user@example.com</code>
                  <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">password</code>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
