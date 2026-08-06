import React from 'react'
import SideBarEmp from '../components/SideBarEmp'
import { Outlet } from 'react-router-dom'

const LayoutEmp = () => {
    return (
        <div>
            <div className='w-full flex  '>
                <div className='w-[20%] '>
                    <SideBarEmp

                    />
                </div>
                <div className='w-[80%]  '>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default LayoutEmp
