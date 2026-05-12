import { Segmented } from 'antd'
import React, { useState } from "react";


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


const Setting = () => {
    const [tab, settab] = useState<"profile" | "password">("profile")



    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3   ">
                <div className='pt-3'>
                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        Manage salon admins and customers
                    </p>
                </div>


            </div>
            <hr />
            <div className='m-6 mb-0 '>
                <Segmented
                    block
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
                    rootClassName=" rounded-lg bg-gray-100 md:max-w-[25%] font-[Outfit]  p-1 m-6 mt-0"
                />
            </div>
            {tab === "profile" && (

                <div className='font-[outfit] m-6 mt-0'>
                    <Card className="rounded-2xl border font-[outfit]" bodyStyle={{ padding: 32 }}>


                        <div className=" md:flex items-start grid gap-2 md:gap-6 mb-8  ">
                            <Avatar
                                size={72}
                                className=" bg-blue-100 text-blue-600 font-semibold"
                            >
                                JD
                            </Avatar>

                            <div>
                                <h2 className="text-lg font-semibold">Profile Picture</h2>
                                <p className="text-gray-500 mb-3">
                                    Upload a new profile picture or update your avatar
                                </p>

                                <div className=" grid  md:flex items-center gap-2 md:gap-4">
                                    <Upload showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>
                                            Upload Photo
                                        </Button>
                                    </Upload>

                                    <Button type="link" danger >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>


                        <Form
                            layout="vertical"
                            initialValues={{
                                name: "John Doe",
                                email: "john.doe@example.com",
                                phone: "+1 (555) 123-4567",
                            }}
                        >
                            <Form.Item
                                label={<span className='font-[Outfit] '>Name</span>}
                                name="name"
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className='font-[Outfit] '>Email Address</span>}
                                name="email"
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className='font-[Outfit] '>Phone Number</span>}
                                name="phone"
                                rootClassName=' '
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>


                            <div className=" grid md:flex gap-4 mt-6">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="rounded-full px-8"
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
            {tab === "password" && (
                <div className='m-6 mt-0'>  <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 28 }}
                >

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Change Password</h2>
                        <p className="text-gray-500 text-sm">
                            Update your password to keep your account secure
                        </p>
                    </div>


                    <Form layout="vertical">

                        <Form.Item
                            label="Current Password"
                            name="currentPassword"
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter current password"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>


                        <Form.Item
                            label="New Password"
                            name="newPassword"
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


                        <Form.Item
                            label="Confirm New Password"
                            name="confirmPassword"
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm new password"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>


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


                        <div className="grid md:flex gap-4">
                            <Button
                                type="primary"
                                className="rounded-full px-6"
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
                </Card></div>
            )}
        </div>
    )
}

export default Setting
