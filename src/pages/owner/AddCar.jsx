import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const inputCls = 'px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
const labelCls = 'text-sm font-medium text-gray-600'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setImagePreview(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-4 py-10 md:px-10 flex-1'
    >

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex items-center gap-4 w-full'
        >
          <label htmlFor="car-image" className='cursor-pointer group relative'>
            <div className={`h-20 w-28 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all duration-200 ${imagePreview ? 'border-primary/40' : 'border-borderColor hover:border-primary/50 hover:bg-gray-50'}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className='h-full w-full object-cover'/>
              ) : (
                <div className='flex flex-col items-center gap-1 text-gray-400 group-hover:text-primary transition-colors'>
                  <img src={assets.upload_icon} alt="" className='h-6 opacity-50 group-hover:opacity-80 transition-opacity'/>
                  <span className='text-xs'>Upload</span>
                </div>
              )}
            </div>
            <input type="file" id="car-image" accept="image/*" hidden onChange={handleImageChange}/>
          </label>
          <div>
            <p className='font-medium text-gray-700'>Car Photo</p>
            <p className='text-xs text-gray-400 mt-1'>Upload a clear picture of your vehicle</p>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null); }}
                className='text-xs text-red-400 hover:text-red-500 mt-1 transition-colors cursor-pointer'
              >
                Remove photo
              </button>
            )}
          </div>
        </motion.div>

        {/* Car Brand & Model */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
        >
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi..." required className={inputCls} value={car.brand} onChange={e=>setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Model</label>
            <input type="text" placeholder="e.g. X5, E-Class, M4..." required className={inputCls} value={car.model} onChange={e=>setCar({...car, model: e.target.value})}/>
          </div>
        </motion.div>

        {/* Car Year, Price, Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
        >
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Year</label>
            <input type="number" placeholder="2025" required className={inputCls} value={car.year} onChange={e=>setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Daily Price ({currency})</label>
            <input type="number" placeholder="100" required className={inputCls} value={car.pricePerDay} onChange={e=>setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Category</label>
            <select onChange={e=>setCar({...car, category: e.target.value})} value={car.category} className={inputCls}>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </motion.div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
        >
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Transmission</label>
            <select onChange={e=>setCar({...car, transmission: e.target.value})} value={car.transmission} className={inputCls}>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Fuel Type</label>
            <select onChange={e=>setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className={inputCls}>
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className={labelCls}>Seating Capacity</label>
            <input type="number" placeholder="4" required className={inputCls} value={car.seating_capacity} onChange={e=>setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </motion.div>

         {/* Car Location */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='flex flex-col w-full'
        >
          <label className={labelCls}>Location</label>
          <select onChange={e=>setCar({...car, location: e.target.value})} value={car.location} className={inputCls}>
            <option value="">Select a location</option>
            <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
            <option value="Secunderabad, Telangana">Secunderabad, Telangana</option>
            <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
            <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu</option>
            <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
            <option value="Pune, Maharashtra">Pune, Maharashtra</option>
            <option value="Vijayawada, Andhra Pradesh">Vijayawada, Andhra Pradesh</option>
            <option value="Visakhapatnam, Andhra Pradesh">Visakhapatnam, Andhra Pradesh</option>
            <option value="New Delhi, Delhi">New Delhi, Delhi</option>
            <option value="Kochi, Kerala">Kochi, Kerala</option>
          </select>
        </motion.div>

        {/* Car Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className='flex flex-col w-full'
        >
          <label className={labelCls}>Description</label>
          <textarea rows={5} placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." required className={`${inputCls} resize-none`} value={car.description} onChange={e=>setCar({...car, description: e.target.value})}></textarea>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isLoading}
          className='flex items-center justify-center gap-2 px-6 py-2.5 mt-2 bg-primary hover:bg-primary-dull text-white rounded-lg font-medium w-max cursor-pointer shadow-md shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]'
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Listing Car...</span>
            </>
          ) : (
            <>
              <img src={assets.tick_icon} alt="" />
              List Your Car
            </>
          )}
        </motion.button>

      </form>

    </motion.div>
  )
}

export default AddCar
