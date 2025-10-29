import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../store/api'; 
import { X, Mail, Loader, CheckCircle } from 'lucide-react'; 

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setStatus('loading'); 
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent (if account exists).');
      setStatus('success'); 
      setEmail(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      setStatus('error'); 
    }
  };

  
  const handleClose = () => {
      setEmail('');
      setMessage('');
      setError('');
      setStatus('idle'); 
      onClose(); 
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose} 
        >
          <motion.div
            onClick={(e) => e.stopPropagation()} 
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 dark:border-gray-700/50 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 rounded-md text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                aria-label="Close modal"
            >
              <X size={18} />
            </button>

             {/* Animated State Display */}
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                     <motion.div key="success-fp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }} className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                         </motion.div>
                         <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Check Your Email</h3>
                         <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                          <button
                             onClick={handleClose}
                             className="mt-6 px-4 py-2 text-sm rounded-lg border border-black/10 dark:border-white/20 font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                           >
                             Close
                           </button>
                     </motion.div>
                ) : status === 'error' ? (
                     <motion.div key="error-fp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }} className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                               <XCircle className="text-red-600 dark:text-red-400" size={32} />
                          </motion.div>
                          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Error</h3>
                          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                           <button
                             onClick={() => setStatus('idle')} 
                             className="mt-6 px-4 py-2 text-sm rounded-lg border border-black/10 dark:border-white/20 font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                           >
                             Try Again
                           </button>
                     </motion.div>
                ) : (
                     
                     <motion.div key="form-fp" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Forgot Password</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Enter your email address below, and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60" size={18} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/30 focus:border-transparent dark:focus:border-white/30 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/60 transition-all duration-300"
                                required
                                disabled={status === 'loading'}
                            />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={status === 'loading'}
                                whileHover={{ scale: status !== 'loading' ? 1.05 : 1 }}
                                whileTap={{ scale: status !== 'loading' ? 0.95 : 1 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader size={20} className="animate-spin" /> Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </motion.button>
                        </form>
                         <div className="text-center mt-4">
                            <button onClick={handleClose} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Cancel
                            </button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

