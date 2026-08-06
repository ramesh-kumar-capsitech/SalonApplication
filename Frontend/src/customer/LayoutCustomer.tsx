import { Outlet } from "react-router-dom"
import SideBarcustomer from "../components/SideBarcustomer"


const LayoutCustomer = () => {
    return (
        <div>
            <div className='w-full flex  '>
                <div className='w-[20%] '>
                    <SideBarcustomer

                    />
                </div>
                <div className='w-[80%]  '>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default LayoutCustomer
