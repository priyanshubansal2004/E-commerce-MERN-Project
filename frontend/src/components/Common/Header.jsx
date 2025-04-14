import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-200'>
        {<Topbar/>}
        {<Navbar/>}
        {/*Cart Drawer*/}
    </header>
  )
}

export default Header
