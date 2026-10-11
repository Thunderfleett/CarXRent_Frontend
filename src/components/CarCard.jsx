import React from 'react'
import { assets, getCarImage } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const CarCard = ({car, ornamental = false}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={()=>{navigate(`/car-details/${car._id}`); scrollTo(0,0)}}
      className='group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 cursor-pointer bg-surface border border-gray-100/80'
    >
      
      <div className={`relative h-48 overflow-hidden ${ornamental ? 'ornamental-frame ornamental-frame--featured' : ''}`}>
        <img
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
          src={getCarImage(car.image)}
          alt="Car Image"
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-108'
        />

        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'/>

        {car.isAvaliable && (
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className='absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full shadow-sm'
          >
            Available Now
          </motion.p>
        )}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
            <span className='font-semibold'>{currency}{car.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
        </div>

        {/* View Details overlay on hover */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <span className='bg-surface-elevated backdrop-blur-sm text-primary font-semibold text-sm px-5 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
            View Details →
          </span>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-medium text-gray-800 group-hover:text-primary transition-colors duration-200'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm text-gray-500'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2.5 text-gray-600'>
            <div className='flex items-center text-sm text-gray-500'>
                <img src={assets.users_icon} alt="" className='h-4 mr-2 opacity-60'/>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-gray-500'>
                <img src={assets.fuel_icon} alt="" className='h-4 mr-2 opacity-60'/>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-sm text-gray-500'>
                <img src={assets.car_icon} alt="" className='h-4 mr-2 opacity-60'/>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-gray-500'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2 opacity-60'/>
                <span className='truncate'>{car.location?.split(',')[0]}</span>
            </div>
        </div>

      </div>

    </motion.div>
  )
}

export default CarCard
