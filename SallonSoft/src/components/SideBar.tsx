import React, { type FC } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo1.png'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { ShopOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { logout } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";

const Sidebar: React.FC = () => {
    // const dispatch = useAppDispatch();
    // dispatch(logout());
    const navigate = useNavigate();

    const handleLogout = () => {
        const isConfirmed = confirm("Are you sure you want to logout?");

        if (isConfirmed) {
            localStorage.removeItem('superadmin');

            navigate('/');
            message.success("Logged out successfully");
        }
    };
    return (
        <aside className="    fixed h-screen font-inter w-[20%] bg-gradient-to-b from-blue-700 to-blue-600 text-white md:flex flex-col justify-between px-5 py-6">


            <div>

                <div className="flex items-center  gap-3 mb-4">
                    <div className=" md:w-11 md:h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" />
                    </div>
                    <div className="hidden md:block ">
                        <h1 className="text-lg  m-0 leading-[0.8]  ">TrimTech</h1>
                        <span className="  text-sm text-white/70">Premium Booking</span>
                    </div>
                </div>
                <div>
                    <hr className="border-white/20 mb-6" />
                </div>


                <nav className="space-y-2">
                    <ul className="text-sm space-y-2 ">
                        <NavLink to="/superadmin/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-white/30 rounded-lg"
                                    : ""
                            }> <li className="   flex gap-[7px] items-center justify-center md:justify-start hover:bg-white/20  rounded-lg px-4 py-3 md:px-3 md:py-2 " >
                                <HomeOutlined className="text-white " />

                                {/* <Camera color="red" size={4} /> */}

                                <p className="hidden md:block font-semibold m-0 "> DashBoard</p>
                            </li>
                        </NavLink>
                        <NavLink to="/superadmin/salon"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-white/30 rounded-lg"
                                    : ""
                            }>
                            <li className="flex gap-[7px] items-center justify-center md:justify-start  hover:bg-white/20 rounded-lg  px-4 py-3 md:px-3 md:py-2">
                                <ShopOutlined />

                                <p className="hidden md:block font-semibold m-0 ">Salon</p>
                            </li>
                        </NavLink>
                        <NavLink to="/superadmin/users"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-white/30 rounded-lg"
                                    : ""
                            }>
                            <li className="flex gap-[7px] items-center justify-center md:justify-start  hover:bg-white/20 rounded-lg px-4 py-3 md:px-3 md:py-2">
                                <TeamOutlined />

                                <p className="hidden md:block font-semibold m-0 ">Users</p>
                            </li>
                        </NavLink>
                        <NavLink to="/superadmin/request"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-white/30 rounded-lg"
                                    : ""
                            }>  <li className="flex gap-[7px] items-center justify-center md:justify-start  hover:bg-white/20 rounded-lg px-4 py-3 md:px-3 md:py-2">
                                <FileTextOutlined />

                                <p className=" hidden md:block font-semibold m-0  ">Requests</p>
                            </li>
                        </NavLink>
                        <NavLink to="/superadmin/setting"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-white/30 rounded-lg"
                                    : ""
                            }>
                            <li className="flex gap-[7px] items-center justify-center  md:justify-start   hover:bg-white/20 rounded-lg px-4 py-3 md:px-3 md:py-2">
                                <SettingOutlined />

                                <p className="hidden md:block font-semibold m-0 ">Settings</p>
                            </li>
                        </NavLink>

                    </ul>
                </nav>
            </div>


            <div className="space-y-6">

                <div className="flex items-center gap-3 md:bg-white/10 rounded-xl  md:p-3">
                    <div className=" w-12 h-10  md:w-10 md:h-10 bg-blue-500 rounded-xl md:rounded-full flex items-center justify-center font-semibold">
                        {/* <img src={logo} alt="Logo" /> */}TT
                    </div>
                    <div className="hidden md:block ">
                        <p className="font-medium m-0">TrimTech</p>
                        <p className="text-sm text-white/70 m-0">Super Admin</p>
                    </div>
                </div>


                <button onClick={handleLogout} className=" w-full flex gap-[7px] justify-start   hover:bg-white/20 rounded-lg px-3 py-2">
                    <LogoutOutlined className="text-red-500" />
                    <p className=" hidden md:block font-semibold m-0">Logout</p>
                </button>

            </div>

        </aside >
    );
};

export default Sidebar;


// import React from "react";
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import logo from '../assets/images/logo1.png'
// import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
// import { ShopOutlined } from '@ant-design/icons';
// import { FileTextOutlined } from '@ant-design/icons';
// import { SettingOutlined } from '@ant-design/icons';
// import { LogoutOutlined } from '@ant-design/icons';
// import { message } from 'antd';


// const Sidebar: React.FC = () => {
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         confirm("Are you sure you want to logout?")

//         localStorage.removeItem('superadmin')

