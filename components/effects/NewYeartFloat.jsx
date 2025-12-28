import React from 'react'
import "../../styles/float.css";
import LiquidGlass from '../ui/LiquidGlass.jsx';

const NewYeartFloat = () => {
  return (
    <>
    <main id='float-container'>
      <LiquidGlass
        expandable={true}
        draggable={false}
        blurIntensity='sm'
        glowIntensity='sm'
       >
        <div className='float-button'>
          Button
        </div>
      </LiquidGlass>
    </main>
    </>
  )
}

export default NewYeartFloat