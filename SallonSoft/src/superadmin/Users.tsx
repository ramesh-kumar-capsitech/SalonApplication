import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Divider, Input, Segmented } from 'antd'
import { Card, Avatar, Tag } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
interface InfoRowProps {
    icon: React.ReactNode;
    text: string;
}
import React, { useEffect, useState } from 'react'
import axios from 'axios';
interface InfoRowProps {
    icon: React.ReactNode;
    text: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
    return (
        <div className="flex items-center gap-3 text-gray-700">
            <span className="text-gray-500 text-lg">{icon}</span>
            <span>{text}</span>
        </div>
    );
};

const Users = () => {
    const [allApproved, setAllApproved] = useState([]);
    const [allDeactive, setAllDeactive] = useState([]);
    const [tab, settab] = useState<"admins" | "customers">("admins")
    const [approvedsalons, setapprovedsalons] = React.useState([]);
    const [deactive, setDeactive] = React.useState([]);
    const [users, setusers] = React.useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [username, setusername] = React.useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/auth/approved-salons").then(res => {
            setapprovedsalons(res.data.data);
            const salonsWithInitials = res.data.data.map((salon: any) => ({
                ...salon,
                initials: salon.ownername
                    ?.split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .toUpperCase() ?? ''
            }));
            setapprovedsalons(salonsWithInitials);
            setAllApproved(salonsWithInitials);
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)

        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:3001/auth/deactive-salons").then(res => {
            setDeactive(res.data.data);
            const deactiveWithInitials = res.data.data.map((salon: any) => ({
                ...salon,
                initials: salon.ownername
                    ?.split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .toUpperCase() ?? ''
            }));

            setDeactive(deactiveWithInitials);
            setAllDeactive(deactiveWithInitials);
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)

        })
    }, [])
    useEffect(() => {
        axios.get(" http://localhost:3001/auth/users").then(res => {
            setusers(res.data.data);
            const usersWithInitials = res.data.data.map((user: any) => ({
                ...user,
                initials: user.name
                    ?.split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .toUpperCase() ?? ''
            }));

            setusers(usersWithInitials);
            setAllUsers(usersWithInitials);
        }).catch(err => {
            console.log(err)
        }
        )
    }, [])
    // const handleSearch = (value: string) => {

    //     const search = value.toLowerCase();

    //     if (!search) {

    //         setapprovedsalons(allApproved);
    //         setDeactive(allDeactivated);
    //         return;
    //     }

    //     const filterLogic = (salon: any) =>
    //         salon.salonname?.toLowerCase().includes(search) ||
    //         salon.ownername?.toLowerCase().includes(search) ||
    //         salon.salonaddress?.toLowerCase().includes(search) ||
    //         salon.email?.toLowerCase().includes(search) ||
    //         salon.phone?.includes(search);

    //     const filteredApproved = allApproved.filter(filterLogic);
    //     const filteredDeactivated = allDeactivated.filter(filterLogic);

    //     setapprovedsalons(filteredApproved);
    //     setDeactive(filteredDeactivated);
    // };
    const handleSearch = (value: string) => {

        const search = value.toLowerCase();

        if (!search) {
            setusers(allUsers);
            return;
        }

        const filtered = allUsers.filter((user: any) => {

            return (
                user.name?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.mobile?.includes(search) ||
                user.initials?.toLowerCase().includes(search)
            );
        });

        setusers(filtered);
    };
    const handleAdminSearch = (value: string) => {

        const search = value.toLowerCase();

        if (!search) {
            setapprovedsalons(allApproved);
            setDeactive(allDeactive);
            return;
        }

        const filterLogic = (salon: any) =>
            salon.ownername?.toLowerCase().includes(search) ||
            salon.salonname?.toLowerCase().includes(search) ||
            salon.email?.toLowerCase().includes(search) ||
            salon.phone?.includes(search) ||
            salon.salonaddress?.toLowerCase().includes(search) ||
            salon.initials?.toLowerCase().includes(search);

        setapprovedsalons(allApproved.filter(filterLogic));
        setDeactive(allDeactive.filter(filterLogic));
    };
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
            <div className='m-6 grid lg:flex gap-6 '>
                <div className="lg:w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <TeamOutlined className='text-blue-500' />
                        </div>


                    </div>


                    <div className="">
                        <p className="text-gray-500 m-0">Active Salon Admin</p>
                        <h2 className="text-2xl font-semibold text-gray-900 m-0  ">
                            {approvedsalons.length}
                        </h2>
                    </div>

                </div>
                <div className="lg:w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <UserOutlined className='text-green-500' />
                        </div>


                    </div>


                    <div className="">
                        <p className="text-gray-500 m-0">Customers</p>
                        <h2 className="text-2xl font-semibold text-gray-900 m-0  ">
                            {users.length}
                        </h2>
                    </div>

                </div>
                <div className="lg:w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <UserOutlined className='text-orange-500' />
                        </div>


                    </div>


                    <div className="">
                        <p className="text-gray-500 m-0">Total Users</p>
                        <h2 className="text-2xl font-semibold text-gray-900 m-0  ">
                            {approvedsalons.length + users.length + deactive.length}
                        </h2>
                    </div>

                </div>
            </div>
            <div>
                <Segmented
                    block

                    value={tab}
                    onChange={(val) => settab(val as "admins" | "customers")}
                    options={[
                        {
                            label: `Salon Admins (${approvedsalons.length + deactive.length})`,
                            value: 'admins',
                        },
                        {
                            label: `Customers (${users.length})`,
                            value: 'customers',
                        },
                    ]}
                    className="rounded-lg bg-gray-100 md:w-[40%]  font-[Outfit]  p-1 m-6 mt-0"
                />
            </div>
            {tab === "admins" && (
                <div>
                    <div className='m-6 mt-0 md:w-[40%] '>
                        <Input placeholder="Search Salon admins" className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' onChange={(e) => handleAdminSearch(e.target.value)} />
                    </div>



                    <div className='grid md:grid-cols-2 gap-6 m-6 mt-0'>
                        {approvedsalons.map((salon: any) => (
                            <Card className="rounded-2xl border " bodyStyle={{ padding: 24 }}>


                                <div className="flex items-start gap-4">
                                    <Avatar
                                        size={56}
                                        className="bg-blue-100 text-blue-600 font-semibold"
                                    >
                                        {salon.initials}
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-semibold">{salon.ownername}</h2>
                                            <Tag color="blue" className="rounded-full">
                                                Admin
                                            </Tag>
                                        </div>

                                        <p className="text-gray-500">Owner of {salon.salonname}</p>

                                        <Tag color="green" className="mt-2 rounded-full px-3">
                                            Active
                                        </Tag>
                                    </div>
                                </div>


                                <div className="bg-gray-50 rounded-xl p-5 mt-6 space-y-3">
                                    <InfoRow
                                        icon={<MailOutlined />}
                                        text={salon.email}
                                    />
                                    <InfoRow
                                        icon={<PhoneOutlined />}
                                        text={salon.phone}
                                    />
                                    <InfoRow
                                        icon={<EnvironmentOutlined />}
                                        text={salon.salonaddress}
                                    />
                                    <InfoRow
                                        icon={<CalendarOutlined />}
                                        text={`Joined: ${new Date(salon.approvedAt).toLocaleDateString()
                                            }`}
                                    />
                                </div>

                            </Card>
                        ))}

                        {deactive.map((salon: any) => (
                            <Card className="rounded-2xl border  " bodyStyle={{ padding: 24 }}>


                                <div className="flex items-start gap-4">
                                    <Avatar
                                        size={56}
                                        className="bg-blue-100 text-blue-600 font-semibold"
                                    >
                                        {salon.initials}
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-semibold">{salon.ownername}</h2>
                                            <Tag color="blue" className="rounded-full">
                                                Admin
                                            </Tag>
                                        </div>

                                        <p className="text-gray-500">Owner of {salon.salonname}</p>

                                        <Tag color="yellow" className="mt-2 rounded-full px-3">
                                            Deactive
                                        </Tag>
                                    </div>
                                </div>


                                <div className="bg-gray-50 rounded-xl p-5 mt-6 space-y-3">
                                    <InfoRow
                                        icon={<MailOutlined />}
                                        text={salon.email}
                                    />
                                    <InfoRow
                                        icon={<PhoneOutlined />}
                                        text={salon.phone}
                                    />
                                    <InfoRow
                                        icon={<EnvironmentOutlined />}
                                        text={salon.salonaddress}
                                    />
                                    <InfoRow
                                        icon={<CalendarOutlined />}
                                        text={`Joined: ${new Date(salon.approvedAt).toLocaleDateString()
                                            }`}
                                    />
                                </div>

                            </Card>
                        ))}



                    </div>
                </div>
            )}
            {tab === "customers" && (


                <div>
                    <div className='m-6 mt-0 md:w-[40%] '>
                        <Input onChange={(e) => handleSearch(e.target.value)} allowClear placeholder="Search Customers" className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' />
                    </div>


                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 m-6 mt-0'>
                        {users.map((user: any) => (
                            <Card
                                className="rounded-2xl border"
                                bodyStyle={{ padding: 24 }}
                            >

                                <div className="flex items-start gap-4">
                                    <Avatar
                                        size={56}
                                        className="bg-green-100 text-green-600 font-semibold"
                                    >
                                        {user.initials}
                                    </Avatar>

                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold m-0">
                                            {user.name}
                                        </h2>

                                        <Tag color="green" className="rounded-full mt-1">
                                            Active
                                        </Tag>
                                    </div>
                                </div>


                                <div className="mt-5 space-y-3 text-gray-700">
                                    <div className="flex items-center gap-3">
                                        <MailOutlined className="text-gray-500" />
                                        <span>{user.email}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <PhoneOutlined className="text-gray-500" />
                                        <span>{user.mobile}</span>
                                    </div>
                                </div>

                                <Divider className="my-5" />

                                {/* STATS */}
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm m-0">
                                            Total Bookings
                                        </p>
                                        <h3 className="text-xl font-[outfit] font-semibold text-blue-600 m-0">
                                            0
                                        </h3>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-gray-500 text-sm m-0">
                                            Last Booking
                                        </p>
                                        <h3 className="font-medium font-[outfit] m-0">
                                            ~
                                        </h3>
                                    </div>
                                </div>
                            </Card>
                        ))
                        }




                    </div>
                </div>
            )}
        </div>
    )
}

export default Users
