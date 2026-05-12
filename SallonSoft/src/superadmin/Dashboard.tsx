
import { DollarOutlined, ScheduleOutlined, ShopOutlined, TeamOutlined, } from '@ant-design/icons';

import ColumnChart from '@ant-design/plots/es/components/column';
import Line from '@ant-design/plots/es/components/tiny/line';
import { Tag, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import type { Breakpoint } from 'antd';

const Dashboard = () => {

    const lineData = [
        { month: 'Jan', value: 45000 },
        { month: 'Feb', value: 52000 },
        { month: 'Mar', value: 48000 },
        { month: 'Apr', value: 61000 },
        { month: 'May', value: 58000 },
        { month: 'Jun', value: 73000 },
    ];

    const lineConfig = {
        data: lineData,
        xField: 'month',
        yField: 'value',

        smooth: true,
        lineStyle: { lineWidth: 3 },
        point: {
            size: 5,
            shape: 'circle',
        },
        color: '#2563eb',
        yAxis: {
            label: {
                formatter: (v: string) => `${Number(v) / 1000}k`,
            },
        },
    };

    const columnData = [
        { month: 'Jan', value: 45000 },
        { month: 'Feb', value: 51000 },
        { month: 'Mar', value: 48000 },
        { month: 'Apr', value: 60000 },
        { month: 'May', value: 57000 },
        { month: 'Jun', value: 72000 },
    ];

    const columnConfig = {
        data: columnData,
        xField: 'month',
        yField: 'value',
        columnWidthRatio: 0.6,
        color: '#225BE4',
        yAxis: {
            label: {
                formatter: (v: string) => `${Number(v) / 1000}k`,
            },
        },
    };
    const columns = [
        {
            title: "Salon Name",
            dataIndex: "name",
            key: "name",
            responsive: ["xs", "sm", "md", "lg"],
            render: (text: string) => (
                <span className="font-[outfit] text-gray-900">{text}</span>
            ),
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            responsive: ["xs", "sm", "md", "lg"],
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            ),
        },
        {
            title: "Bookings",
            dataIndex: "bookings",
            key: "bookings",
            responsive: ["xs", "sm", "md", "lg"],
        },
        {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
            responsive: ["xs", "sm", "md", "lg"],
            render: (value: string) => (
                <span className="font-medium">{value}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            responsive: ["xs", "sm", "md", "lg"],
            render: (status: string) => (
                <Tag
                    className="px-4 py-1 rounded-full"
                    color={status === "Active" ? "blue" : "gold"}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            responsive: ["xs", "sm", "md", "lg"],
            render: () => (
                <a className="text-blue-600 font-medium hover:underline">
                    View Details
                </a>
            ),
        },
    ];


    const [approvedsalons, setapprovedsalons] = useState([]);
    const [users, setusers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allApproved, setAllApproved] = useState([]);
    const [deactive, setDeactive] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:3001/auth/approved-salons").then(res => {
            setapprovedsalons(res.data.data);
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
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)

        })
    }, [])

    // const handleMenuClick = (key: string, id: string) => {
    //     if (key === "deactivate") {
    //         deactivateSalonHandler(id);
    //     }

    //     if (key === "edit") {
    //         console.log("Edit clicked", id);
    //     }
    //     if (key === "active") {
    //         activateSalonHandler(id);
    //     }

    // };
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
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/auth/totalbookings").then(res => {
            setBookings(res.data.data);
            console.log(res.data.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])



    const totalrevenue = bookings
        .filter((booking) => booking.status === "Completed")
        .reduce((total, booking) => total + booking.totalPrice, 0);
    const tableData = approvedsalons.map((salon, index) => {


        const salonBookings = bookings.filter(
            (b) => b.salonId === salon._id
        );


        const totalBookings = salonBookings.length;


        const revenue = salonBookings
            .filter((b) => b.status === "Completed")
            .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

        return {
            key: index,
            name: salon.salonname,
            city: salon.city,
            bookings: totalBookings,
            revenue: `$${revenue}`,
            status: "Active"
        };
    });
    return (


        <div className=' ' >
            <div className="flex-1  ">

                <div className="md:flex items-center justify-between px-3 py-[13px]   ">
                    <div>
                        <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                            Super Admin Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Platform-wide analytics and management
                        </p>
                    </div>

                    <Link to="/applysalon">  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-sm hover:bg-blue-700 transition">
                        Add New Salon
                    </button>
                    </Link>

                </div>

                <hr />


            </div>
            <div className=' grid md:grid-cols-2 lg:flex md:justify-evenly w-full gap-6 px-6 my-6 '>
                <div className="  lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                    <div className=" flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <ShopOutlined className="text-blue-600" />
                        </div>

                        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            ↑ 7.2%
                        </span>
                    </div>


                    <div className="mt-6">
                        <p className="text-gray-500">Total Salons</p>
                        <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                            {approvedsalons.length}
                        </h2>
                    </div>

                </div>
                <div className="lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <TeamOutlined className="text-green-600" />

                        </div>

                        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            ↑ 7.2%
                        </span>
                    </div>


                    <div className="mt-6">
                        <p className="text-gray-500">Active Users</p>
                        <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                            {users.length}
                        </h2>
                    </div>

                </div>
                <div className="lg:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <ScheduleOutlined className="text-yellow-600" />
                        </div>

                        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            ↑ 7.2%
                        </span>
                    </div>


                    <div className="mt-6">
                        <p className="text-gray-500">Total Bookings</p>
                        <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                            {bookings.length}
                        </h2>
                    </div>

                </div>
                <div className="md:w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                    <div className="flex items-start justify-between">

                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">

                            <DollarOutlined className="text-orange-600" />
                        </div>

                        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            ↑ 7.2%
                        </span>
                    </div>


                    <div className="mt-6">
                        <p className="text-gray-500">Revenue</p>
                        <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                            ${totalrevenue.toFixed(2)}
                        </h2>
                    </div>

                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-3">

                    <div className="bg-white rounded-2xl border p-6   ">
                        <h2 className="text-xl font-semibold">Revenue Overview</h2>
                        <p className="text-gray-500 mb-6">Monthly revenue trends</p>

                        <Line {...lineConfig} />
                    </div>

                    <div className="bg-white rounded-2xl border p-6">
                        <h2 className="text-xl font-semibold">Booking Analytics</h2>
                        <p className="text-gray-500 mb-6">Monthly booking statistics</p>
                        <ColumnChart {...columnConfig} />
                    </div>

                </div>
            </div>
            <div className="bg-white rounded-2xl border m-6 p-6 ">

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Top Performing Salons
                    </h2>
                    <p className="text-gray-500">
                        Salons ranked by bookings and revenue
                    </p>
                </div>


                <Table
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={tableData}
                    pagination={false}
                />
            </div>
        </div >




    )
}

export default Dashboard
