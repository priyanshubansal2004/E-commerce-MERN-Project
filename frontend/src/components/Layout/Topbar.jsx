import React from 'react'
import { FaGithub} from 'react-icons/fa';
import{IoLogoInstagram} from "react-icons/io";
import { FaLinkedin } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className='bg-[#000000] text-white'>
      <div className='container mx-auto flex justify-between items-center py-3 px-4'>
        <div className='hidden md:flex items-center space-x-4'>
            <a href="https://github.com/priyanshubansal2004" className='hover:text-gray-300'>
                <FaGithub className='h-4 w-5'/>
            </a>
            <a href="https://www.linkedin.com/in/priyanshubansal2004" className='hover:text-gray-300'>
                <FaLinkedin className='h-4 w-5'/>
            </a>
            
            <a href="https://www.instagram.com/priyanshux__" className='hover:text-gray-300'>
                <IoLogoInstagram className='h-5 w-5'/>
            </a>
        </div>
        <div className="text-center flex-grow text-sm text-white-600 italic">
          <span>Driven by passion, building impactful real-world projects.</span>
      </div>

        <div className='text-sm hidden md:block'>
            <a href="tel:+919120408351" className='hover:text-gray-300'>
                +91 912040xxxx
            </a>
        </div>
      </div>
    </div>
  )
}

export default Topbar
