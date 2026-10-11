import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting search params from url
  const [searchParams, setSearchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const searchQuery = searchParams.get('search')

  const {cars, axios} = useAppContext()

  const [input, setInput] = useState(searchQuery || '')
  const [isSearching, setIsSearching] = useState(false)

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async ()=>{
    if(input.trim() === ''){
      setFilteredCars(cars)
      return null
    }

    const q = input.toLowerCase()
    const filtered = cars.slice().filter((car)=>{
      return car.brand?.toLowerCase().includes(q)
      || car.model?.toLowerCase().includes(q)  
      || car.category?.toLowerCase().includes(q)  
      || car.transmission?.toLowerCase().includes(q)
      || car.location?.toLowerCase().includes(q)
    })
    setFilteredCars(filtered)
  }

  const searchCarAvailablity = async () =>{
    setIsSearching(true)
    try {
      const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
      if (data.success) {
        setFilteredCars(data.availableCars)
        if(data.availableCars.length === 0){
          toast('No cars available for selected dates and location')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(()=>{
    isSearchData && searchCarAvailablity()
  },[])

  useEffect(()=>{
    if (searchQuery && input === '') {
      setInput(searchQuery)
    }
  },[searchQuery])

  useEffect(()=>{
    cars.length > 0 && !isSearchData && applyFilter()
  },[input, cars])

  return (
    <div>

      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='flex items-center bg-surface px-4 mt-6 max-w-140 w-full h-12 rounded-full border border-borderColor shadow-md focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2 opacity-60'/>

          <input 
            onChange={(e)=> setInput(e.target.value)} 
            value={input} 
            type="text" 
            placeholder='Search by make, model, city, or category...' 
            className='w-full h-full outline-none text-gray-700 placeholder-gray-400 text-sm'
          />

          {input && (
            <button 
              type="button" 
              onClick={() => setInput('')} 
              className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer mr-1">
              ✕
            </button>
          )}

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-1 opacity-60'/>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <div className='flex items-center justify-between xl:px-20 max-w-7xl mx-auto'>
          <p className='text-gray-500 font-medium'>Showing {filteredCars.length} {filteredCars.length === 1 ? 'Car' : 'Cars'}</p>
          {input && (
            <button 
              onClick={() => setInput('')}
              className="text-primary text-sm font-medium hover:underline cursor-pointer">
              Reset search
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index)=> (
            <motion.div key={car._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(0.05 * index, 0.4), duration: 0.3 }}
            >
              <CarCard car={car}/>
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 mt-8 bg-surface border border-borderColor rounded-2xl max-w-md mx-auto text-center shadow-sm">
              <div className="w-14 h-14 bg-light rounded-full flex items-center justify-center mb-4">
                <img src={assets.search_icon} alt="" className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-gray-800 text-lg font-semibold mb-1">No matching cars found</p>
              <p className="text-gray-500 text-sm mb-5">We couldn't find any vehicles matching "{input}". Try searching for another brand or reset filters.</p>
              <button 
                onClick={() => setInput('')}
                className="px-6 py-2 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
                Clear Filters
              </button>
          </motion.div>
        )}
      </motion.div>

    </div>
  )
}

export default Cars
