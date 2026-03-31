import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo1.png'
import { UnorderedListOutlined } from '@ant-design/icons';

import { SettingOutlined } from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import { message } from "antd";

const Sidebar: React.FC = () => {
    const [loggeduser, setloggeduser] = useState('')
    const [firstname, setfirstname] = useState('')
    const [email, setemail] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        setloggeduser(localStorage.getItem('empname') ?? '');
        setfirstname(localStorage.getItem('empname')?.split(' ').map(word => word[0])?.join('').toUpperCase() ?? '');

        setemail(localStorage.getItem('empemail') ?? '')
    }, []);

    const handleLogout = () => {
        confirm("Are you sure you want to logout?")

        localStorage.removeItem('emptoken');
        localStorage.removeItem('empname');
        localStorage.removeItem('empemail');
        localStorage.removeItem('salonId')
        navigate('/');
        message.success("Logged out successfully")
    };
    return (
        <aside className="fixed h-screen font-inter w-[20%] bg-gradient-to-b from-blue-700 to-blue-600 text-white flex flex-col justify-between px-5 py-6">


            <div>

                <div className="flex items-center  gap-3 mb-4">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" />

                    </div>
                    <div >
                        <h1 className="text-lg  m-0 leading-[0.8]  ">TrimTech</h1>
                        <span className="  text-sm text-white/70">Premium Booking</span>
                    </div>
                </div>
                <div>
                    <hr className="border-white/20 mb-6" />
                </div>


                <nav className="space-y-2">
                    <ul className="text-sm space-y-2 ">



                        <NavLink to='/employee/myshedule'> <li className="   flex gap-[7px] justify-start hover:bg-white/20  rounded-lg px-3 py-2 " >

                            <UnorderedListOutlined className="text-white " />
                            <p className="font-semibold m-0 "> My Schedule</p>
                        </li>
                        </NavLink>
                        <NavLink to='/employee/settingemp'>
                            <li className="flex gap-[7px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2 ">
                                <SettingOutlined />

                                <p className="font-semibold m-0 ">Settings</p>
                            </li>
                        </NavLink>

                    </ul>
                </nav>
            </div>


            <div className="space-y-6">

                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold">
                        {firstname}
                    </div>
                    <div>
                        <p className="font-medium m-0">{loggeduser}</p>
                        <p className="text-sm text-white/70 m-0">Emloyee</p>
                    </div>
                </div>


                <button onClick={handleLogout} className=" w-full flex gap-[17px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2">
                    <LogoutOutlined className="text-red-500" />
                    <p className=" font-semibold m-0">Logout</p>
                </button>

            </div>

        </aside >
    );
};

export default Sidebar;
