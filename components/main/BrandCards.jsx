import React from 'react'
import { motion } from 'framer-motion'
import "../../styles/brandcards.css";
import { 
   SiAsus as Asus,
   SiApple as Apple,
   SiAcer as Acer,
   SiMsibusiness as MSI,
   SiLenovo as Lenovo, 
   SiHp as HP,
   SiDell as Dell,
   SiLogitechg as Logitech   
} from "react-icons/si";

const BrandCards = () => {
  const cards = [
    { name: "Asus", icon: <Asus />},
    { name: "Apple", icon: <Apple />},
    { name: "Acer", icon: <Acer />},
    { name : "MSI", icon: <MSI />},
    { name : "Lenovo", icon: <Lenovo />},
    { name : "HP", icon: <HP />},
    { name : "Dell", icon: <Dell />},
    { name : "Logitech", icon: <Logitech />},
  ]

  // Animation variants
  const brandVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  }

  return (
    <main id='brand-cards-container'>
      <header>
        <h1>Our Brands</h1>
      </header>

      <div className="brand-cards">
        {cards.map((card, i) => (
          <motion.div className='card' key={card.name} variants={brandVariants} initial="hidden" whileInView="visible" exit="exit"
            viewport={{ once: false, amount: 0.3 }} 
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)" 
            }}
          >
            <h2>{card.icon} {card.name}</h2>
          </motion.div>
        ))}
        
      </div>
      
    </main>
  )
}

export default BrandCards
