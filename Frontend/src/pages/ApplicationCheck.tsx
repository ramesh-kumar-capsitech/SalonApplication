import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import loginIllustration from '../assets/images/login.svg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { message } from 'antd'

const ApplicationCheck = () => {
    const [msg, setmsg] = useState([]);
    const [isError, setisError] = useState(false)
    const navigate = useNavigate()
    const [checkApplicationjob, setcheckApplicationjob] = useState({
        email: "",
        lastFiveDigit: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setcheckApplicationjob({ ...checkApplicationjob, [e.target.name]: e.target.value })
    }
    const handlesubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { email, lastFiveDigit } = checkApplicationjob;
        if (!email || !lastFiveDigit) {
            setisError(true);
            setmsg('All fields are required');
            return;

        }
        try {
            const res = await axios.post("http://localhost:3001/auth/check-jobapplication",
                checkApplicationjob);
            const { message: responseMessage, name, status
                , email,
                loginEmail
                , loginPassword } = res.data;
            console.log(res.data)

            if (res.status === 200) {

                setmsg(responseMessage);
                setisError(false);
                message.success("login successful");
                localStorage.setItem("name", name)
                localStorage.setItem("Applicationemail", email)
                localStorage.setItem("loginidjob", loginEmail)
                localStorage.setItem("passwordjob", loginPassword)
                localStorage.setItem("status", status)
                setTimeout(() => {
                    navigate('/applicationcheck', { state: { status } });
                }, 2000);
            }
            else {
                setmsg(responseMessage);
                setisError(true);
                message.error("invalid creditials");

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
                            <div className='flex items-center gap-4 mb-5'>


                                <div>
                                    <img src={logo} alt="" className='w-[70px] ' />
                                </div>
                                <div className='  '>
                                    <p className='font-semibold text-xl m-0 p-0'>Welcome to</p>
                                    <p className='font-bold text-3xl m-0 p-0'>TrimTech</p>
                                </div>
                            </div>
                            <div className='py-1 text-blue-700'>
                                Check Your Job Application
                            </div>

                            <div>
                                <form action="" onSubmit={handlesubmit} >

                                    <div className="mb-5">
                                        <label className="block text-sm    text-gray-600 mb-1">
                                            Your Email
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

export default ApplicationCheck
