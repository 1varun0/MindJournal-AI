"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmSignUp, autoSignIn } from 'aws-amplify/auth';

// A wrapper component to safely use useSearchParams
function VerifyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the email from the URL, which we passed from the signup page
  const email = searchParams.get('email') || '';

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  // This is the function you wrote, now integrated into the page
  const handleConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await confirmSignUp({ username: email, confirmationCode: verificationCode });
      // Automatically sign the user in after confirmation
    //   await autoSignIn(); 
      // Redirect to the main dashboard
      router.push('/login');
    } catch (err: any) {
      console.error('Error confirming account:', err);
      setError(err.message || 'An unexpected error occurred during confirmation.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Verify Your Account</h2>
        <p>A verification code has been sent to your email.</p>
        
        <form onSubmit={handleConfirmation} style={styles.form}>
          <input
            type="text"
            placeholder="Enter the code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Confirm Account
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// Main component that includes the required Suspense boundary
export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}

// Basic styles
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7fafc' },
    formContainer: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' as const },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '15px', marginTop: '20px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    button: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#057616ff', color: 'white', fontSize: '16px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
};