//         navigate('/');
//         message.success("Logged out successfully")
//     };
//     return (
//         <aside className="fixed top-0 left-0 h-screen
// w-[70px] md:w-[220px]
// bg-gradient-to-b from-blue-700 to-blue-600
// text-white flex flex-col justify-between
// py-6 px-2 md:px-5 transition-all duration-300">


//             <div>

//                 <div className="flex items-center  gap-3 mb-4">
//                     <div className=" md:w-11 md:h-11 bg-white/20 rounded-xl flex items-center justify-center">
//                         <img src={logo} alt="" />
//                     </div>
//                     <div className="hidden md:block ">
//                         <h1 className="text-lg  m-0 leading-[0.8]  ">TrimTech</h1>
//                         <span className="  text-sm text-white/70">Premium Booking</span>
//                     </div>
//                 </div>
//                 <div>
//                     <hr className="border-white/20 mb-6" />
//                 </div>


//                 <nav className="space-y-2">
//                     <ul className="text-sm space-y-2 ">
//                         <NavLink
//                             to="/superadmin/dashboard"
//                             end
//                             className={({ isActive }) =>
//                                 `rounded-lg transition-all duration-200 ${isActive
//                                     ? "bg-white/30 shadow-md"
//                                     : "hover:bg-white/20"
//                                 }`
//                             }
//                         > <li className="flex items-center gap-3
// justify-center md:justify-start
// hover:bg-white/20 rounded-lg
// px-2 md:px-3 py-3 md:py-2 transition-all">
//                                 <HomeOutlined className="text-white " />

//                                 {/* <Camera color="red" size={4} /> */}

//                                 <p className="hidden md:block font-semibold m-0 "> DashBoard</p>
//                             </li>
//                         </NavLink>
//                         <NavLink to="/superadmin/salon"
//                             className={({ isActive }) =>
//                                 isActive
//                                     ? "bg-white/30 rounded-lg"
//                                     : ""
//                             }>
//                             <li className="flex items-center gap-3
// justify-center md:justify-start
// hover:bg-white/20 rounded-lg
// px-2 md:px-3 py-3 md:py-2 transition-all">
//                                 <ShopOutlined />

//                                 <p className="hidden md:block font-semibold m-0 ">Salon</p>
//                             </li>
//                         </NavLink>
//                         <NavLink to="/superadmin/users"
//                             className={({ isActive }) =>
//                                 isActive
//                                     ? "bg-white/30 rounded-lg"
//                                     : ""
//                             }>
//                             <li className="flex items-center gap-3
// justify-center md:justify-start
// hover:bg-white/20 rounded-lg
// px-2 md:px-3 py-3 md:py-2 transition-all">
//                                 <TeamOutlined />

//                                 <p className="hidden md:block font-semibold m-0 ">Users</p>
//                             </li>
//                         </NavLink>
//                         <NavLink to="/superadmin/request"
//                             className={({ isActive }) =>
//                                 isActive
//                                     ? "bg-white/30 rounded-lg"
//                                     : ""
//                             }>  <li className="flex items-center gap-3
// justify-center md:justify-start
// hover:bg-white/20 rounded-lg
// px-2 md:px-3 py-3 md:py-2 transition-all">
//                                 <FileTextOutlined />

//                                 <p className=" hidden md:block font-semibold m-0  ">Requests</p>
//                             </li>
//                         </NavLink>
//                         <NavLink to="/superadmin/setting"
//                             className={({ isActive }) =>
//                                 `rounded-lg ${isActive
//                                     ? "bg-white/30 text-white"
//                                     : "hover:bg-white/20 text-white"
//                                 }`
//                             }>
//                             <li className="flex items-center gap-3
// justify-center md:justify-start
// hover:bg-white/20 rounded-lg
// px-2 md:px-3 py-3 md:py-2 transition-all">
//                                 <SettingOutlined />

//                                 <p className="hidden md:block font-semibold m-0 ">Settings</p>
//                             </li>
//                         </NavLink>

//                     </ul>
//                 </nav>
//             </div>


//             <div className="space-y-6">

//                 <div className="flex items-center justify-center md:justify-start gap-3 md:bg-white/10 rounded-xl md:p-3">
//                     <div className=" w-12 h-10  md:w-10 md:h-10 bg-blue-500 rounded-xl md:rounded-full flex items-center justify-center font-semibold">
//                         {/* <img src={logo} alt="Logo" /> */}TT
//                     </div>
//                     <div className="hidden md:block ">
//                         <p className="font-medium m-0">TrimTech</p>
//                         <p className="text-sm text-white/70 m-0">Super Admin</p>
//                     </div>
//                 </div>

//                 <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3
//   justify-center md:justify-start
//   hover:bg-white/20 rounded-lg px-3 py-2 transition-all"
//                 >
//                     <LogoutOutlined className="text-red-500" />
//                     <p className=" hidden md:block font-semibold m-0">Logout</p>
//                 </button>

//             </div>

//         </aside >
//     );
// };

// export default Sidebar;

