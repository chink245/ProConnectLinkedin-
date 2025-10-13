import { NavBarComponenet } from '@/Components/Navbar'
import React from 'react'

const UserLayout = ({children}) => {
  return (
    <div>
        <NavBarComponenet/>
       {children}
    
    </div>
  )
}

export default  UserLayout
