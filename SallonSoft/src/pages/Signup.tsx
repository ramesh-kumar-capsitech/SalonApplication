import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import signupIllustration from '../assets/images/signup.svg'
import { Link, useNavigate } from 'react-router-dom'
// import message from 'antd/es/message'
import message from 'antd/es/message'
import axios from 'axios'

const Signup = () => {
    // const navigate = useNavigate();
    // const [msg, setmsg] = useState("");

    // const [isError, setisError] = useState(false)
    // const [signupinfo, setsigninfo] = useState({
    //     name: "",
    //     email: "",
    //     mobile: "",
    //     password: ""
    // })
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setsigninfo({ ...signupinfo, [e.target.name]: e.target.value })
    //     console.log(signupinfo);
    //     console.log(e.target.name, e.target.value);
    // }
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (signupinfo.name === "" || signupinfo.email === "" || signupinfo.mobile === "" || signupinfo.password === "") {
    //         setisError(true);
    //         setmsg("Please fill all the fields");
    //         message.error("Please fill all the fields");
    //     }

    //     try {
    //         const url = "http://localhost:3001/auth/signup"
    //         const response = await fetch(url, {
    //             method: 'POST',

    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(signupinfo)

    //         })
    //         const result = await response.json();
    //         const { success, message, error } = result;
    //         if (success) {
    //             setmsg(message);
    //             setisError(false);
    //             setTimeout(() => {
    //                 navigate('/')
    //             }, 2000);
    //         }
    //         else if (error) {
    //             const details = error?.details[0].message || "Signup failed";
    //             setisError(true);
    //             setmsg(details);
    //         }
    //         else if (!success) {
    //             setisError(true);
    //             setmsg(message || "Signup failed");

    //         }


    //     }
    //     catch (error) {
    //         console.log("FULL ERROR:", error);
    //         setisError(true);
    //         setmsg("An error occurred during signup. Please try again later.");

    //     }
    // }
    const navigate = useNavigate()
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const [signupinfo, setsigninfo] = useState({
        name: "",
        email: "",
        mobile: "",
        password: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setsigninfo({
            ...signupinfo,
            [name]: value,
        });
        console.log(name, value)
        console.log(signupinfo)

    }
    const handlesignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, mobile, password } = signupinfo
        if (!name || !email || !mobile || !password) {
            // return handleerror('All field are require ')
            setisError(true);
            setmsg('All field are require ')
            message.error('All field are require ')
        }

        // await axios.post(url, signupinfo).then((res) => {
        //     console.log(res)
        //     const { success, message: responseMessage } = res.data
        //     if (success) {
        //         setmsg(responseMessage)
        //         setisError(false);
        //         setTimeout(() => {
        //             navigate('/login')
        //         }, 2000);

        //     }
        //     else if (!success) {
        //         setisError(true);
        //         setmsg(responseMessage)
        //     }
        //     else if (res.data.error) {
        //         const details = res.data.error?.details[0].message || "Signup failed";
        //         setisError(true);
        //         setmsg(details)

        //     }



        // }
        // ).catch((error) => {
        //     console.log("Error during signup:", error);
        //     setisError(true);
        //     setmsg(error instanceof Error ? error.message : "An error occurred during signup. Please try again later.");
        // })

        try {
            const url = "http://localhost:3001/auth/signup"
            const responce = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupinfo)
            })
            const result = await responce.json();
            console.log(result)

            const { success, message, error } = result
            if (success) {
                // handlesuccess(message)
                setmsg(message);
                setisError(false);

                setTimeout(() => {
                    navigate('/')
                }, 2000);
            }
            else if (error) {
                const details = error?.details[0].message;
                // handleerror(details)
                setisError(true);
                setmsg(details);
            }
            else if (!success) {
                setisError(true);
                setmsg(message);

                // handleerror(message)
            }
        } catch (error) {
            setisError(true);
            console.log("Error during signup:", error);
            setmsg(error instanceof Error ? error.message : "An error occurred during signup. Please try again later.");

            // handleerror(error);
        }

    }






    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-[1000px] h-[580px]  bg-white rounded-3xl shadow-lg overflow-hidden flex">


                <div className=" hidden md:block w-1/2 bg-[#F3F6FC] ">
                    <div className=' flex justify-center items-center h-full '>
                        <img
                            src={signupIllustration}
                            alt="Dashboard Illustration"
                            className=" "
                        />
                    </div>

                </div>

                <div className=' w-full flex md:w-1/2 md:flex justify-center items-center '>

                    <div>
                        <div className='flex items-center gap-4 mb-5'>


                            <div>
                                <img src={logo} alt="" className='w-[70px] ' />
                            </div>
                            <div className='   '>
                                <p className='font-semibold text-xl m-0 p-0 '>Welcome to</p>
                                <p className='font-bold text-3xl m-0 p-0'>TrimTech</p>
                            </div>
                        </div>
                        <div>
                            <form action="" onSubmit={handlesignup}>

                                <div className="mb-5">
                                    <label className="block text-sm  text-gray-600 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={signupinfo.name}
                                        onChange={handleChange}
                                        placeholder="Username"

                                        className="w-[300px]  px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="block text-sm    text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <input
                                        name='email'
                                        type="text"
                                        value={signupinfo.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-[300px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="block text-sm   text-gray-600 mb-1">
                                        Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        name='mobile'
                                        value={signupinfo.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile"
                                        className="w-[300px]  px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Password
                                    </label>
                                    <input
                                        name='password'
                                        type="password"
                                        value={signupinfo.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-[300px]  px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>



                                {isError && <p className="text-red-600 text-sm mt-4">{msg}</p>}
                                {!isError && <p className="text-green-600 text-sm mt-4">{msg}</p>}
                                <div className="text-center mb-3">
                                    <a href="#" className="text-sm  ">
                                        You have an account?
                                        <span className='text-blue-700 hover:underline'> <Link to="/"> Please SignIn</Link></span>
                                    </a>
                                </div>

                                <button type="submit" className="w-[300px] bg-[#0052CC] text-white py-3 rounded-sm font-[Outfit] font-semibold hover:bg-blue-600 transition">
                                    Sign in
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Signup
