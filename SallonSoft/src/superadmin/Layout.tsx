import React from 'react'
import Sidebar from '../components/SideBar'

import { Outlet } from 'react-router-dom'

const layout = () => {
    return (
        <div className='w-full flex  '>
            <div className='md:w-[20%] '>
                <Sidebar />
            </div>
            <div className=' w-full md:w-[80%]  '>
                <Outlet />
            </div>

        </div>
    )
}

export default layout
