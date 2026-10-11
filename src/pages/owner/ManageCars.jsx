import React, { useEffect, useState } from 'react'
import { assets, getCarImage} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const ManageCars = () => {

  const {isOwner, axios, currency} = useAppContext()

  const [cars, setCars] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId)=>{
    setTogglingId(carId)
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTogglingId(null)
    }
  }

  const deleteCar = async (carId)=>{
    const confirm = window.confirm('Are you sure you want to delete this car?')
    if(!confirm) return null
    setDeletingId(carId)
    try {
      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(()=>{
    isOwner && fetchOwnerCars()
  },[isOwner])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-4 pt-10 md:px-10 w-full'
    >
      
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white'
      >

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500 bg-gray-50/80'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {cars.map((car, index)=>(
                <motion.tr
                  key={car._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  className='border-t border-borderColor hover:bg-gray-50/60 transition-colors'
                >

                  <td className='p-3 flex items-center gap-3'>
                    <div className='relative overflow-hidden rounded-md'>
                      <img
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                        src={getCarImage(car.image)}
                        alt=""
                        className="h-12 w-12 aspect-square rounded-md object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className='max-md:hidden'>
                      <p className='font-medium'>{car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                    </div>
                  </td>

                  <td className='p-3 max-md:hidden'>{car.category}</td>
                  <td className='p-3 font-medium text-gray-700'>{currency}{car.pricePerDay}<span className='text-gray-400 font-normal'>/day</span></td>

                  <td className='p-3 max-md:hidden'>
                    <motion.span
                      layout
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${car.isAvaliable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                    >
                      {car.isAvaliable ? "Available" : "Unavailable" }
                    </motion.span>
                  </td>

                  <td className='flex items-center p-3 gap-2'>
                    <button
                      onClick={()=> toggleAvailability(car._id)}
                      disabled={togglingId === car._id}
                      title={car.isAvaliable ? 'Mark Unavailable' : 'Mark Available'}
                      className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 active:scale-95'
                    >
                      <img
                        src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon}
                        alt=""
                        className={`w-5 h-5 transition-transform ${togglingId === car._id ? 'animate-spin opacity-50' : ''}`}
                      />
                    </button>

                    <button
                      onClick={()=> deleteCar(car._id)}
                      disabled={deletingId === car._id}
                      title="Delete car"
                      className='p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 active:scale-95'
                    >
                      <img
                        src={assets.delete_icon}
                        alt=""
                        className={`w-5 h-5 ${deletingId === car._id ? 'animate-pulse opacity-50' : ''}`}
                      />
                    </button>
                  </td>

                </motion.tr>
              ))}
            </AnimatePresence>
            {cars.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <div className='flex flex-col items-center gap-2 text-gray-400'>
                    <img src={assets.carIconColored} alt="" className='w-10 h-10 opacity-30 mb-2'/>
                    <p className='font-medium text-gray-500'>No cars listed yet</p>
                    <p className='text-sm'>Add your first car to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </motion.div>

    </motion.div>
  )
}

export default ManageCars
