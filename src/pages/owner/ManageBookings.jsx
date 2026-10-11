import React, { useEffect, useState } from 'react'
import { getCarImage } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [changingId, setChangingId] = useState(null)

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    setChangingId(bookingId)
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChangingId(null)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-4 pt-10 md:px-10 w-full'
    >
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-surface'
      >

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500 bg-gray-50/80'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {bookings.map((booking, index)=>(
                <motion.tr
                  key={booking._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  className='border-t border-borderColor text-gray-500 hover:bg-gray-50/60 transition-colors'
                >

                  <td className='p-3 flex items-center gap-3'>
                    <div className='overflow-hidden rounded-md'>
                      <img
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                        src={getCarImage(booking.car.image)}
                        alt=""
                        className='h-12 w-12 aspect-square rounded-md object-cover transition-transform duration-300 hover:scale-110'
                      />
                    </div>
                    <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                  </td>

                  <td className='p-3 max-md:hidden text-xs'>
                    <div className='flex flex-col gap-0.5'>
                      <span>{new Date(booking.pickupDate).toLocaleDateString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric'})}</span>
                      <span className='text-gray-400'>to</span>
                      <span>{new Date(booking.returnDate).toLocaleDateString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric'})}</span>
                    </div>
                  </td>

                  <td className='p-3 font-medium text-gray-700'>{currency}{booking.price}</td>

                  <td className='p-3 max-md:hidden'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                  </td>

                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select
                        onChange={e=> changeBookingStatus(booking._id, e.target.value)}
                        value={booking.status}
                        disabled={changingId === booking._id}
                        className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-60 cursor-pointer'
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ): (
                      <motion.span
                        layout
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                      >{booking.status}</motion.span>
                    )}
                  </td>

                </motion.tr>
              ))}
            </AnimatePresence>
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400 text-sm">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </motion.div>

    </motion.div>
  )
}

export default ManageBookings
