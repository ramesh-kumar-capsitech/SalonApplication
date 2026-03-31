import { Segmented } from 'antd'
import React, { useEffect, useState } from 'react'
import { Card, Avatar, Tag, Button, Dropdown, message } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ScissorOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import {

    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import axios from 'axios';
interface InfoRowProps {
    icon: React.ReactNode;
    text: string;
}


const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
    return (
        <div className="flex items-center gap-3 text-gray-700">
            <span className="text-gray-500">{icon}</span>
            <span>{text}</span>
        </div>
    );
};
interface InfoBlockProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, icon }) => {

    return (
        <div>
            <p className="text-gray-500 mb-1">{label}</p>
            <div className="flex items-center gap-2 text-gray-900">
                {icon && <span className="text-blue-600">{icon}</span>}
                <span>{value}</span>
            </div>
        </div>
    );
};

const StaffSalon = () => {
    const [tab, settab] = useState<"activestaff" | "request">("activestaff")
    const [Requests, setRequests] = useState([])
    const [approvereq, setapprovereq] = useState([])
    const salonId = localStorage.getItem("salonId")

    useEffect(() => {

        axios.get(`http://localhost:3001/auth/salon-job-requests/${salonId}`)
            .then(res => {
                setRequests(res.data.data)
            })

    }, [])
    useEffect(() => {

        axios.get(`http://localhost:3001/auth/job-active-staff/${salonId}`)
            .then(res => {
                setapprovereq(res.data.data)
            })

    }, [])
    // const [jobapplication, setjobapplication] = useState([])
    const handleApprove = async (id: string) => {

        try {
            await axios.put(`http://localhost:3001/auth/approve/jobapplication/${id}`);

            message.success("JobApplication approved successfully!");
            setRequests(prev =>
                prev.filter((req: any) => req._id !== id)
            );

        } catch (error) {
            console.log(error);
        }
    };
    const handleReject = async (id: string) => {
        await axios.put(`http://localhost:3001/auth/reject-application/${id}`, {
            reason: "Incomplete documents"
        });
        message.success("Application rejected successfully!");
        setRequests(prev =>
            prev.filter((req: any) => req._id !== id)
        );
    };
    return (

        <div>

            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3   ">
                <div className='pt-3'>
                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        Staff Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        Manage staff and new request
                    </p>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-sm hover:bg-blue-700 transition">
                    Add Staff Member
                </button>


            </div>
            <hr />
            <div className='m-6 flex gap-6 '>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">





                    <div className="">
                        <p className="text-gray-500 m-0">Total Staff</p>
                        <h2 className="text-2xl font-semibold text-blue-700 m-0  ">
                            100
                        </h2>
                    </div>

                </div>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">





                    <div className="">
                        <p className="text-gray-500 m-0">Active Today</p>
                        <h2 className="text-2xl font-semibold text-green-500 m-0  ">
                            10
                        </h2>
                    </div>

                </div>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">



                    <div className="">
                        <p className="text-gray-500 m-0">Pending Request</p>
                        <h2 className="text-2xl font-semibold text-orange-500 m-0  ">
                            1
                        </h2>
                    </div>

                </div>
            </div>
            <div>
                <Segmented
                    value={tab}
                    onChange={(val) => settab(val as "activestaff" | "request")}
                    options={[
                        {
                            label: `Active Staff (${approvereq.length})`,
                            value: 'activestaff',
                        },
                        {
                            label: `Pending Request (${Requests.length})`,
                            value: 'request',
                        },
                    ]}
                    className="rounded-lg bg-gray-100 w-[26%] font-[Outfit]  p-1 m-6 mt-0"
                />
            </div>
            {
                tab === "activestaff" && (
                    <div className='grid grid-cols-2 gap-6 m-6 mt-0'>
                        {approvereq.map((appreq: any) => (
                            <Card
                                className="rounded-2xl border font-[Outfit]"
                                bodyStyle={{ padding: 24 }}
                            >
                                {/* HEADER */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            size={48}
                                            className="bg-blue-100 text-blue-600 font-semibold"
                                        >
                                            {appreq.name?.split(" ").map((w: any) => w[0]).join("").toUpperCase()}
                                        </Avatar>

                                        <div>
                                            <h2 className="font-semibold m-0">{appreq.name}</h2>
                                            <p className="text-gray-500 text-sm m-0">
                                                {appreq.roleo}
                                            </p>

                                            <div className="flex gap-2 mt-1">
                                                <Tag color="green" className="rounded-full">
                                                    Active
                                                </Tag>
                                                <Tag color="blue" className="rounded-full">
                                                    Available
                                                </Tag>
                                            </div>
                                        </div>
                                    </div>

                                    <Dropdown
                                        menu={{
                                            items: [
                                                { key: "1", label: "Edit Profile" },
                                                { key: "2", label: "Deactivate" },
                                            ],
                                        }}
                                    >
                                        <Button
                                            type="text"
                                            icon={<MoreOutlined />}
                                        />
                                    </Dropdown>
                                </div>

                                {/* INFO */}
                                <div className="bg-gray-50 rounded-xl p-4 mt-5 space-y-3 text-sm">
                                    <InfoRow
                                        icon={<MailOutlined />}
                                        text={appreq.email}
                                    />
                                    <InfoRow
                                        icon={<PhoneOutlined />}
                                        text={appreq.phone}
                                    />
                                    <InfoRow
                                        icon={<ScissorOutlined />}
                                        text={appreq.skills + ","}
                                    />
                                    <InfoRow
                                        icon={<CalendarOutlined />}
                                        text={`Joined: ${new Date(appreq.createdAt).toLocaleDateString()}`}
                                    />
                                </div>

                                {/* STATS */}
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <h3 className="text-xl font-semibold text-blue-600">
                                            8
                                        </h3>
                                        <p className="text-gray-500 text-sm m-0">
                                            Today's Bookings
                                        </p>
                                    </div>

                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <h3 className="text-xl font-semibold text-green-600">
                                            245
                                        </h3>
                                        <p className="text-gray-500 text-sm m-0">
                                            Total Bookings
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <Button
                                    className="w-full mt-5 rounded-full"
                                >
                                    View Schedule
                                </Button>
                            </Card>
                        ))}

                    </div>
                )
            }

            {
                tab === "request" && (
                    <div className="grid gap-6 m-6 mt-0">
                        {Requests.map((req: any) => (

                            <Card
                                key={req._id}
                                className="rounded-2xl border font-[Outfit]"
                                bodyStyle={{ padding: 28 }}
                            >

                                {/* HEADER */}
                                <div className="flex items-start justify-between">

                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            size={48}
                                            className="bg-yellow-100 text-yellow-600 font-semibold"
                                        >
                                            {req.name?.split(" ").map((w: any) => w[0]).join("").toUpperCase()}
                                        </Avatar>

                                        <div>
                                            <h2 className="font-semibold m-0">{req.name}</h2>
                                            <p className="text-gray-500 text-sm m-0">{req.role}</p>

                                            <Tag color="gold" className="rounded-full mt-1">
                                                Pending Review
                                            </Tag>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-gray-500 text-sm m-0">Requested</p>
                                        <p className="font-medium m-0">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>

                                <Divider className="my-6" />

                                {/* INFO */}
                                <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <InfoBlock
                                        label="Email"
                                        value={req.email}
                                        icon={<MailOutlined />}
                                    />

                                    <InfoBlock
                                        label="Phone"
                                        value={req.phone}
                                        icon={<PhoneOutlined />}
                                    />

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-4 mt-6">

                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => handleApprove(req._id)}
                                        // onClick={() => {
                                        //     alert("Button Clicked");
                                        // }}
                                        className="flex-1 h-8 rounded-full bg-green-500 hover:bg-green-600"
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => { handleReject(req._id) }}
                                        className="flex-1 h-8 rounded-full"
                                    >
                                        Reject
                                    </Button>

                                </div>

                            </Card>

                        ))}
                    </div>
                )
            }


        </div >
    )
}

export default StaffSalon
