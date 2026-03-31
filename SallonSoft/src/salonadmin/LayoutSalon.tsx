import SideBarSalon from '../components/SideBarSalon'

import { Outlet } from 'react-router-dom'

const layout = () => {
    return (
        <div className='w-full flex  '>
            <div className='w-[20%] '>
                <SideBarSalon
                />
            </div>
            <div className='w-[80%]  '>
                <Outlet />
            </div>

        </div>
    )
}

export default layout
