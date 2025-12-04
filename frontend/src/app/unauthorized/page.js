import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-24 w-24 text-red-500 dark:text-red-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          403
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link href="/">
          <Button>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
