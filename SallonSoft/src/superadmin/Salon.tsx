import { Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, Tag, Button, Dropdown } from "antd";
import {
    EnvironmentOutlined,
    EyeOutlined,
    MoreOutlined,
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import axios from 'axios';

const StatBox = ({ icon, value, label, bg, color }: any) => (
    <div className={`${bg} rounded-lg p-1 text-center`}>
        <div className={`text-2xl ${color} mb-2`}>{icon}</div>
        <p className={`font-semibold  text-lg ${color}`}>{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
    </div>
);

const Salon = () => {
    const [approvedsalons, setapprovedsalons] = React.useState([]);
    const [Approved, setApproved] = React.useState([]);
    const [deactive, setDeactive] = React.useState([]);

    const [deactivatedsalons, setdeactivatedsalons] = useState([]);

    const [allApproved, setAllApproved] = useState([]);
    const [allDeactivated, setAllDeactivated] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/auth/approved-salons")
            .then(res => {
                setapprovedsalons(res.data.data);
                setAllApproved(res.data.data);
            });

        axios.get("http://localhost:3001/auth/deactive-salons")
            .then(res => {
                setdeactivatedsalons(res.data.data);
                setAllDeactivated(res.data.data);
            });

    }, []);
    const handleSearch = (value: string) => {

        const search = value.toLowerCase();

        if (!search) {
            // Reset
            setapprovedsalons(allApproved);
            setdeactivatedsalons(allDeactivated);
            return;
        }

        const filterLogic = (salon: any) =>
            salon.salonname?.toLowerCase().includes(search) ||
            salon.ownername?.toLowerCase().includes(search) ||
            salon.salonaddress?.toLowerCase().includes(search) ||
            salon.email?.toLowerCase().includes(search) ||
            salon.phone?.includes(search);

        const filteredApproved = allApproved.filter(filterLogic);
        const filteredDeactivated = allDeactivated.filter(filterLogic);

        setapprovedsalons(filteredApproved);
        setdeactivatedsalons(filteredDeactivated);
    };
    useEffect(() => {
        axios.get("http://localhost:3001/auth/approved-salons").then(res => {
            setapprovedsalons(res.data.data);
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)

        })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:3001/auth/deactive-salons").then(res => {
            setDeactive(res.data.data);
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)

        })
    }, [])

    const handleMenuClick = (key: string, id: string) => {
        if (key === "deactivate") {
            deactivateSalonHandler(id);
        }

        if (key === "edit") {
            console.log("Edit clicked", id);
        }
        if (key === "active") {
            activateSalonHandler(id);
        }

    };
    const deactivateSalonHandler = async (id: string) => {
        try {
            const res = await axios.put(`http://localhost:3001/auth/deactivate/${id}`);
            message.success(res.data.message);

            setApproved(prev =>
                prev.filter((salon: any) => salon._id !== id)
            );

        } catch {
            message.error("Failed to deactivate");
        }
    };
    const activateSalonHandler = async (id: string) => {
        try {
            const res = await axios.put(`http://localhost:3001/auth/activate/${id}`);
            message.success(res.data.message);

            setApproved(prev =>
                prev.filter((salon: any) => salon._id !== id)
            );

        } catch {
            message.error("Failed to deactivate");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[13px] pb-[6px]   ">

                <div className='pt-3'>
                    <h1 className="text-lg leading-[1] m-0 font-semibold text-gray-900">
                        Super Admin Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        Platform-wide analytics and management
                    </p>
                </div>

                <div className=" flex flex-col justify-center items-center">
                    <h1 className="text-lg leading-[0.8] font-semibold text-blue-700">
                        4
                    </h1>
                    <p className="text-gray-500 text-sm ">
                        Total Salon
                    </p>
                </div>
            </div>
            <hr />
            <div>
                <Input placeholder="Search salons by name,owner, or location" className='w-[40%] font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100 m-6  ' onChange={(e) => handleSearch(e.target.value)}
                    allowClear />
            </div>
            <div className=' grid md:grid-cols-2 lg:flex gap-6 m-6 mt-0  '>
                <div className=" lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">

                    <div className="">
                        <p className="text-gray-500">Total Salons</p>
                        <h2 className="text-3xl font-semibold text-blue-700 mt-2">
                            {
                                approvedsalons.length}
                        </h2>
                    </div>

                </div>
                <div className=" lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">

                    <div className="">
                        <p className="text-gray-500">Active salons</p>
                        <h2 className="text-3xl font-semibold text-green-500 mt-2">
                            {approvedsalons.length}
                        </h2>
                    </div>

                </div>
                <div className=" lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">

                    <div className="">
                        <p className="text-gray-500">Total Staff</p>
                        <h2 className="text-3xl font-semibold text-orange-500 mt-2">
                            {approvedsalons.reduce(
                                (total, salon) => total + (salon.staff?.length || 0),
                                0
                            )}
                        </h2>
                    </div>

                </div>
                <div className=" lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">

                    <div className="">
                        <p className="text-gray-500">Total Revenue</p>
                        <h2 className="text-3xl font-semibold text-green-500 mt-2">
                            $0
                        </h2>
                    </div>

                </div>
            </div>
            <div className=' grid lg:grid-cols-2 m-6 gap-6 '>
                {approvedsalons.map((salon: any) => (
                    <Card
                        className="rounded-2xl border"
                        bodyStyle={{ padding: 24 }}
                    >

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold">{salon.salonname}</h2>
                                    <Tag color="green" className="rounded-full px-3">
                                        Active
                                    </Tag>
                                </div>

                                <div className="flex items-center gap-4 text-gray-500 mt-2">
                                    <span className="flex items-center gap-1">
                                        <EnvironmentOutlined />{salon.city}
                                    </span>
                                    <span>Joined: {new Date(salon.
                                        approvedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Dropdown
                                menu={{
                                    items: [
                                        { key: "edit", label: "Edit" },
                                        { key: "deactivate", label: "Deactivate" },
                                    ],
                                    onClick: ({ key }) => handleMenuClick(key, salon._id)
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                        </div>


                        <div className="bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium">{salon.ownername}</p>

                                <p className="text-gray-500 mt-4">Email</p>
                                <p>{salon.email}</p>

                                <p className="text-gray-500 mt-4">Address</p>
                                <p>{salon.salonaddress}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p>{salon.phone}</p>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <StatBox
                                icon={<UserOutlined />}
                                value={salon.staff?.length || 0}
                                label="Staff"
                                bg="bg-blue-50"
                                color="text-blue-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value={`${salon.services.length}`}
                                label="Services"
                                bg="bg-yellow-50"
                                color="text-yellow-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value="0"
                                label="Bookings"
                                bg="bg-indigo-50"
                                color="text-indigo-600"
                            />
                            <StatBox
                                icon={<DollarOutlined />}
                                value="$0"
                                label="Revenue"
                                bg="bg-green-50"
                                color="text-green-600"
                            />
                        </div>


                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            className="w-full mt-6 rounded-full h-8 text-sm"
                        >
                            View Details
                        </Button>
                    </Card>
                ))}
                {deactive.map((salon: any) => (
                    <Card
                        className="rounded-2xl border"
                        bodyStyle={{ padding: 24 }}
                    >

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold">{salon.salonname}</h2>
                                    <Tag color="yellow" className="rounded-full px-3">
                                        Deactive
                                    </Tag>
                                </div>

                                <div className="flex items-center gap-4 text-gray-500 mt-2">
                                    <span className="flex items-center gap-1">
                                        <EnvironmentOutlined />{salon.city}
                                    </span>
                                    <span>Joined: {new Date(salon.
                                        approvedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Dropdown
                                menu={{
                                    items: [
                                        { key: "edit", label: "Edit" },
                                        { key: "active", label: "Active" },
                                    ],
                                    onClick: ({ key }) => handleMenuClick(key, salon._id)
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                        </div>


                        <div className="bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium">{salon.ownername}</p>

                                <p className="text-gray-500 mt-4">Email</p>
                                <p>{salon.email}</p>

                                <p className="text-gray-500 mt-4">Address</p>
                                <p>{salon.salonaddress}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p>{salon.phone}</p>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <StatBox
                                icon={<UserOutlined />}
                                value={salon.staff}
                                label="Staff"
                                bg="bg-blue-50"
                                color="text-blue-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value={salon.services.length}
                                label="Services"
                                bg="bg-yellow-50"
                                color="text-yellow-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value="0"
                                label="Bookings"
                                bg="bg-indigo-50"
                                color="text-indigo-600"
                            />
                            <StatBox
                                icon={<DollarOutlined />}
                                value="$0"
                                label="Revenue"
                                bg="bg-green-50"
                                color="text-green-600"
                            />
                        </div>


                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            className="w-full mt-6 rounded-full h-8 text-sm"
                        >
                            View Details
                        </Button>
                    </Card>
                ))}




            </div>

        </div>
    )
}

export default Salon
