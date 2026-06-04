import logo from '../assets/images/logo.png'

import loginIllustration from '../assets/images/login.svg'
import { data, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import message from 'antd/es/message'
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess } from "../redux/authSlice";
import { useAppSelector } from "../redux/hooks";
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
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const { email, password } = logininfo;

    //     if (!email || !password) {
    //         setisError(true);
    //         setmsg('All fields are required');
    //         return;
    //     }
    //     if (email === "superadmin@gmail.com" && password === "superadmin123") {
    //         localStorage.setItem("role", "superadmin");
    //         message.success("Login successful as Super Admin");
    //         setTimeout(() => {
    //             navigate('/superadmin');
    //         }, 1000);
    //         return;
    //     }

    //     try {
    //         const res = await axios.post(
    //             "http://localhost:3001/auth/login",
    //             logininfo
    //         );

    //         const { success, message, name, jwttoken, email: userEmail } = res.data;



    //         if (success) {
    //             setmsg(message);
    //             setisError(false);
    //             console.log(res.data);
    //             localStorage.setItem("token", jwttoken);
    //             localStorage.setItem("name", name);
    //             localStorage.setItem("email", userEmail);

    //             setTimeout(() => {
    //                 navigate('/customer');
    //             }, 2000);

    //         } else {
    //             setmsg(message);
    //             setisError(true);
    //         }

    //     } catch (err: any) {
    //         const errorMessage =
    //             err.response?.data?.message || "Something went wrong";

    //         setmsg(errorMessage);
    //         setisError(true);
    //     }
    // };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = logininfo;

        if (!email || !password) {
            setisError(true);
            setmsg("All fields are required");
            return;
        }


        if (
            email === "superadmin@gmail.com" &&
            password === "superadmin123"
        ) {

            dispatch(
                loginSuccess({
                    token: "superadmin-token",

                    user: {
                        name: "Super Admin",
                        email: "superadmin@gmail.com",
                        role: "superadmin",
                    },
                })
            );



            message.success(
                "Login successful as Super Admin"
            );

            setTimeout(() => {
                navigate("/superadmin");
            }, 200);

            return;
        }
        try {

            let res = await axios.post(
                "https://localhost:7074/api/auth/login",
                logininfo
            );

            console.log(res.data);

            if (res.data.success) {

                dispatch(
                    loginSuccess({
                        token: res.data.token,

                        user: {
                            _id: res.data.user.id,
                            name: res.data.user.name,
                            email: res.data.user.email,
                            role: "customer",
                        },
                    })
                );

                message.success("Customer Login Success");

                navigate("/customer");

                return;
            }

        } catch (err: any) {

            console.log(err);

        }
        // try {


        //     let res = await axios.post(
        //         "https://localhost:7074/api/auth/login",
        //         logininfo
        //     );

        //     if (res.data.success) {
        //         dispatch(
        //             loginSuccess({
        //                 token: res.data.jwttoken,
        //                 user: {
        //                     _id: res.data._id,
        //                     name: res.data.name,
        //                     email: res.data.email,
        //                     role: "customer",
        //                 },
        //             })
        //         );

        //         console.log("DISPATCH DONE");
        //         console.log(res.data);

        //         setTimeout(() => {
        //             navigate("/customer");
        //         }, 100);
        //         // dispatch(
        //         //     loginSuccess({
        //         //         // token: res.data.jwttoken,
        //         //         token: "dummy-token",

        //         //         user: {
        //         //             _id: res.data._id,
        //         //             name: res.data.name,
        //         //             email: res.data.email,
        //         //             role: "customer",
        //         //         },
        //         //     })
        //         // );
        //         message.success("Customer Login Success");

        //         setTimeout(() => {
        //             navigate("/customer");
        //         }, 100);
        //         return;
        //     }

        // } catch (err: any) {
        //     console.log(err);
        //     const errorMessage =
        //         err.response?.data?.message || "Invalid Credentials";
        //     setmsg(errorMessage);
        //     setisError(true);
        // }

        try {


            let res = await axios.post(
                "https://localhost:7074/api/auth/salonlogin",
                {
                    loginEmail: logininfo.email,
                    loginPassword: logininfo.password,
                }
            );

            if (res.data.success) {
                console.log(res.data);
                dispatch(
                    loginSuccess({
                        token: res.data.token,

                        user: {

                            salonId:
                                res.data.salon.id,

                            salonownername:
                                res.data.salon.ownerName,

                            email:
                                res.data.salon.loginEmail,

                            profileImage:
                                res.data.salon.profileImage,

                            role: "salonadmin",
                        },
                    })
                );
                navigate("/salonadmin");
                return;

            }

        } catch (err: any) {

            const errorMessage =
                err.response?.data?.message || "Invalid Credentials";

            setmsg(errorMessage);
            setisError(true);
        }
        try {


            const res = await axios.post(
                "https://localhost:7074/api/auth/employeelogin",
                {
                    loginEmail: logininfo.email,
                    loginPassword: logininfo.password,
                }
            );

            if (res.data.success) {
                message.success("Employee Login Success");
                const employee = res.data.employee;
                dispatch(
                    loginSuccess({
                        token: res.data.token,

                        user: {
                            id: employee.id,
                            salonId: employee.salonId,
                            fullName: employee.fullName,
                            salonId: employee.salonId,
                            profileImage: employee.profileImage,
                            role: "employee",
                        },
                    })
                );
                navigate("/employee");
                return;
            }

        } catch (err: any) {
            console.log("LOGIN ERROR:", err);

            const errorMessage =
                err.response?.data?.message || "Invalid Credentials";

            setmsg(errorMessage);
            setisError(true);
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
                                <p className='font-bold text-3xl m-0 p-0'>TrimTech</p>
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
                                    <span className='text-blue-700 hover:underline'> <Link to="/signup"> as customer</Link></span>and <span className='text-blue-700 hover:underline'> <Link to="/applysalon"> Apply for Salon </Link></span>and <span className='text-blue-700 hover:underline'> <Link to="/applyjob"> As a Employee</Link></span>


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
