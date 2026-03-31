import React from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo1.png'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { ShopOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import { message } from 'antd';


const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        confirm("Are you sure you want to logout?")

        localStorage.clear()

        navigate('/');
        message.success("Logged out successfully")
    };
    return (
        <aside className=" hidden  fixed h-screen font-inter w-[20%] bg-gradient-to-b from-blue-700 to-blue-600 text-white md:flex flex-col justify-between px-5 py-6">


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
                        <NavLink to='/superadmin/dashboard'> <li className="   flex gap-[7px] justify-start hover:bg-white/20  rounded-lg px-3 py-2 " >
                            <HomeOutlined className="text-white " />

                            {/* <Camera color="red" size={4} /> */}

                            <p className="font-semibold m-0 "> DashBoard</p>
                        </li>
                        </NavLink>
                        <NavLink to='/superadmin/salon'>
                            <li className="flex gap-[7px] justify-start  hover:bg-white/20 rounded-lg px-3 py-2 ">
                                <ShopOutlined />

                                <p className="font-semibold m-0 ">Salon</p>
                            </li>
                        </NavLink>
                        <NavLink to='/superadmin/users'> <li className="flex gap-[7px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2">
                            <TeamOutlined />

                            <p className="font-semibold m-0 ">Users</p>
                        </li>
                        </NavLink>
                        <NavLink to='/superadmin/request'>  <li className="flex gap-[7px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2 ">
                            <FileTextOutlined />

                            <p className="font-semibold m-0  ">Requests</p>
                        </li>
                        </NavLink>
                        <NavLink to='/superadmin/setting'>
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
                        {/* <img src={logo} alt="Logo" /> */}TT
                    </div>
                    <div>
                        <p className="font-medium m-0">TrimTech</p>
                        <p className="text-sm text-white/70 m-0">Super Admin</p>
                    </div>
                </div>


                <button onClick={handleLogout} className=" w-full flex gap-[7px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2">
                    <LogoutOutlined className="text-red-500" />
                    <p className=" font-semibold m-0">Logout</p>
                </button>

            </div>

        </aside >
    );
};

export default Sidebar;
