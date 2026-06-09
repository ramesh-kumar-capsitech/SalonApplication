import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import signupIllustration from '../assets/images/signup.svg'
import { Link, useNavigate } from 'react-router-dom'
// import message from 'antd/es/message'
import message from 'antd/es/message'
import { Form, Input, Button } from "antd";
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
        mobilenumber: "",
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
    const [form] = Form.useForm();
    const handleSignup = async (values: any) => {
        try {
            const response = await fetch(
                "https://localhost:7074/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );

            const result = await response.json();

            if (result.success) {
                message.success(result.message);

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Something went wrong");
        }
    };






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
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSignup}
                            >
                                <Form.Item
                                    label={<span className='font-[Outfit]'>Username</span>}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter username",
                                        },
                                    ]}
                                >
                                    <Input size="middle" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='font-[Outfit]'>Email</span>}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter email",
                                        },
                                        {
                                            type: "email",
                                            message: "Invalid email",
                                        },
                                    ]}
                                >
                                    <Input size="middle" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='font-[Outfit]'>Mobile</span>}
                                    name="mobilenumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter mobile number",
                                        },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: "Mobile number must be 10 digits",
                                        },
                                    ]}
                                >
                                    <Input size="middle" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='font-[Outfit]'>Password</span>}
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter password",
                                        },
                                        {
                                            min: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    ]}
                                >
                                    <Input.Password size="middle" />
                                </Form.Item>
                                <div className="text-center mb-3">
                                    <a href="#" className="text-sm  ">
                                        You have an account?
                                        <span className='text-blue-700 hover:underline'> <Link to="/"> Please SignIn</Link></span>
                                    </a>
                                </div>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        size="large"
                                    >
                                        Sign Up
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                    </div>
                </div>

            </div>
        </div >
    )
}

export default Signup
