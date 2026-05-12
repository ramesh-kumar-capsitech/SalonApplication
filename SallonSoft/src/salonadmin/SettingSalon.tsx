import { message, Segmented } from 'antd'
import React, { useState, useEffect } from "react";


import { LockOutlined } from "@ant-design/icons";

import {
    Card,
    Avatar,
    Button,
    Form,
    Input,
    Upload,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import axios from 'axios';


const SettingSalon = () => {
    const [form] = Form.useForm();
    const [tab, settab] = useState<"profile" | "password">("profile")
    const [loggeduser, setloggeduser] = useState('')
    const [firstname, setfirstname] = useState('')
    const [email, setemail] = useState('')
    const [phone, setphone] = useState('')

    useEffect(() => {
        setloggeduser(localStorage.getItem('name') ?? '');
        setfirstname(localStorage.getItem('name')?.split(' ').map(word => word[0])?.join('').toUpperCase() ?? '');

        setemail(localStorage.getItem('email') ?? '')
    }, []);

    const [loading, setLoading] = useState(false);
    const [loadingprofile, setLoadingprofile] = useState(false);


    const handlePasswordChange = async (values: any) => {
        setLoading(true);
        try {
            const salonId = localStorage.getItem("salonId");

            const { data } = await axios.put(
                `http://localhost:3001/auth/salon/change-password/${salonId}`,
                values
            );

            if (data.success) {
                message.success(" Password updated successfully");
                form.resetFields();
            } else {
                message.error(data.message || "Something went wrong");
            }

        } catch (error: any) {
            console.log(error);
            message.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };


    const handleProfileUpdate = async () => {
        setLoadingprofile(true)
        try {
            const salonId = localStorage.getItem("salonId");
            const values = form.getFieldsValue();
            const { data } = await axios.put(
                `http://localhost:3001/auth/salonprofile/${salonId}`,
                values
            );

            if (data.success) {
                message.success("Profile updated successfully");
                form.setFieldsValue(values);
            } else {
                message.error(data.message || "Something went wrong");
            }
        } catch (error: any) {
            console.log(error);
            message.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };
    useEffect(() => {
        const salonId = localStorage.getItem("salonId");
        axios.get(`http://localhost:3001/auth/salonprofile/${salonId}`)

            .then((response) => {
                const { salonname, ownername, email, phone } = response.data.data;

                setfirstname(ownername.split(' ').map((word: string) => word[0]).join('').toUpperCase());
                setemail(email);
                setphone(phone);
                form.setFieldsValue({
                    name: ownername,
                    email: email,
                    phone: phone
                });
                console.log("Salon profile data:", response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching salon profile:", error);
            }
            );
    }, []);


    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3   ">
                <div className='pt-3'>
                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        Setting
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        Manage your Profile
                    </p>
                </div>


            </div>
            <hr />
            <div className='m-6 mb-0 '>
                <Segmented
                    value={tab}
                    onChange={(val) => settab(val as "profile" | "password")}
                    options={[
                        {
                            label: 'Profile',
                            value: 'profile',
                        },
                        {
                            label: 'Password',
                            value: 'password',
                        },
                    ]}
                    rootClassName=" rounded-lg bg-gray-100 w-[16%] font-[Outfit]  p-1 m-6 mt-0"
                />
            </div>
            {tab === "profile" && (

                <div className='font-[outfit] m-6 mt-0'>
                    <Card className="rounded-2xl border font-[outfit]" bodyStyle={{ padding: 32 }}>

                        {/* PROFILE PICTURE */}
                        <div className="flex items-start gap-6 mb-8  ">
                            <Avatar
                                size={72}
                                className="bg-blue-100 text-blue-600 font-semibold"
                            >
                                JD
                            </Avatar>

                            <div>
                                <h2 className="text-lg font-semibold">Profile Picture</h2>
                                <p className="text-gray-500 mb-3">
                                    Upload a new profile picture or update your avatar
                                </p>

                                <div className="flex items-center gap-4">
                                    <Upload showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>
                                            Upload Photo
                                        </Button>
                                    </Upload>

                                    <Button type="link" danger>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>


                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleProfileUpdate}
                        >
                            <Form.Item
                                name="name"
                                label={<span className="font-[Outfit]">Full Name</span>}
                                rules={[
                                    { required: true, message: "Name is required" },
                                    { min: 3, message: "Minimum 3 characters required" }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item

                                name="email"
                                label={<span className="font-[Outfit]">Email Address</span>}
                                rules={[
                                    { required: true, message: "Email is required" },
                                    { type: "email", message: "Enter valid email" }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>

                            <Form.Item

                                name="phone"
                                label={<span className="font-[Outfit]">Phone Number</span>}
                                rules={[
                                    { required: true, message: "Phone is required" },
                                    { pattern: /^[0-9]{10}$/, message: "Enter valid 10 digit number" }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-4 mt-6">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="rounded-full px-8"
                                    htmlType="submit"
                                // loading={loadingprofile}
                                >
                                    Save Changes
                                </Button>

                                <Button
                                    size="large"
                                    className="rounded-full px-8"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            )}
            {
                tab === "password" && (
                    <div className='m-6 mt-0'>  <Card
                        className="rounded-2xl border font-[Outfit]"
                        bodyStyle={{ padding: 28 }}
                    >
                        {/* HEADER */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">Change Password</h2>
                            <p className="text-gray-500 text-sm">
                                Update your password to keep your account secure
                            </p>
                        </div>

                        {/* FORM */}
                        <Form form={form} layout="vertical" onFinish={handlePasswordChange}>

                            <Form.Item
                                label="Current Password"
                                name="currentPassword"
                                rules={[
                                    { required: true, message: "Please enter current password" },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter current password"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* New Password */}
                            <Form.Item
                                label="New Password"
                                name="newPassword"
                                rules={[
                                    { required: true, message: "Please enter new password" },
                                    {
                                        pattern:
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                        message:
                                            "Password must be strong (8 chars, A-Z, a-z, number, special char)",
                                    },
                                ]}
                                extra={
                                    <span className="text-xs text-gray-400">
                                        Password must be at least 8 characters long
                                    </span>
                                }
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter new password"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* Confirm Password */}
                            <Form.Item
                                label="Confirm New Password"
                                name="confirmPassword"
                                dependencies={["newPassword"]}
                                className='font-[Outfit]'
                                rules={[
                                    { required: true, message: "Please confirm password" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("newPassword") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Passwords do not match");
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm new password"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* PASSWORD RULES */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <p className="font-medium text-sm mb-2">
                                    Password Requirements:
                                </p>
                                <ul className="text-sm font-[outfit] text-gray-600 list-disc pl-5 space-y-1">
                                    <li>At least 8 characters long</li>
                                    <li>Include uppercase and lowercase letters</li>
                                    <li>Include at least one number</li>
                                    <li>Include at least one special character</li>
                                </ul>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-4">
                                <Button
                                    type="primary"
                                    className="rounded-full px-6"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Update Password
                                </Button>

                                <Button
                                    className="rounded-full px-6"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card>
                    </div>
                )
            }
        </div >
    )
}

export default SettingSalon
function setphone(phone: any) {
    throw new Error('Function not implemented.');
}

