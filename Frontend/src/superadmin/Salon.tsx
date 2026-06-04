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
import { useNavigate } from 'react-router-dom';
import SalonFormDrawer from "../components/SalonFormDrawer";
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



    const [allApproved, setAllApproved] = useState([]);
    const [allDeactivated, setAllDeactivated] = useState([]);
    const navigate = useNavigate();
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/approved-salons")
    //         .then(res => {
    //             setapprovedsalons(res.data.data);
    //             setAllApproved(res.data.data);
    //         });

    //     axios.get("http://localhost:3001/auth/deactive-salons")
    //         .then(res => {
    //             setdeactivatedsalons(res.data.data);
    //             setAllDeactivated(res.data.data);
    //         });

    // }, []);
    const handleSearch = (value: string) => {
        const search = value.toLowerCase();

        if (!search) {
            setapprovedsalons(allApproved);
            setDeactive(allDeactivated);
            return;
        }

        const filterLogic = (salon: any) =>
            salon.salonName?.toLowerCase().includes(search) ||
            salon.ownerName?.toLowerCase().includes(search) ||
            salon.salonAddress?.toLowerCase().includes(search) ||
            salon.city?.toLowerCase().includes(search) ||
            salon.email?.toLowerCase().includes(search) ||
            salon.phone?.toString().includes(search);

        const filteredApproved = allApproved.filter(filterLogic);
        const filteredDeactivated = allDeactivated.filter(filterLogic);

        setapprovedsalons(filteredApproved);
        setDeactive(filteredDeactivated);;
    };
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/approved-salons").then(res => {
    //         setapprovedsalons(res.data.data);
    //         console.log(res.data.data)
    //     }).catch(err => {
    //         console.log(err)

    //     })
    // }, [])
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/deactive-salons").then(res => {
    //         setDeactive(res.data.data);
    //         console.log(res.data.data)
    //     }).catch(err => {
    //         console.log(err)

    //     })
    // }, [])
    const fetchAllSalons = async () => {

        try {

            const res = await axios.get(
                "https://localhost:7074/api/auth/getallsalons"
            );
            console.log("SALONS:", res.data);
            const allSalons = res.data;

            const approved = allSalons.filter(
                (salon: any) =>
                    salon.status === "approved" &&
                    salon.isActive === "active"
            );

            const deactiveSalons = allSalons.filter(
                (salon: any) =>
                    salon.status === "approved" &&
                    salon.isActive === "deactive"
            );

            setapprovedsalons(approved);

            setAllApproved(approved);

            setDeactive(deactiveSalons);

            setAllDeactivated(deactiveSalons);

        } catch (err) {

            console.log(err);

        }
    };
    useEffect(() => {
        fetchAllSalons();
    }, []);

    // const handleMenuClick = (key: string, id: string) => {
    //     if (key === "deactivate") {
    //         deactivateSalonHandler(id);
    //     }

    //     if (key === "edit") {
    //         setEditingSalon(salon);
    //         setOpen(true);
    //     }
    //     if (key === "active") {
    //         activateSalonHandler(id);
    //     }

    // };
    const handleMenuClick = (
        key: string,
        id: string,
        salon?: any
    ) => {

        if (key === "deactivate") {
            deactivateSalonHandler(id);
        }

        if (key === "active") {
            activateSalonHandler(id);
        }

        if (key === "edit") {
            setEditingSalon(salon);
            setOpen(true);
        }
    };
    const deactivateSalonHandler = async (id: string) => {
        try {
            const res = await axios.put(`https://localhost:7074/api/auth/deactivate/${id}`);
            message.success(res.data.message);

            fetchAllSalons();

        } catch {
            message.error("Failed to deactivate");
        }
    };
    const activateSalonHandler = async (id: string) => {
        try {
            const res = await axios.put(`https://localhost:7074/api/auth/activate/${id}`);
            message.success(res.data.message);

            fetchAllSalons();

        } catch {
            message.error("Failed to deactivate");
        }
    };
    const [open, setOpen] = useState(false);
    const [editingSalon, setEditingSalon] = useState<any>(null);
    const handleSalonSubmit = async (
        values: any
    ) => {

        try {

            if (editingSalon) {

                await axios.put(
                    `https://localhost:7074/api/auth/updatesalon/${editingSalon.id}`,
                    values
                );

                message.success(
                    "Salon Updated Successfully"
                );

            } else {

                await axios.post(
                    "https://localhost:7074/api/auth/createsalonbyadmin",
                    values
                );

                message.success(
                    "Salon Created Successfully"
                );
            }

            setOpen(false);
            setEditingSalon(null);

            fetchAllSalons();

        } catch (error) {

            message.error(
                "Something went wrong"
            );
        }
    };
    return (
        <div>
            <SalonFormDrawer
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingSalon(null);
                }}
                initialValues={editingSalon}
                onSubmit={handleSalonSubmit}
            />
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
                        {approvedsalons.length + deactive.length}
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
                            {approvedsalons.length}
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
                                (total, salon: any) =>
                                    total + (salon.staffCount || 0),
                                0
                            )}
                        </h2>
                    </div>

                </div>
                <div className=" lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">

                    <div className="">
                        <p className="text-gray-500">Total Revenue</p>
                        <h2 className="text-3xl font-semibold text-green-500 mt-2">
                            ₹{
                                approvedsalons.reduce(
                                    (total, salon: any) =>
                                        total + (salon.revenue || 0),
                                    0
                                )
                            }
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
                                    <h2 className="text-xl font-semibold">{salon.salonName}</h2>
                                    <Tag color="green" className="rounded-full px-3">
                                        Active
                                    </Tag>
                                </div>

                                <div className="flex items-center gap-4 text-gray-500 mt-2">
                                    <span className="flex items-center gap-1">
                                        <EnvironmentOutlined />{salon.city}
                                    </span>
                                    <span>Joined: {new Date(salon.
                                        createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Dropdown
                                menu={{
                                    items: [
                                        { key: "edit", label: "Edit" },
                                        { key: "deactivate", label: "Deactivate" },
                                    ],
                                    onClick: ({ key }) => handleMenuClick(key, salon.id, salon)
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                        </div>


                        <div className="bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium">{salon.ownerName}</p>

                                <p className="text-gray-500 mt-4">Email</p>
                                <p>{salon.email}</p>

                                <p className="text-gray-500 mt-4">Address</p>
                                <p>{salon.salonAddress}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p>{salon.phone}</p>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <StatBox
                                icon={<UserOutlined />}
                                value={salon.staffCount || 0}
                                label="Staff"
                                bg="bg-blue-50"
                                color="text-blue-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value={salon.services?.length || 0}
                                label="Services"
                                bg="bg-yellow-50"
                                color="text-yellow-600"
                            />
                            <StatBox
                                icon={<CalendarOutlined />}
                                value={salon.bookingCount || 0}
                                label="Bookings"
                                bg="bg-indigo-50"
                                color="text-indigo-600"
                            />
                            <StatBox
                                icon={<DollarOutlined />}
                                value={`₹${salon.revenue || 0}`}
                                label="Revenue"
                                bg="bg-green-50"
                                color="text-green-600"
                            />
                        </div>


                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            className="w-full mt-6 rounded-full h-8 text-sm"
                            onClick={() =>
                                navigate(
                                    `/superadmin/salon-details/${salon.id}`
                                )
                            }
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
                                    <h2 className="text-xl font-semibold">{salon.salonName}</h2>
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
                                    onClick: ({ key }) => handleMenuClick(key, salon.id)
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                        </div>


                        <div className="bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium">{salon.ownerName}</p>

                                <p className="text-gray-500 mt-4">Email</p>
                                <p>{salon.email}</p>

                                <p className="text-gray-500 mt-4">Address</p>
                                <p>{salon.salonAddress}</p>
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
                                // value={salon.services.length}
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
