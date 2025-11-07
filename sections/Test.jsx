import React from 'react'
import { useDynamicFilters } from '../components/hooks/useDynamicFilters'



const Test = () => {

  const {data: test, isLoading} = useDynamicFilters({category: ["Laptops"]});

  console.log(test);

  return (
    <div>Test</div>
  )
}

export default Test