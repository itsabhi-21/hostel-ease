import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <FileQuestion className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
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
