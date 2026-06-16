import { message, Segmented } from 'antd'
import React, { useEffect, useState } from "react";


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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiAuthGetemployeeprofileId, putApiAuthChangeemployeepasswordId, putApiAuthUpdateemployeeprofileId } from '../api/generated/loginsignuphome';


const SettingEmp = () => {
    const [form] = Form.useForm();
    const [profileForm] = Form.useForm();

    const [passwordForm] = Form.useForm();

    const [tab, settab] = useState<"profile" | "password">("profile");



    const [profileImage,
        setProfileImage]
        = useState("");

    const [initials,
        setInitials]
        = useState("");
    const authData = JSON.parse(
        localStorage.getItem("persist:auth")!
    );

    const user = JSON.parse(authData.user);

    const empId = user.id;

    const { data: profileData } = useQuery({
        queryKey: ["adminProfile", empId],

        queryFn: async () => {
            const res = await getApiAuthGetemployeeprofileId(empId)

            return res.data.data;


        },




    });
    useEffect(() => {
        if (profileData) {
            profileForm.setFieldsValue({
                fullName: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
            });

            setProfileImage(profileData.profileImage || "");

            setInitials(
                profileData.FullName
                    ?.split(" ")
                    ?.map((word) => word[0])
                    ?.join("")
                    ?.toUpperCase()
            );
        }
    }, [profileData]);
    const uploadImage =
        async (file) => {

            const data = new FormData();

            data.append(
                "file",
                file
            );

            data.append(
                "upload_preset",
                "salonupload"
            );

            try {

                const res =
                    await axios.post(
                        "https://api.cloudinary.com/v1_1/dmhp2b2dj/image/upload",
                        data
                    );

                setProfileImage(
                    res.data.secure_url
                );

                message.success(
                    "Image uploaded"
                );

            } catch (err) {

                console.log(err);

                message.error(
                    "Image upload failed"
                );
            }
        };



    const queryClient = useQueryClient()
    const updateProfileMutation =
        useMutation({
            mutationFn: async (values: any) => {

                const res =
                    await putApiAuthUpdateemployeeprofileId(empId,
                        {
                            fullName:
                                values.fullName,

                            Email:
                                values.email,

                            phone:
                                values.phone,

                            ProfileImage:
                                profileImage,
                        }
                    );

                return res.data;
            },

            onSuccess: () => {

                message.success(
                    "Profile updated successfully"
                );

                queryClient.invalidateQueries({
                    queryKey: [
                        "adminProfile",
                        empId,
                    ],
                });
            },

            onError: (error: any) => {

                console.log(error);
                console.log(error.response?.data);

                message.error(
                    "something went wrong"
                )
            }
        });
    const handleProfileUpdate =
        (values: any) => {

            updateProfileMutation.mutate(
                values
            );
        };

    const changePasswordMutation =
        useMutation({
            mutationFn: async (
                values: any
            ) => {

                const res =
                    await putApiAuthChangeemployeepasswordId(empId,
                        values
                    );

                return res.data;
            },

            onSuccess: () => {

                message.success(
                    "Password updated successfully"
                );

                passwordForm.resetFields();
            },

            onError: (
                error: any
            ) => {

                message.error(
                    error?.response?.data
                        ?.message ||
                    "Something went wrong"
                );
            },
        });
    const handlePasswordChange =
        (values: any) => {

            changePasswordMutation.mutate(
                values
            );
        };
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


                        <div className="flex items-start gap-6 mb-8  ">
                            <Avatar
                                size={72}
                                src={profileImage}
                                className="bg-blue-100 text-blue-600 font-semibold"
                            >
                                {
                                    !profileImage
                                    &&
                                    initials
                                }
                            </Avatar>

                            <div>
                                <h2 className="text-lg font-semibold">Profile Picture</h2>
                                <p className="text-gray-500 mb-3">
                                    Upload a new profile picture or update your avatar
                                </p>

                                <div className="flex items-center gap-4">
                                    <Upload

                                        showUploadList={false}

                                        beforeUpload={(file) => {

                                            uploadImage(file);

                                            return false;
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            Upload Photo
                                        </Button>
                                    </Upload>


                                    {
                                        profileImage
                                        &&
                                        (
                                            <Button

                                                type="link"

                                                danger

                                                onClick={() => setProfileImage("")}
                                            >
                                                Remove
                                            </Button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                        <Form
                            layout="vertical"
                            form={profileForm}
                            onFinish={handleProfileUpdate}
                        >
                            <Form.Item
                                label={<span className="font-[Outfit] ">Full Name </span>}
                                name="fullName"
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-[Outfit] ">Email Address</span>}
                                name="email"
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-[Outfit] ">Phone Number </span>}
                                name="phone"
                                rootClassName=' '
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    size="large"
                                    className="rounded-lg font-[outfit] "
                                />
                            </Form.Item>


                            <div className="flex gap-4 mt-6">
                                <Button
                                    type="primary"
                                    htmlType="submit"

                                    size="large"

                                    loading={updateProfileMutation.isPending}

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
                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Change Password</h2>
                        <p className="text-gray-500 text-sm">
                            Update your password to keep your account secure
                        </p>
                    </div>



                    <Form
                        layout="vertical"
                        form={passwordForm}
                        onFinish={
                            handlePasswordChange
                        }
                    >

                        <Form.Item

                            label={<span className="font-[Outfit] ">Current Password</span>}

                            name="currentPassword"

                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Enter current password"
                                }
                            ]}
                        >

                            <Input.Password
                                prefix={<LockOutlined />}
                                size="large"
                            />

                        </Form.Item>

                        <Form.Item

                            label={<span className="font-[Outfit] ">New Password </span>}

                            name="newPassword"

                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Enter new password"
                                }
                            ]}
                        >

                            <Input.Password
                                prefix={<LockOutlined />}
                                size="large"
                            />

                        </Form.Item>

                        <Form.Item

                            label={<span className="font-[Outfit] ">Confirm Password </span>}

                            name="confirmPassword"

                            dependencies={[
                                "newPassword"
                            ]}

                            rules={[

                                {
                                    required: true,
                                    message:
                                        "Confirm password"
                                },

                                ({ getFieldValue }) => ({

                                    validator(_, value) {

                                        if (
                                            !value
                                            ||
                                            getFieldValue(
                                                "newPassword"
                                            ) === value
                                        ) {

                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            "Passwords do not match"
                                        );
                                    }
                                })
                            ]}
                        >

                            <Input.Password
                                prefix={<LockOutlined />}
                                size="large"
                            />

                        </Form.Item>

                        <Button

                            type="primary"

                            htmlType="submit"

                            loading={
                                changePasswordMutation.isPending
                            }

                            className="rounded-full px-6"
                        >
                            Update Password
                        </Button>

                    </Form>
                </Card>
                </div>
            )
            }
        </div >
    )
}

export default SettingEmp
