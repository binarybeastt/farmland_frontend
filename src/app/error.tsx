'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);

    // Check if error is related to authentication
    if (error.message.includes('auth') || 
        error.message.includes('token') || 
        error.message.includes('login') ||
        error.message.includes('unauthorized') ||
        error.message.includes('permission')) {
      // Redirect to login after 3 seconds for auth-related errors
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message || 'An unexpected error occurred'}</p>
      <div className="error-actions">
        <button onClick={() => reset()}>Try again</button>
        <button onClick={() => router.push('/')}>Go to Login</button>
      </div>
      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          text-align: center;
          background-color: #f8f9fa;
        }
        
        h2 {
          margin-bottom: 16px;
          color: #d32f2f;
        }
        
        p {
          margin-bottom: 24px;
          max-width: 500px;
        }
        
        .error-actions {
          display: flex;
          gap: 16px;
        }
        
        button {
          padding: 8px 16px;
          background-color: #112521;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: "Sora", Helvetica;
        }
        
        button:hover {
          background-color: #2E6650;
        }
      `}</style>
    </div>
  );
} 