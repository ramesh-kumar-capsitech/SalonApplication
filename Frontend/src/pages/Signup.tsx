import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import signupIllustration from '../assets/images/signup.svg'
import { Link, useNavigate } from 'react-router-dom'
// import message from 'antd/es/message'
import message from 'antd/es/message'
import { Form, Input, Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { postApiAuthSignup } from '../api/generated/loginsignuphome'
const Signup = () => {

    const navigate = useNavigate()



    const [form] = Form.useForm();
    const signupMutation = useMutation({
        mutationFn: async (values: any) => {
            const res = await postApiAuthSignup(
                values
            );

            return res.data;
        },

        onSuccess: (result) => {
            if (result.success) {
                message.success(result.message);
                navigate("/");
            }
            else {
                message.error(result.message);
            }
        },

        onError: () => {
            message.error(
                "Something went wrong"
            );
        }
    });
    const handleSignup = (values: any) => {
        signupMutation.mutate(values);
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
                                <p className='font-bold text-3xl m-0 p-0'>BookMySalon</p>
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
                                        loading={signupMutation.isPending}
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
