import React from 'react'
import "../../styles/newyear.css";
import LiquidGlass from "../ui/LiquidGlass.jsx";
import useTranslate from '../hooks/useTranslate.jsx';

const NewYearDemo = () => {
  const t = useTranslate();

  return (
    <>
    <main id='ny-container'>
       <LiquidGlass
          draggable={false}
          expandable={true}
          glowIntensity="sm"
          blurIntensity="sm"
          shadowIntensity="sm"
          className='ny-glass'
        >
         <button className='ny-reveal'>{t("New Year's Surprise", "مفاجأة السنة الجديدة")} 🎉</button>
        </LiquidGlass >
    </main>
    </>
  )
}

export default NewYearDemo