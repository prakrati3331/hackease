import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Not Found | HackEase</title>
        <meta name="description" content="The page you're looking for couldn't be found." />
      </Helmet>
    
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md mx-4 shadow-lg border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4 gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
            </div>
            
            <div className="mt-4 space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Please check the URL or navigate back to the home page.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex gap-3 pt-2">
            <Button asChild variant="default" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
