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
import { Empty } from "antd";
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiAuthGetallsalons, putApiAuthApproveId, putApiAuthRejectId } from '../api/generated/loginsignuphome';
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



    const { data: allSalons = [] } = useQuery({
        queryKey: ["salons"],
        queryFn: async () => {
            const res = await getApiAuthGetallsalons()

            return res.data;
        }
    });
    const salons = allSalons.filter(
        (salon: any) =>
            salon.status === "pending"
    );

    const approvedsalons = allSalons.filter(
        (salon: any) =>
            salon.status === "approved"
    );

    const rejectedsalons = allSalons.filter(
        (salon: any) =>
            salon.status === "rejected"
    );
    const queryClient = useQueryClient()
    const approveMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await putApiAuthApproveId(id)

            return res.data;
        },

        onSuccess: (data) => {

            message.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["salons"]
            });
        },

        onError: () => {
            message.error(
                "Failed to approve request"
            );
        }
    });
    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {

            const res = await putApiAuthRejectId(id,
                {
                    reason:
                        "Incomplete details",
                }
            );

            return res.data;
        },

        onSuccess: (data) => {

            message.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["salons"]
            });
        },

        onError: () => {
            message.error(
                "Failed to reject request"
            );
        }
    });
    const handleApprove = (id: string) => {
        approveMutation.mutate(id);
    }
    const handleReject = (id: string) => {
        rejectMutation.mutate(id);
    }

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
                        {salons.length}
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

                    {salons.length === 0 ? (
                        <Empty description="No Pending Requests" />
                    ) : (
                        salons.map((salon: any, index) => (

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
                        )
                        ))}

                </div>

            )}

            {tab === "approve" && (
                <div className='m-6 mt-0 grid gap-6'>
                    {approvedsalons.length === 0 ? (
                        <Empty description="No Approved Requests" />
                    ) : (
                        approvedsalons.map((salon: any, index) => (
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
                        )))}




                </div>





            )
            }
            {
                tab === "reject" && (
                    <div className='m-6 mt-0 grid gap-6'>
                        {rejectedsalons.length === 0 ? (
                            <Empty description="No Rejected Requests" />
                        ) : (
                            rejectedsalons.map((salon: any, index) => (
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
                            )))}


                    </div>
                )
            }
        </div >
    )
}

export default Requests
