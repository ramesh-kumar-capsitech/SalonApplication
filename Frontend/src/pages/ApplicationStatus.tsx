import { LogoutOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png'
const ApplicationStatus = () => {
    const [name, setapplicationname] = useState('')
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/applicationcheckform");
    };
    useEffect(() => {
        setapplicationname(localStorage.getItem('name') ?? '');

    }, [])
    const [status, setStatus] = useState("processing")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    useEffect(() => {
        setLoginEmail(localStorage.getItem("loginidjob") ?? '')
        setLoginPassword(localStorage.getItem("passwordjob") ?? '')
        setStatus(localStorage.getItem("status") ?? '')

    }, [])
    return (
        <div>
            <div>
                <div className="flex items-center bg-gradient-to-b from-blue-700 to-blue-600
             gap-3  p-3">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" />

                    </div>
                    <div className='text-white'>
                        <h1 className="text-lg  m-0 leading-[0.8]  ">TrimTech</h1>
                        <span className="  text-sm text-white/70">Premium Booking</span>
                    </div>
                </div>
                {/* <div>
                    <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                </div> */}
            </div>
            <div className=" flex justify-center items-center m-6 ">
                {status === "processing" && (
                    <Card
                        className="w-full max-w-md text-center rounded-2xl shadow-lg"
                        bodyStyle={{ padding: 40 }}
                    >
                        <Spin size="large" />

                        <h2 className="mt-6 text-xl font-semibold">
                            Your request is currently being processed
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Please wait while we complete the process.
                        </p>

                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            className="mt-8"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Card>
                )}
                {status === "approved" && (
                    <div>

                        <h2 className="text-green-600 text-xl font-semibold">
                            Your Application is approved
                        </h2>

                        <div className="bg-green-50 p-4 rounded-xl mt-4 text-left">

                            <p className="text-sm text-gray-500">Login Email</p>
                            <p className="font-semibold">{loginEmail}</p>

                            {loginPassword && (
                                <>
                                    <p className="text-sm text-gray-500 mt-3">Password</p>
                                    <p className="font-semibold">{loginPassword}</p>

                                </>
                            )}
                            <Button
                                danger
                                icon={<LogoutOutlined />}
                                className="mt-8"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>


                    </div>
                )}
            </div>
        </div>
    )
}

export default ApplicationStatus
