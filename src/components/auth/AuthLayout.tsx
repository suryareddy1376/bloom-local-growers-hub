
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AuthLayoutProps {
  error: string | null;
  children: React.ReactNode;
}

const AuthLayout = ({ error, children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-leaf-700">Bloom</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect with local plant growers in your community
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Bloom</CardTitle>
            <CardDescription>
              Discover, buy, and sell biodegradable plants from people in your neighborhood.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
