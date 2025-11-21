import React from 'react'
import { useBlackFridayQuery } from '../components/hooks/useBlackFridayQuery';

const Test = () => {

  const {data, isLoading} = useBlackFridayQuery();

  console.log(data);
  return (
    <div>Test</div>
  )
}

export default Test