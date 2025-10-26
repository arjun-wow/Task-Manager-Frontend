import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { User, Lock, ArrowRight, CheckCircle, Loader, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icons for Social Buttons ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M48 24C48 22.0426 47.8359 20.129 47.5195 18.2812H24.4883V29.0703H37.8164C37.3633 32.0664 36.0273 34.6406 34.0898 36.3164V42.8438H42.0664C45.8125 39.4297 48 34.418 48 24Z" fill="#4285F4"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M24.4883 48C30.957 48 36.4688 45.875 40.2383 42.8438L34.0898 36.3164C32.0664 37.6758 29.0703 38.6484 24.4883 38.6484C18.6016 38.6484 13.5391 34.8789 11.9023 29.5703H3.63281V36.1211C7.40234 43.1992 15.3555 48 24.4883 48Z" fill="#34A853"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9023 29.5703C11.5117 28.2344 11.293 26.8516 11.293 25.4688C11.293 24.0859 11.5117 22.7031 11.9023 21.3672V14.8164H3.63281C1.3125 19.4062 0 24.6406 0 30.4688C0 36.2969 1.3125 41.5312 3.63281 46.1211L11.9023 29.5703Z" fill="#FBBC05"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M24.4883 9.28906C27.9023 9.28906 31.2422 10.457 33.7383 12.8086L40.4141 6.13281C36.4688 2.64062 30.957 0 24.4883 0C15.3555 0 7.40234 4.80078 3.63281 11.8789L11.9023 18.4297C13.5391 13.1211 18.6016 9.28906 24.4883 9.28906Z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

// Success Animation Component
const SuccessAnimation = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.2 }}
    className="text-center py-8"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }}
      className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
    >
      <CheckCircle className="text-white" size={40} />
    </motion.div>
    
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-2xl font-semibold text-white mb-2"
    >
      Welcome back!
    </motion.h3>
    
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-white/80"
    >
      Redirecting to your dashboard...
    </motion.p>

    {/* Loading dots */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex justify-center gap-1 mt-6"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </motion.div>
  </motion.div>
);

// Error Animation Component
const ErrorAnimation = ({ error, onRetry }) => (
  <motion.div
    key="error"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.2 }}
    className="text-center py-8"
  >
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 15 
      }}
      className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
    >
      <XCircle className="text-white" size={40} />
    </motion.div>
    
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-2xl font-semibold text-white mb-2"
    >
      Login Failed
    </motion.h3>
    
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-white/80 mb-6"
    >
      {error || 'Invalid email or password. Please try again.'}
    </motion.p>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      onClick={onRetry}
      className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 border border-white/30 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Try Again
    </motion.button>
  </motion.div>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null); // 'success', 'error'
  
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setLoginStatus(null);

    try {
      if (isLogin) {
        if (!email || !password) {
          setError('Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          setError('Please fill out all fields.');
          setIsLoading(false);
          return;
        }
        await register(name, email, password);
      }
      
      // Success animation
      setLoginStatus('success');
      
      // Redirect after animation
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoginStatus('error');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setLoginStatus(null);
    setError(null);
  };

  return (
    <>
      <style>
        {`
          .login-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }
          
          .dark .login-bg {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #3730a3 100%);
          }

          /* Ultra Smooth Wave Animation */
          .waves {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 30vh;
            min-height: 200px;
            max-height: 300px;
          }

          .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background-repeat: repeat-x;
            background-position: 0 bottom;
            transform-origin: center bottom;
            filter: blur(1px);
          }

          .wave1 {
            background-size: 50% 100px;
            animation: wave 18s linear infinite;
            opacity: 0.5;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E");
          }

          .wave2 {
            background-size: 50% 120px;
            animation: wave 16s linear -1s infinite;
            opacity: 0.35;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E");
          }

          .wave3 {
            background-size: 50% 100px;
            animation: wave 20s linear -2s infinite;
            opacity: 0.2;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23ffffff'/%3E%3C/svg%3E");
          }

          .dark .wave1 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.15' fill='%23c7d2fe'/%3E%3C/svg%3E");
          }

          .dark .wave2 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.1' fill='%23c7d2fe'/%3E%3C/svg%3E");
          }

          .dark .wave3 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.05' fill='%23c7d2fe'/%3E%3C/svg%3E");
          }

          @keyframes wave {
            0% {
              transform: translateX(0) translateZ(0) scaleY(1);
            }
            50% {
              transform: translateX(-25%) translateZ(0) scaleY(0.95);
            }
            100% {
              transform: translateX(-50%) translateZ(0) scaleY(1);
            }
          }

          /* Floating particles */
          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }

          .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 15s infinite linear;
          }

          .dark .particle {
            background: rgba(199, 210, 254, 0.1);
          }

          @keyframes float {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }

          /* Glass morphism form */
          .glass-form {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }

          .dark .glass-form {
            background: rgba(15, 23, 42, 0.3);
            border: 1px solid rgba(99, 102, 241, 0.2);
          }
        `}
      </style>
      
      <div className="flex flex-col min-h-screen login-bg dark:bg-gray-950 px-6 py-8 sm:px-12 relative">
        
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header className="flex justify-between items-center w-full relative z-10">
          <h1 className="text-2xl font-bold text-white">
            WeManage
          </h1>
          <AnimatePresence mode="wait">
            {!loginStatus && (
              <motion.p
                key="switch-text"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm text-white/80"
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="font-semibold text-white ml-2 hover:underline inline-flex items-center transition-all duration-300"
                >
                  {isLogin ? "Sign up" : "Log In"}
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </motion.p>
            )}
          </AnimatePresence>
        </header>

        {/* Form Container */}
        <main className="flex-grow flex items-center justify-center relative z-10">
          <div className="w-full max-w-md glass-form rounded-2xl p-8 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {loginStatus === 'success' ? (
                <SuccessAnimation />
              ) : loginStatus === 'error' ? (
                <ErrorAnimation error={error} onRetry={handleRetry} />
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                    {isLogin ? "Log in to your account" : "Create your account"}
                  </h2>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-300 text-sm text-center my-4 bg-red-500/10 py-2 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Social Logins */}
                  {isLogin && (
                    <div className="space-y-3 my-6">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        <GoogleIcon />
                        LOG IN WITH GOOGLE
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        <GitHubIcon />
                        LOG IN WITH GITHUB
                      </button>
                    </div>
                  )}

                  {/* "or" separator */}
                  {isLogin && (
                    <div className="flex items-center my-6">
                      <hr className="flex-grow border-white/20" />
                      <span className="mx-4 text-sm text-white/60">or</span>
                      <hr className="flex-grow border-white/20" />
                    </div>
                  )}
                  
                  {/* Main Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="relative overflow-hidden"
                      >
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder-white/60 transition-all duration-300"
                        />
                      </motion.div>
                    )}
                    
                    {/* Email Field */}
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        type="email"
                        placeholder="account@refero.design"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder-white/60 transition-all duration-300"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder-white/60 transition-all duration-300"
                      />
                    </div>

                    {/* Forgot Password */}
                    {isLogin && (
                      <div className="text-right">
                        <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-300">
                          Don't remember your password?
                        </a>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          {isLogin ? "Logging In..." : "Creating Account..."}
                        </>
                      ) : (
                        isLogin ? "Log In" : "Sign Up"
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