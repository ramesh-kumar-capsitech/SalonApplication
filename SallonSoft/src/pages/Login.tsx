import logo from '../assets/images/logo.png'

import loginIllustration from '../assets/images/login.svg'
import { data, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import message from 'antd/es/message'
const Login = () => {
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const navigate = useNavigate()
    const [logininfo, setlogininfo] = useState({
        email: "",
        password: ""
    })
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


        if (email === "superadmin@gmail.com" && password === "superadmin123") {
            localStorage.setItem("role", "superadmin");
            message.success("Login successful as Super Admin");
            navigate("/superadmin");
            return;
        }

        try {


            let res = await axios.post(
                "http://localhost:3001/auth/login",
                logininfo
            );

            if (res.data.success) {

                localStorage.setItem("token", res.data.jwttoken);
                localStorage.setItem("user", JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email
                }));
                message.success("Customer Login Success");

                navigate("/customer");
                return;
            }

        } catch (err: any) {

        }

        try {


            let res = await axios.post(
                "http://localhost:3001/auth/salonlogin",
                logininfo
            );

            if (res.data.success) {

                localStorage.setItem("salontoken", res.data.jwttoken);
                localStorage.setItem("salonname", res.data.name);
                localStorage.setItem("salonemail", res.data.email);
                localStorage.setItem("salonId", res.data.salonId)
                message.success("Salon Admin Login Success");

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


            let res = await axios.post(
                "http://localhost:3001/auth/employeelogin",
                logininfo
            );

            if (res.data.success) {

                localStorage.setItem("emptoken", res.data.jwttoken);
                localStorage.setItem("empname", res.data.name);
                localStorage.setItem("empemail", res.data.email);
                localStorage.setItem("staffId", res.data.staffId);
                localStorage.setItem("salonId", res.data.salonId);
                message.success("Employee Login Success");

                navigate("/employee");
                return;
            }

        } catch (err: any) {

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
    )
}

export default Login
