import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo1.png'
import { HomeOutlined, PictureOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/authSlice";
import { useAppSelector } from "../redux/hooks";
const Sidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const [loggeduser, setloggeduser] = useState('')
    const [firstname, setfirstname] = useState('')
    const [email, setemail] = useState('')
    const navigate = useNavigate()
    const [profileImage, setProfileImage] = useState("");
    const user = useAppSelector(
        (state) => state.auth.user
    );
    useEffect(() => {

        if (user) {

            setloggeduser(
                user.salonownername || ""
            );

            setemail(user.email || "");

            setProfileImage(
                user.profileImage || ""
            );

            const initials =
                user.salonownername
                    ? user.salonownername
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase()
                    : "";

            setfirstname(initials);
        }

    }, [user]);

    const handleLogout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        dispatch(logout());

        message.success("Logged out successfully");

        navigate("/");
    };
    console.log(user);
    console.log(user?.salonownername);
    return (
        <aside className="fixed inset-y-0 left-0 w-[20%] bg-gradient-to-b from-blue-700 to-blue-600 text-white flex flex-col px-2 md:px-5 py-6">


            <div>

                <div className="flex items-center justify-center md:justify-start gap-0 md:gap-3 mb-4">
                    <div className="md:hidden lg:block  w-10 h-10 md:w-11 md:h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" />
                    </div>
                    <div className="hidden md:block ">
                        <h1 className="text-lg  m-0 leading-[0.8]  ">BookMySalon</h1>
                        <span className="  text-sm text-white/70">Premium Booking</span>
                    </div>
                </div>
                <div>
                    <hr className="border-white/20 mb-6" />
                </div>
            </div>
            <div className="flex-1">

                <nav className="space-y-2">
                    <ul className="text-sm space-y-2 ">
                        <NavLink to='/salonadmin/dashboardsalon'> <li className="flex items-center justify-center md:justify-start gap-2  px-2 md:px-3  py-2 rounded-lg hover:bg-white/20" >
                            <HomeOutlined className="text-white " />

                            <p className="hidden md:block font-semibold m-0">DashBoard</p>
                        </li>
                        </NavLink>

                        <NavLink to='/salonadmin/staffsalon'> <li className="flex items-center justify-center md:justify-start gap-2  px-2 md:px-3  py-2 rounded-lg hover:bg-white/20">
                            <TeamOutlined />

                            <p className="hidden md:block font-semibold m-0 ">Staff</p>
                        </li>
                        </NavLink>
                        <NavLink to='/salonadmin/allbooking'> <li className="flex items-center justify-center md:justify-start gap-2  px-2 md:px-3  py-2 rounded-lg hover:bg-white/20" >

                            <UnorderedListOutlined className="text-white " />
                            <p className="hidden md:block font-semibold m-0 "> Bookings</p>
                        </li>
                        </NavLink>
                        <NavLink to='/salonadmin/gallery'> <li className="flex items-center justify-center md:justify-start gap-2  px-2 md:px-3  py-2 rounded-lg hover:bg-white/20" >

                            <PictureOutlined className="text-white " />
                            <p className="hidden md:block  font-semibold m-0 "> Gallery</p>
                        </li>
                        </NavLink>
                        <NavLink to='/salonadmin/settingsalon'>
                            <li className="flex items-center justify-center md:justify-start gap-2  px-2 md:px-3  py-2 rounded-lg hover:bg-white/20">
                                <SettingOutlined />

                                <p className="hidden md:block font-semibold m-0 ">Settings</p>
                            </li>
                        </NavLink>

                    </ul>
                </nav>
            </div>


            <div className="mt-auto pt-6">

                <div className="flex items-center gap-3 md:bg-white/10 rounded-xl mt-3  md:p-3">
                    <div className=" w-12 h-12 lg:w-10 lg:h-10  md:w-10 md:h-7 bg-blue-500 rounded-full md:rounded-full flex items-center justify-center font-semibold">
                        {
                            profileImage ? (

                                <img
                                    src={profileImage}
                                    alt="profile"
                                    className="w-full h-full rounded-full object-cover"
                                />

                            ) : (

                                <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center font-semibold">
                                    {firstname}
                                </div>
                            )
                        }
                    </div>
                    <div className="hidden md:block ">
                        <p className="font-medium m-0">{loggeduser}</p>
                        <p className="md:hidden text-sm text-white/70 m-0">Super Admin</p>
                    </div>
                </div>


                <button onClick={handleLogout} className="bg-white/20 md:bg-transparent  mt-2 w-full flex gap-[7px] justify-center items-center md:justify-start   hover:bg-white/20 rounded-lg px-3 py-2">
                    <LogoutOutlined className="text-red-500" />
                    <p className="hidden md:block font-semibold m-0">Logout</p>
                </button>

            </div>

        </aside >
    );
};

export default Sidebar;
