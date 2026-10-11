import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData, getCarImage } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const {id} = useParams()

  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, setShowLogin} = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const currency = import.meta.env.VITE_CURRENCY

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const p = new Date(pickupDate);
    const r = new Date(returnDate);
    const diffTime = r.getTime() - p.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * (car?.pricePerDay || 0);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to reserve this car');
      setShowLogin(true);
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }
    setIsBooking(true);
    try {
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate, 
        returnDate
      })

      if (data.success){
        toast.success(data.message || 'Vehicle reserved successfully!')
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Booking failed')
    } finally {
      setIsBooking(false);
    }
  }

  useEffect(()=>{
    setCar(cars.find(car => car._id === id))
  },[cars, id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all cars
       </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'} src={getCarImage(car.image)} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
              <motion.div className='space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.location},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                      <img src={icon} alt="" className='h-5 mb-2'/>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500'>{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Features</h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    {
                      ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item)=>(
                        <li key={item} className='flex items-center text-gray-500'>
                          <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>

              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

            <div className='flex flex-col gap-2'>
              <label htmlFor="pickup-date" className="text-xs font-medium text-gray-700">Pickup Date</label>
              <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2.5 rounded-lg text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="return-date" className="text-xs font-medium text-gray-700">Return Date</label>
              <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2.5 rounded-lg text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all' required id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]}/>
            </div>

            {totalDays > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-light p-4 rounded-xl text-sm space-y-2 border border-borderColor/60">
                <div className="flex justify-between text-gray-500">
                  <span>{currency}{car.pricePerDay} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                  <span className="font-medium text-gray-700">{currency}{totalPrice}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-borderColor/50">
                  <span>Estimated Total</span>
                  <span className="text-primary text-base">{currency}{totalPrice}</span>
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isBooking}
              className='w-full bg-primary hover:bg-primary-dull active:scale-[0.99] transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary/20 min-h-[48px]'>
              {isBooking ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Reserving vehicle...</span>
                </>
              ) : (
                <span>Book Now {totalDays > 0 ? `• ${currency}${totalPrice}` : ''}</span>
              )}
            </button>

            <p className='text-center text-xs text-gray-400'>Free cancellation • No upfront credit card required</p>

          </motion.form>
       </div>

    </div>
  ) : <Loader />
}

export default CarDetails
