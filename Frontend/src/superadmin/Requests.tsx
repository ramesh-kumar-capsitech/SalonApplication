import { message, Segmented } from 'antd'
import React, { useEffect, useState } from "react";
import { Card, Tag, Button, Divider } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import axios from 'axios';
interface InfoBlockProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, icon }) => {

    return (
        <div>
            <p className="text-gray-500 mb-1">{label}</p>
            <div className="flex items-start gap-2 text-gray-900">
                {icon && <span className="text-blue-600">{icon}</span>}
                <span>{value}</span>
            </div>
        </div>
    );
};


const Requests = () => {
    const [tab, settab] = useState<"pending" | "approve" | "reject">("pending")
    const [salons, setsalons] = useState([]);
    const [rejectedsalons, setrejectedsalons] = useState([]);
    const [approvedsalons, setapprovedsalons] = useState([]);
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/all-salons-requested").then(res => {
    //         setsalons(res.data.data)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }, []);
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/rejectedsalons").then(res => {
    //         setrejectedsalons(res.data.data);
    //         console.log(res.data.data)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }, [])
    // useEffect(() => {
    //     axios.get("http://localhost:3001/auth/approved-salons").then(res => {
    //         setapprovedsalons(res.data.data);
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

            const allSalons = res.data;

            setsalons(
                allSalons.filter(
                    (salon: any) =>
                        salon.status === "pending"
                )
            );

            setapprovedsalons(
                allSalons.filter(
                    (salon: any) =>
                        salon.status === "approved"
                )
            );

            setrejectedsalons(
                allSalons.filter(
                    (salon: any) =>
                        salon.status === "rejected"
                )
            );

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchAllSalons();
    }, []);

    // const handleApprove = async (id: string) => {
    //     try {
    //         await axios.put(`http://localhost:3001/auth/approve/${id}`);

    //         message.success("Salon approved successfully!");
    //         setsalons(prev =>
    //             prev.filter((salon: any) => salon._id !== id)
    //         );

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const handleApprove = async (id: string) => {
        try {
            const res = await axios.put(
                `https://localhost:7074/api/auth/approve/${id}`
            );

            console.log(res.data);

            message.success(res.data.message);

            fetchAllSalons();


        } catch (error) {
            console.log(error);
        }
    };
    const handleReject = async (id: string) => {

        try {

            const res = await axios.put(
                `https://localhost:7074/api/auth/reject/${id}`,
                {
                    reason: "Incomplete details"
                }
            );

            message.success(res.data.message);

            fetchAllSalons();

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div className=" flex items-center justify-between px-3 py-[13px] pb-[6px]   ">

                <div className='pt-3'>
                    <h1 className="text-lg leading-[1] m-0 font-semibold text-gray-900">
                        Salon Requests
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        Manage salon registration requests
                    </p>
                </div>

                <div className=" flex flex-col justify-center items-center">
                    <h1 className="text-lg leading-[0.8]  font-semibold text-orange-500">
                        4
                    </h1>
                    <p className="text-gray-500  text-sm ">
                        Pending Requests
                    </p>
                </div>
            </div>
            <hr />
            <div>
                <Segmented
                    block
                    value={tab}
                    onChange={(val) => settab(val as "pending" | "approve" | "reject")}
                    options={[
                        {
                            label: `Pending (${salons.length})`,
                            value: 'pending',
                        },
                        {
                            label: `Approved (${approvedsalons.length})`,
                            value: 'approve',
                        },
                        {
                            label: `Rejected (${rejectedsalons.length})`,
                            value: 'reject',
                        },
                    ]}
                    className="rounded-lg bg-gray-100 lg:max-w-[29%] font-[Outfit]  p-1 m-6 "
                />
            </div>

            {tab === "pending" && (
                <div className='m-6 mt-0 grid gap-6'>

                    {salons.map((salon: any, index) => (

                        <Card key={salon._id} className="rounded-2xl border" bodyStyle={{ padding: 28 }}>

                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="md:flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">
                                            {salon.salonName}
                                        </h2>

                                        <Tag
                                            color={
                                                salon.status === "approved"
                                                    ? "green"
                                                    : salon.status === "rejected"
                                                        ? "red"
                                                        : "gold"
                                            }
                                            className="rounded-full px-3"
                                        >
                                            {salon.status || "Pending Review"}
                                        </Tag>
                                    </div>

                                    <p className="text-gray-500 mt-1">
                                        Request ID:
                                        <span className="font-medium">
                                            {salon.id.slice(-6).toUpperCase()}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-gray-500 m-0">Submitted</p>
                                    <p className="font-medium m-0">
                                        {new Date(salon.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <Divider className="my-3" />

                            <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                                <div className="space-y-4">
                                    <InfoBlock label="Owner Name" value={salon.ownerName} />
                                    <InfoBlock label="Email" value={salon.email} />
                                    <InfoBlock label="Phone" value={salon.phone} />
                                </div>

                                <div className="space-y-4">
                                    <InfoBlock label="Location" value={salon.salonAddress} />

                                    <div>
                                        <p className="text-gray-500 mb-1">Description</p>
                                        <p className="text-gray-800">
                                            {salon.salonDescription}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="grid md:flex gap-4 mt-8">
                                <Button
                                    htmlType="button"
                                    type="primary"
                                    onClick={() => handleApprove(salon.id)}
                                    // onClick={() => {
                                    //     alert("Button Clicked");
                                    // }}
                                    className="flex-1 h-8 rounded-full bg-green-500"
                                >
                                    Approve Request
                                </Button>

                                <Button
                                    danger
                                    className="flex-1 h-8 rounded-full"
                                    onClick={() => handleReject(salon.id)}
                                >
                                    Reject Request
                                </Button>
                            </div>

                        </Card>

                    ))}

                </div>

            )}

            {tab === "approve" && (
                <div className='m-6 mt-0 grid gap-6'>
                    {approvedsalons.map((salon: any, index) => (
                        <Card className="rounded-2xl border" bodyStyle={{ padding: 20 }}>


                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">{salon.salonName}</h2>

                                    </div>

                                    <p className="text-gray-500 mt-1 leading-3">
                                        <p> Owner: <span className="font-medium leading-[0.8] m-0">{salon.ownerName}</span></p>
                                        <p>   {salon.email}</p>

                                    </p>
                                </div>

                                <div className="text-right">
                                    <Tag color="green" className="rounded-full px-3">
                                        Approved
                                    </Tag>
                                    <p className="font-medium text-gray-500 m-1">{new Date(salon.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                        </Card>
                    ))}



                    {/* <Card className="rounded-2xl border" bodyStyle={{ padding: 28 }}>


                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold">Luxe Beauty Salon</h2>

                                </div>

                                <p className="text-gray-500 mt-1 leading-3">
                                    <p> Owner: <span className="font-medium leading-[0.8] m-0">Sarah Anderson</span></p>
                                    <p>   Sarah@Anderson.com</p>

                                </p>
                            </div>

                            <div className="text-right">
                                <Tag color="green" className="rounded-full px-3">
                                    Approved
                                </Tag>
                                <p className="font-medium text-gray-500 m-1">Jan 18, 2026</p>
                            </div>
                        </div>

                    </Card> */}

                </div>





            )
            }
            {
                tab === "reject" && (
                    <div className='m-6 mt-0 grid gap-6'>
                        {rejectedsalons.map((salon: any, index) => (
                            <Card className="rounded-2xl border" bodyStyle={{ padding: 20 }}>


                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold">{salon.salonName}</h2>

                                        </div>

                                        <p className="text-gray-500 mt-1 leading-3">
                                            <p> Owner: <span className="font-medium leading-[0.8] m-0">{salon.ownerName}</span></p>
                                            <p>   {salon.email}</p>
                                            <p className="font-sm text-red-500">   {salon.rejectReason}</p>
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <Tag color="red" className="rounded-full px-3">
                                            Rejected
                                        </Tag>
                                        <p className="font-medium text-gray-500 m-1">
                                            {new Date(salon.createdAt).toLocaleDateString()}
                                        </p>


                                    </div>
                                </div>

                            </Card>
                        ))}

                        {/* <Card className="rounded-2xl border" bodyStyle={{ padding: 28 }}>


                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">Luxe Beauty Salon</h2>

                                    </div>

                                    <p className="text-gray-500 mt-1 leading-3">
                                        <p> Owner: <span className="font-medium leading-[0.8] m-0">Sarah Anderson</span></p>
                                        <p>   Sarah@Anderson.com</p>
                                        <p className="font-sm text-red-500">Incomplete documentation</p>
                                    </p>
                                </div>

                                <div className="text-right">
                                    <Tag color="red" className="rounded-full px-3">
                                        rejected
                                    </Tag>
                                    <p className="font-medium text-gray-500 m-1">Jan 18, 2026</p>


                                </div>
                            </div>

                        </Card> */}
                    </div>
                )
            }
        </div >
    )
}

export default Requests
