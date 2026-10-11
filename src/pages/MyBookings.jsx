import React, { useEffect, useState } from 'react'
import { assets, getCarImage } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency, navigate } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async ()=>{
    setLoading(true)
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if (user) {
      fetchMyBookings()
    } else {
      setLoading(false)
    }
  },[user])

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl min-h-[60vh]'>

      <Title title='My Bookings'
       subTitle='View and manage your car reservations and travel schedules'
       align="left"/>

       <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse p-6 border border-borderColor rounded-xl bg-surface flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56 h-36 bg-gray-200 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          bookings.map((booking, index)=>(
            <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            
            key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor/80 rounded-xl mt-5 first:mt-2 bg-surface shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300'>
              {/* Car Image + Info */}

              <div className='md:col-span-1'>
                <div className='rounded-lg overflow-hidden mb-3 bg-gray-50'>
                  <img onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'} src={getCarImage(booking.car?.image)} alt="" className='w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-500'/>
                </div>
                <p className='text-lg font-semibold text-gray-800 mt-2'>{booking.car?.brand} {booking.car?.model}</p>

                <p className='text-gray-500 text-xs'>{booking.car?.year} • {booking.car?.category} • {booking.car?.location}</p>
              </div>

              {/* Booking Info */}
              <div className='md:col-span-2 flex flex-col justify-between py-1'>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='px-3 py-1 bg-light text-gray-700 font-medium rounded-md text-xs'>Reservation #{index+1}</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'}`}>{booking.status}</span>
                  </div>

                  <div className='flex items-start gap-2.5 mt-3'>
                    <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-0.5'/>
                    <div>
                      <p className='text-gray-400 text-xs'>Rental Duration</p>
                      <p className="font-medium text-gray-700">{new Date(booking.pickupDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})} — {new Date(booking.returnDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-2.5 mt-3'>
                    <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-0.5'/>
                    <div>
                      <p className='text-gray-400 text-xs'>Pick-up & Drop Location</p>
                      <p className="font-medium text-gray-700">{booking.car?.location || 'Hyderabad'}</p>
                    </div>
                  </div>
                </div>
              </div>

             {/* Price */}
             <div className='md:col-span-1 flex flex-col justify-between items-start md:items-end gap-4 py-1'>
                <div className='text-sm text-left md:text-right'>
                  <p className="text-gray-400 text-xs">Total Amount</p>
                  <h1 className='text-2xl font-bold text-primary mt-0.5'>{currency}{booking.price}</h1>
                  <p className="text-xs text-gray-400 mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
                </div>
                <div className="w-full md:w-auto">
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1.5 w-fit md:ml-auto">
                    ✓ Reserved Confirmed
                  </span>
                </div>
             </div>

            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-surface border border-borderColor rounded-2xl max-w-md mx-auto text-center shadow-xs mt-6">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mb-4">
                <img src={assets.calendar_icon_colored} alt="" className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">No bookings yet</h3>
              <p className="text-gray-500 text-sm mb-6">You haven't reserved any luxury vehicles yet. Explore our fleet and plan your journey.</p>
              <button 
                onClick={() => navigate('/cars')}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer active:scale-95">
                Explore Available Cars
              </button>
          </motion.div>
        )}
       </div>
      
    </motion.div>
  )
}

export default MyBookings
