import React from 'react'
import logo from '../assets/images/logo.png'

import loginIllustration from '../assets/images/login.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { message } from 'antd'
const salon = () => {
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const navigate = useNavigate()
    const [checksalon, setchecksalon] = useState({
        email: "",
        lastFiveDigit: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setchecksalon({ ...checksalon, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, lastFiveDigit } = checksalon;
        if (!email || !lastFiveDigit) {
            setisError(true);
            setmsg('All fields are required');
            return;

        }
        try {
            const res = await axios.post("http://localhost:3001/auth/check-status",
                checksalon);
            const { message: responseMessage, ownername, status
                , email,
                loginEmail
                , loginPassword } = res.data;
            console.log(res.data)

            if (res.status === 200) {

                setmsg(responseMessage);
                setisError(false);
                message.success(responseMessage);
                localStorage.setItem("Ownername", ownername)
                localStorage.setItem("salonemail", email)
                localStorage.setItem("loginid", loginEmail)
                localStorage.setItem("password", loginPassword)
                localStorage.setItem("status", status)
                setTimeout(() => {
                    navigate('/salonstatus', { state: { status } });
                }, 2000);
            }
            else {
                setmsg(responseMessage);
                setisError(true);
                message.error(responseMessage);

            }
        } catch (err: any) {
            const errorMessage =

                err.response?.data?.message || "Something went wrong";
            setmsg(errorMessage);
            setisError(true);
            message.error(errorMessage);


        }
    }
    return (
        <div>
            <div className="min-h-screen flex items-center  justify-center bg-gray-100" >

                <div className="w-full max-w-[1000px] h-[400px]   bg-white rounded-3xl shadow-lg overflow-hidden flex">


                    <div className="hidden md:block w-1/2 bg-[#F3F6FC] ">
                        <div className=' p-10 flex justify-center items-center  '>
                            <img
                                src={loginIllustration}
                                alt="Dashboard Illustration"
                                className="min-w-[300px] "
                            />
                        </div>

                    </div>

                    <div className='w-full flex md:w-1/2 md:flex  justify-center items-center '>

                        <div>
                            <div className='flex items-center gap-4 mb-4'>


                                <div>
                                    <img src={logo} alt="" className='w-[70px] ' />
                                </div>
                                <div className='  '>
                                    <p className='font-semibold text-xl m-0 p-0'>Welcome to</p>
                                    <p className='font-bold text-3xl m-0 p-0'>TrimTech</p>
                                </div>
                            </div>
                            <div className='py-1 text-blue-700'>
                                Check Your Salon Application
                            </div>


                            <div>
                                <form action="" onSubmit={handleSubmit}>

                                    <div className="mb-5">
                                        <label className="block text-sm    text-gray-600 mb-1">
                                            Your Salon Email
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            name='email'
                                            id='email'
                                            onChange={handleChange}
                                            className="w-[300px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                        />
                                    </div>



                                    <div className="mb-5">
                                        <label className="block text-sm  text-gray-600 mb-1">
                                            Last Five Digits of Your Phone Number
                                        </label>


                                        <input
                                            type="password"
                                            id='password'
                                            onChange={handleChange}
                                            name='lastFiveDigit'

                                            placeholder="Last Five Digits"
                                            className="w-[300px]  px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                        />
                                    </div>


                                    <div className="w-[300px] text-center  mb-3">
                                        <a href="#" className="text-sm  ">
                                            Don't have an account?
                                            <span className='text-blue-700 hover:underline'> <Link to="/signup"> as customer</Link></span>and <span className='text-blue-700 hover:underline'> <Link to="/applysalon"> Apply for Salon </Link></span>and <span className='text-blue-700 hover:underline'> <Link to="/applyjob"> As a Employee</Link></span>
                                        </a>

                                    </div>

                                    {isError && <div className="w-[300px] text-center mb-3 text-red-500">{isError}</div>}
                                    {msg && <div className={`w-[300px] text-center mb-3 ${isError ? 'text-red-500' : 'text-green-500'}`}>{msg}</div>}
                                    <button type="submit" className="w-[300px] bg-[#0052CC] text-white py-3 rounded-sm font-[Outfit] font-semibold hover:bg-blue-600 transition">
                                        Sign in
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>

                </div>
            </div >
        </div >
    )
}

export default salon
