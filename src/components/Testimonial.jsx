import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

    const testimonials = [
        { name: "Priya Sharma", 
          location: "Bengaluru, Karnataka", 
          testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional. Perfect service for my Bangalore trip!" 
        },
        { name: "Rahul Mehta", 
          location: "Hyderabad, Telangana", 
          testimonial: "CarRental made my trip to Hyderabad so much easier. The car was delivered right to my door, and the customer service was fantastic!" 
        },
        { name: "Ananya Reddy", 
          location: "Chennai, Tamil Nadu", 
          testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service across India." 
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            
           <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."/>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                    
                    key={index} className="bg-surface border border-borderColor p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center p-2.5 shrink-0">
                                <img className="w-6 h-6 object-contain" src={assets.user_profile} alt={testimonial.name} />
                            </div>
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star-icon" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
