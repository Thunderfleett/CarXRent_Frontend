import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>

        <Link to='/'>
            <motion.span whileHover={{scale: 1.05}} className="text-xl font-semibold text-gray-900">
                CarXRent
            </motion.span>
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-surface"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.map((link, index)=> {
                const isActive = location.pathname === link.path;
                return (
                    <Link 
                      key={index} 
                      to={link.path}
                      className={`relative font-medium transition-colors duration-200 hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                        {link.name}
                        {isActive && (
                          <motion.span 
                            layoutId="navUnderline" 
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                    </Link>
                );
            })}

            <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.search.value; if (val) navigate(`/cars?search=${val}`); }} className='hidden lg:flex items-center text-sm gap-2 border border-borderColor hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200 px-3.5 py-1 rounded-full max-w-56 bg-surface backdrop-blur-xs'>
                <input name="search" type="text" className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-700" placeholder="Search cars..."/>
                <button type="submit" className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                    <img src={assets.search_icon} alt="search" className="w-4 h-4" />
                </button>
            </form>

            <div className='flex max-sm:flex-col items-start sm:items-center gap-4 sm:gap-5'>

                <button 
                  onClick={()=> isOwner ? navigate('/owner') : changeRole()} 
                  className="cursor-pointer text-gray-600 hover:text-primary font-medium transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100/60">
                  {isOwner ? 'Dashboard' : 'List cars'}
                </button>

                <AnimatePresence mode="wait">
                  {user ? (
                    <motion.div 
                      key="auth-user"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 sm:gap-3">
                        <span className="hidden xl:inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                          Hi, {user.name?.split(' ')[0] || 'User'}
                        </span>
                        <button 
                          onClick={logout} 
                          className="cursor-pointer px-6 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 text-gray-700 font-medium transition-all text-sm rounded-lg active:scale-95">
                          Logout
                        </button>
                    </motion.div>
                  ) : (
                    <motion.button 
                      key="login-btn"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={()=> setShowLogin(true)} 
                      className="cursor-pointer px-7 py-2 bg-primary hover:bg-primary-dull shadow-sm hover:shadow-md transition-all text-white font-medium text-sm rounded-lg active:scale-95">
                      Login
                    </motion.button>
                  )}
                </AnimatePresence>
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
