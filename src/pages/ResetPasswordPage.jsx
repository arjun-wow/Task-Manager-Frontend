import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../store/api';
import { Lock, Loader, CheckCircle, XCircle } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';      

export default function ResetPasswordPage() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true); 
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); 




  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setStatus('idle'); 

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setStatus('error');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setStatus('error');
        return;
    }
    if (!token) {
        setError('Invalid or missing reset token.');
        setIsValidToken(false); 
        setStatus('error');
        return;
    }

    setLoading(true);
    setStatus('loading');
    try {
      const response = await api.put(`/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message || 'Password reset successfully!');
      setStatus('success');
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired or is invalid.');
       if (err.response?.status === 400 && err.response?.data?.message.includes('invalid or has expired')) {
            setIsValidToken(false);
       }
       setStatus('error');
    } finally {
      setLoading(false); 
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <>
      {/* Reusing login */}
      <style>{`
        .login-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden; min-height: 100vh; }
        .dark .login-bg { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3730a3 100%); }
        .waves { position: absolute; bottom: 0; left: 0; width: 100%; height: 30vh; min-height: 200px; max-height: 300px; pointer-events: none; }
        .wave { position: absolute; bottom: 0; left: 0; width: 200%; height: 100%; background-repeat: repeat-x; background-position: 0 bottom; transform-origin: center bottom; filter: blur(1px); }
        .wave1 { background-size: 50% 100px; animation: wave 18s linear infinite; opacity: 0.5; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E"); }
        .wave2 { background-size: 50% 120px; animation: wave 16s linear -1s infinite; opacity: 0.35; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E"); }
        .wave3 { background-size: 50% 100px; animation: wave 20s linear -2s infinite; opacity: 0.2; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E"); }
        .dark .wave1 { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.15' fill='%23c7d2fe'/%3E%3C/svg%3E"); }
        .dark .wave2 { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.1' fill='%23c7d2fe'/%3E%3C/svg%3E"); }
        .dark .wave3 { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.05' fill='%23c7d2fe'/%3E%3C/svg%3E"); }
        @keyframes wave { 0% { transform: translateX(0) translateZ(0) scaleY(1); } 50% { transform: translateX(-25%) translateZ(0) scaleY(0.95); } 100% { transform: translateX(-50%) translateZ(0) scaleY(1); } }
        .glass-form { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); }
        .dark .glass-form { background: rgba(15, 23, 42, 0.3); border: 1px solid rgba(99, 102, 241, 0.2); }
      `}</style>
       <div className="flex flex-col min-h-screen login-bg dark:bg-gray-950 px-6 py-8 sm:px-12 relative">
            {/* Simple Header */}
             <header className="flex justify-between items-center w-full relative z-10">
                <h1 className="text-2xl font-bold text-black dark:text-white">WeManage</h1>
                <Link to="/login" className="text-sm font-medium text-black dark:text-white hover:underline">Back to Login</Link>
            </header>

            {/* Form Container */}
            <main className="flex-grow flex items-center justify-center relative z-10">
                <div className="w-full max-w-md glass-form rounded-2xl p-8 backdrop-blur-xl">
                   <AnimatePresence mode="wait">
                       {status === 'success' ? (
                            // Success State
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }} className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <CheckCircle className="text-white" size={40} />
                                </motion.div>
                                <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-semibold text-white mb-2">Password Reset!</motion.h3>
                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white/80 mb-6">{message}</motion.p>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                    <Link to="/login" className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 border border-white/30 backdrop-blur-sm">
                                        Proceed to Login
                                    </Link>
                                </motion.div>
                           </motion.div>
                       ) : status === 'error' ? (
                            // Error State
                           <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }} className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <XCircle className="text-white" size={40} />
                                </motion.div>
                                <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-semibold text-white mb-2">Reset Failed</motion.h3>
                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white/80 mb-6">{error}</motion.p>
                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} onClick={handleRetry} className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 border border-white/30 backdrop-blur-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    Try Again
                                </motion.button>
                                {!isValidToken && ( // Show login link if token invalid
                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4">
                                        <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white hover:underline">
                                            Back to Login
                                        </Link>
                                    </motion.div>
                                )}
                           </motion.div>
                       ) : (
                           // Idle / Loading State (Show Form)
                           <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h2 className="text-2xl font-semibold text-center mb-6 text-black dark:text-white">Reset Your Password</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/30 focus:border-transparent dark:focus:border-white/30 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-all duration-300"
                                        required
                                    />
                                    </div>
                                    <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/30 focus:border-transparent dark:focus:border-white/30 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-all duration-300"
                                        required
                                    />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.05 }}
                                        whileTap={{ scale: loading ? 1 : 0.95 }}
                                        className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader size={20} className="animate-spin" /> Resetting...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </motion.button>
                                </form>
                           </motion.div>
                       )}
                   </AnimatePresence>
                </div>
            </main>

            {/* Ultra Smooth Waves */}
            <div className="waves">
                <div className="wave wave1"></div>
                <div className="wave wave2"></div>
                <div className="wave wave3"></div>
            </div>
       </div>
    </>
  );
}

