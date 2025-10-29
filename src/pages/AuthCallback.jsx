import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTokenAndUserFromUrl } = useAuthStore(); 
  const [status, setStatus] = useState('Processing login...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processToken = async () => {
      
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const authError = params.get('error'); 

      if (authError) {
          setError(`Authentication failed: ${authError.replace(/-/g, ' ')}`);
          setStatus('Login Failed');
          
          return;
      }

      if (token) {
        try {
          setStatus('Verifying account...');
          await setTokenAndUserFromUrl(token);
          setStatus('Login successful! Redirecting...');
          navigate('/', { replace: true });
        } catch (err) {
          console.error("Error processing token or fetching user:", err);
          setError('Failed to verify account. Please try logging in again.');
          setStatus('Login Failed');
      
        }
      } else {
        setError('Authentication token missing. Please try logging in again.');
        setStatus('Login Failed');
        
      }
    };

    processToken();
   
  }, [location.search, navigate, setTokenAndUserFromUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen login-bg dark:bg-gray-950 px-6 py-8 sm:px-12 relative">
       <style>{`
        /* Minimal styles to match login background */
        .login-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden; }
        .dark .login-bg { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3730a3 100%); }
        /* Add waves/particles if desired */
      `}</style>

      <div className="p-8 bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg text-center border border-white/20 dark:border-gray-700/50">
        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-gray-100">
          {status}
        </h1>
        {error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-400 mb-4">Please wait while we securely log you in...</p>
            <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500/30 border-l-blue-500/30 rounded-full animate-spin"></div>
          </>
        )}
      </div>
    </div>
  );
}

