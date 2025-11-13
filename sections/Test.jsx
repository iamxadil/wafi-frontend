import React from 'react'
import { useLaptopsDynamicFilters } from '../components/query/useLaptopsDynamicFilters';

const Test = () => {

  const { data, isLoading, isError } = useLaptopsDynamicFilters();
  console.log(data);
  return (
    <div>Test</div>
  )
}

export default Test