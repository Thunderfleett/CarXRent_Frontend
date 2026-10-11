import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
        setHasError(false);
        setLoading(true);
        try {
            const {data} = await axios.post(`/api/user/${state}`, {name, email, password})

            if (data.success) {
                toast.success(state === "login" ? "Welcome back! Signed in successfully." : "Account created successfully! Welcome.");
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setTimeout(() => {
                    setShowLogin(false)
                }, 200)
            } else {
                setHasError(true);
                toast.error(data.message || "Authentication failed. Please check your credentials.");
            }

        } catch (error) {
            setHasError(true);
            toast.error(error.response?.data?.message || error.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={()=> !loading && setShowLogin(false)} 
      className='fixed inset-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50 backdrop-blur-xs p-4'>

      <motion.form 
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onSubmit={onSubmitHandler} 
        onClick={(e)=>e.stopPropagation()} 
        className={`flex flex-col gap-4 m-auto items-start p-8 py-10 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 bg-surface relative transition-shadow ${hasError ? 'animate-shake border-red-300' : ''}`}>
        
            {/* Close button */}
            <button 
              type="button" 
              onClick={() => !loading && setShowLogin(false)} 
              disabled={loading}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <img src={assets.close_icon} alt="close" className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
            </button>

            <div className="w-full text-center mb-1">
              <p className="text-2xl font-semibold text-gray-800">
                  <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {state === "login" ? "Enter your credentials to continue" : "Join us to explore and rent luxury cars"}
              </p>
            </div>

            {state === "register" && (
                <div className="w-full">
                    <label className="text-xs font-medium text-gray-700">Full Name</label>
                    <input 
                      onChange={(e) => setName(e.target.value)} 
                      value={name} 
                      disabled={loading}
                      placeholder="e.g. John Doe" 
                      className="border border-gray-200 rounded-lg w-full px-3 py-2.5 mt-1 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-gray-50 disabled:opacity-70" 
                      type="text" 
                      required 
                    />
                </div>
            )}

            <div className="w-full">
                <label className="text-xs font-medium text-gray-700">Email Address</label>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  disabled={loading}
                  placeholder="name@example.com" 
                  className="border border-gray-200 rounded-lg w-full px-3 py-2.5 mt-1 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-gray-50 disabled:opacity-70" 
                  type="email" 
                  required 
                />
            </div>

            <div className="w-full">
                <label className="text-xs font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    disabled={loading}
                    placeholder="••••••••" 
                    className="border border-gray-200 rounded-lg w-full px-3 py-2.5 pr-10 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-gray-50 disabled:opacity-70" 
                    type={showPassword ? "text" : "password"} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
                    <img 
                      src={showPassword ? assets.eye_icon : assets.eye_close_icon} 
                      alt="toggle password" 
                      className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity" 
                    />
                  </button>
                </div>
            </div>

            {state === "register" ? (
                <p className="text-xs text-gray-500">
                    Already have an account?{" "}
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => { setState("login"); setHasError(false); }} 
                      className="text-primary hover:underline font-medium cursor-pointer">
                      Sign in
                    </button>
                </p>
            ) : (
                <p className="text-xs text-gray-500">
                    Don't have an account?{" "}
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => { setState("register"); setHasError(false); }} 
                      className="text-primary hover:underline font-medium cursor-pointer">
                      Create one
                    </button>
                </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dull active:scale-[0.99] transition-all text-white w-full py-2.5 rounded-lg font-medium shadow-md shadow-primary/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>{state === "register" ? "Creating account..." : "Signing in..."}</span>
                  </span>
                ) : (
                  <span>{state === "register" ? "Create Account" : "Login"}</span>
                )}
            </button>
        </motion.form>
    </motion.div>
  )
}

export default Login
