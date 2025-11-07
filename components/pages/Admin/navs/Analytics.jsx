import React from 'react'
import AdminHeader from '../AdminHeader'
import { Card } from '@mantine/core'
import { ChartNoAxesColumnIncreasing } from 'lucide-react';

const Analytics = () => {
  return (
   <>
   <main className='adm-ct'>
    <AdminHeader 
    title='Analytics'
    breadcrumb={["Dashboard", "Analytics"]}
    Icon={ChartNoAxesColumnIncreasing}
    />
   </main>
   </>
  )
}

export default Analytics