import logo from '../assets/images/logo.png'

import loginIllustration from '../assets/images/login.svg'
import { data, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import message from 'antd/es/message'
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess } from "../redux/authSlice";
import { useAppSelector } from "../redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { postApiAuthEmployeelogin, postApiAuthLogin, postApiAuthSalonlogin, postApiAuthSuperadminlogin } from "../api/generated/loginsignuphome";
const Login = () => {
    const auth = useAppSelector((state: { auth: any }) => state.auth);

    console.log(auth);
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const navigate = useNavigate()
    const [logininfo, setlogininfo] = useState({
        email: "",
        password: ""
    })
    const dispatch = useAppDispatch();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setlogininfo({ ...logininfo, [e.target.name]: e.target.value })
    }
    const loginMutation = useMutation({
        mutationFn: async (loginData: {
            email: string;
            password: string;
        }) => {

            try {
                const superAdminRes = await postApiAuthSuperadminlogin(
                    loginData
                );

                return {
                    role: "superadmin",
                    data: superAdminRes.data,
                };
            } catch { }

            try {
                const customerRes = await postApiAuthLogin({
                    email: loginData.email,
                    password: loginData.password,
                });

                return {
                    role: "customer",
                    data: customerRes.data,
                };
            } catch { }

            try {
                const salonRes = await postApiAuthSalonlogin(
                    {
                        loginEmail: loginData.email,
                        loginPassword: loginData.password,
                    }
                );

                return {
                    role: "salonadmin",
                    data: salonRes.data,
                };
            } catch { }

            try {
                const employeeRes = await postApiAuthEmployeelogin(
                    {
                        loginEmail: loginData.email,
                        loginPassword: loginData.password,
                    }
                );

                return {
                    role: "employee",
                    data: employeeRes.data,
                };
            } catch { }

            throw new Error("Invalid Credentials");
        },

        onSuccess: (result) => {


            if (result.role === "superadmin") {
                dispatch(
                    loginSuccess({
                        token: "superadmin-token",
                        user: {
                            id: result.data.admin.id,
                            name: result.data.admin.name,
                            email: result.data.admin.email,
                            profileImage: result.data.admin.profileImage,
                            role: "superadmin",
                        },
                    })
                );

                message.success(
                    "Super Admin Login Success"
                );

                navigate("/superadmin");
            }
            if (result.role === "customer") {
                dispatch(
                    loginSuccess({
                        token: result.data.token,
                        user: {
                            _id: result.data.user.id,
                            name: result.data.user.name,
                            email: result.data.user.email,
                            profileImage: result.data.user.profileImage,
                            role: "customer",
                        },
                    })
                );

                message.success(
                    "Customer Login Success"
                );

                navigate("/customer");
            }
            if (result.role === "salonadmin") {
                dispatch(
                    loginSuccess({
                        token: result.data.token,
                        user: {
                            salonId:
                                result.data.salon.id,

                            salonownername:
                                result.data.salon.ownerName,

                            email:
                                result.data.salon.loginEmail,

                            profileImage:
                                result.data.salon.profileImage,

                            role: "salonadmin",
                        },
                    })
                );

                message.success(
                    "Salon Admin Login Success"
                );

                navigate("/salonadmin");
            }
            if (result.role === "employee") {
                const employee =
                    result.data.employee;

                dispatch(
                    loginSuccess({
                        token: result.data.token,
                        user: {
                            id: employee.id,
                            salonId:
                                employee.salonId,

                            fullName:
                                employee.fullName,

                            profileImage:
                                employee.profileImage,

                            role: "employee",
                        },
                    })
                );

                message.success(
                    "Employee Login Success"
                );

                navigate("/employee");
            }

        },

        onError: () => {
            message.error(
                "Invalid Credentials"
            );
        }
    });



    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (
            !logininfo.email ||
            !logininfo.password
        ) {
            message.error(
                "All fields are required"
            );
            return;
        }

        try {
            const result =
                await loginMutation.mutateAsync(
                    logininfo
                );

            console.log(result);
        }
        catch (error: any) {
            message.error(
                error.message
            );
        }
    };

    return (
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
                                <p className='font-bold text-3xl m-0 p-0'>BookMySalon</p>
                            </div>
                        </div>
                        <div>
                            <form action="" onSubmit={handleSubmit}>

                                <div className="mb-5">
                                    <label className="block text-sm    text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        name='email'
                                        onChange={handleChange}
                                        value={logininfo.email}
                                        className="w-[300px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>



                                <div className="mb-5">
                                    <label className="block text-sm  text-gray-600 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        onChange={handleChange}

                                        name='password'
                                        value={logininfo.password}
                                        placeholder="Password"
                                        className="w-[300px]  px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>


                                <div className="w-[300px] text-center  mb-3">

                                    Don't have an account?
                                    <span className='text-blue-700 hover:underline'> <Link to="/signup"> as customer</Link></span>and <span className='text-blue-700 hover:underline'> <Link to="/applysalon"> Apply for Salon </Link></span>and <span className='text-blue-700 hover:underline'></span>


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
    )
}

export default Login
