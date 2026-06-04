import { message, Segmented } from "antd";
import React, { useEffect, useState } from "react";

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
    LockOutlined,
} from "@ant-design/icons";

import axios from "axios";

const SettingSalon = () => {

    const [form] = Form.useForm();
    const [profileForm] = Form.useForm();

    const [passwordForm] = Form.useForm();

    const [tab, setTab] =
        useState<"profile" | "password">(
            "profile"
        );

    const [loading, setLoading] =
        useState(false);

    const [loadingProfile,
        setLoadingProfile]
        = useState(false);

    const [profileImage,
        setProfileImage]
        = useState("");

    const [initials,
        setInitials]
        = useState("");
    useEffect(() => {

        const getProfile = async () => {

            try {

                const authData = JSON.parse(
                    localStorage.getItem("persist:auth")!
                );

                const user = JSON.parse(authData.user);

                const salonId = user.salonId;

                const res = await axios.get(
                    `https://localhost:7074/api/auth/getsalonprofile/${salonId}`
                );
                console.log(res.data);

                const data = res.data.data;

                console.log(data);

                profileForm.setFieldsValue({
                    fullName: data.ownerName,
                    email: data.email,
                    phone: data.phone,
                });

                setProfileImage(data.profileImage || "");

                setInitials(
                    data.ownerName
                        ?.split(" ")
                        ?.map((word) => word[0])
                        ?.join("")
                        ?.toUpperCase()
                );

            } catch (err) {

                console.log(err);
            }
        };

        getProfile();

    }, [form]);


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


    const handleProfileUpdate =
        async (values: any) => {

            setLoadingProfile(true);

            try {

                const authData =
                    JSON.parse(
                        localStorage.getItem(
                            "persist:auth"
                        )!
                    );

                const user =
                    JSON.parse(
                        authData.user
                    );

                const salonId =
                    user.salonId;

                const res =
                    await axios.put(

                        `https://localhost:7074/api/auth/updatesalonprofile/${salonId}`,

                        {
                            OwnerName:
                                values.fullName,

                            email:
                                values.email,

                            phone:
                                values.phone,

                            profileImage:
                                profileImage
                        }
                    );

                if (res.data.success) {

                    message.success(
                        "Profile updated successfully"
                    );
                }

            } catch (error: any) {

                console.log(error);

                message.error(
                    error?.response?.data?.message
                    ||
                    "Something went wrong"
                );

            } finally {

                setLoadingProfile(false);
            }
        };


    const handlePasswordChange =
        async (values: any) => {

            setLoading(true);

            try {

                const authData =
                    JSON.parse(
                        localStorage.getItem(
                            "persist:auth"
                        )!
                    );

                const user =
                    JSON.parse(
                        authData.user
                    );

                const salonId =
                    user.salonId;

                const res =
                    await axios.put(

                        `https://localhost:7074/api/auth/changesalonpassword/${salonId}`,

                        values
                    );

                if (res.data.success) {

                    message.success(
                        "Password updated successfully"
                    );

                    passwordForm.resetFields();
                }

            } catch (error: any) {

                console.log(error);

                message.error(
                    error?.response?.data?.message
                    ||
                    "Something went wrong"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div>



            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3">

                <div className="pt-3">

                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        Setting
                    </h1>

                    <p className="text-gray-500 text-sm mt-0">
                        Manage your Profile
                    </p>

                </div>

            </div>

            <hr />



            <div className="m-6 ">

                <Segmented

                    value={tab}

                    onChange={(val) =>
                        setTab(
                            val as
                            "profile"
                            | "password"
                        )
                    }

                    options={[

                        {
                            label: "Profile",
                            value: "profile",
                        },

                        {
                            label: "Password",
                            value: "password",
                        },
                    ]}

                    className="rounded-lg bg-gray-100 w-[16%] font-[Outfit] p-1"
                />

            </div>



            {
                tab === "profile"
                &&
                (
                    <div className="font-[Outfit] m-6 mt-0">

                        <Card
                            className="rounded-2xl border"
                            bodyStyle={{
                                padding: 32
                            }}
                        >



                            <div className="flex items-start gap-6 mb-8">

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

                                    <h2 className="text-lg font-semibold">
                                        Profile Picture
                                    </h2>

                                    <p className="text-gray-500 mb-3">
                                        Upload a new profile picture
                                    </p>

                                    <div className="flex items-center gap-4">

                                        <Upload

                                            showUploadList={false}

                                            beforeUpload={(file) => {

                                                uploadImage(file);

                                                return false;
                                            }}
                                        >

                                            <Button
                                                icon={
                                                    <UploadOutlined />
                                                }
                                            >
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

                                                    onClick={() =>
                                                        setProfileImage("")
                                                    }
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

                                onFinish={
                                    handleProfileUpdate
                                }
                            >

                                <Form.Item

                                    name="fullName"

                                    label="Full Name"

                                    rules={[

                                        {
                                            required: true,
                                            message:
                                                "Name is required"
                                        },

                                        {
                                            min: 3,
                                            message:
                                                "Minimum 3 characters required"
                                        }
                                    ]}
                                >

                                    <Input
                                        prefix={<UserOutlined />}
                                        size="large"
                                    />

                                </Form.Item>

                                <Form.Item

                                    name="email"

                                    label="Email Address"

                                    rules={[

                                        {
                                            required: true,
                                            message:
                                                "Email is required"
                                        },

                                        {
                                            type: "email",
                                            message:
                                                "Enter valid email"
                                        }
                                    ]}
                                >

                                    <Input
                                        prefix={<MailOutlined />}
                                        size="large"
                                    />

                                </Form.Item>

                                <Form.Item

                                    name="phone"

                                    label="Phone Number"

                                    rules={[

                                        {
                                            required: true,
                                            message:
                                                "Phone is required"
                                        },

                                        {
                                            pattern:
                                                /^[0-9]{10}$/,

                                            message:
                                                "Enter valid 10 digit number"
                                        }
                                    ]}
                                >

                                    <Input
                                        prefix={<PhoneOutlined />}
                                        size="large"
                                    />

                                </Form.Item>

                                <div className="flex gap-4 mt-6">

                                    <Button

                                        type="primary"

                                        htmlType="submit"

                                        size="large"

                                        loading={loadingProfile}

                                        className="rounded-full px-8"
                                    >
                                        Save Changes
                                    </Button>

                                </div>

                            </Form>

                        </Card>

                    </div>
                )
            }



            {
                tab === "password"
                &&
                (
                    <div className="m-6 mt-0">

                        <Card
                            className="rounded-2xl border"
                            bodyStyle={{
                                padding: 28
                            }}
                        >

                            <div className="mb-6">

                                <h2 className="text-lg font-semibold">
                                    Change Password
                                </h2>

                                <p className="text-gray-500 text-sm">
                                    Update your password
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

                                    label="Current Password"

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

                                    label="New Password"

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

                                    label="Confirm Password"

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

                                    loading={loading}

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
    );
};

export default SettingSalon;