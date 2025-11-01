import React from 'react'
import AdminHeader from '../AdminHeader'
import { Card } from '@mantine/core'

const Analytics = () => {
  return (
   <>
   <main className='adm-ct'>
    <AdminHeader 
    title='Analytics'
    breadcrumb={["Dashboard", "Analytics"]}
    />
   </main>
   </>
  )
}

export default Analytics