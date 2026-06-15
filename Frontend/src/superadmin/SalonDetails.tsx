
import {
    Card,
    Avatar,
    Divider,
    Table,
    Typography,
    Empty,
    Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;

function SalonDetails() {
    const { id } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: [
            "salonDetails",
            id
        ],

        queryFn: async () => {

            const res =
                await axios.get(
                    `https://localhost:7074/api/auth/salondetails/${id}`
                );

            return res.data;
        },

        enabled: !!id
    });



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Empty
                    description="Failed to load salon details"
                />
            </div>
        );
    }








    return (
        <div className="p-6">
            <Card className="shadow-md rounded-xl  ">

                {/* Header */}
                <Title level={3} className="!mb-0 font-[Outfit]">
                    Details of {data?.salon?.salonName}
                </Title>

                <Text type="secondary" className="font-[Outfit]">
                    Complete salon information and management
                </Text>

                <Divider />

                {/* Profile Section */}
                <div className="flex gap-6 items-start">
                    <Avatar
                        size={100}
                        src={data?.salon?.profileImage}
                        icon={<UserOutlined />}

                    />

                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-4">
                            {data?.salon?.salonName}
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium"> {data?.salon?.ownerName}</p>

                                <p className="text-gray-500 mt-4">Email</p>
                                <p>{data?.salon?.email}</p>


                            </div>

                            <div>
                                <p className="text-gray-500 ">Address</p>
                                <p> {data?.salon?.salonAddress}</p>
                                <p className="text-gray-500 mt-4">Phone</p>
                                <p>{data?.salon?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Gallery */}
                <Title level={4} className="font-[Outfit]">
                    Gallery
                </Title>

                <div className="">
                    {data?.galleryImages?.length > 0 ? (

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                            {data.galleryImages.map(
                                (img: string, index: number) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                )
                            )}

                        </div>

                    ) : (

                        <div className="flex  justify-center items-center py-10">
                            <Empty
                                description="No Gallery Images"
                            />
                        </div>

                    )}

                </div>

                <Divider />

                {/* Staff */}
                <Title level={4} className="font-[Outfit]">
                    Staff Members
                </Title>

                <Table
                    pagination={false}
                    dataSource={data?.employees || []}
                    columns={[
                        {
                            title: "Name",
                            dataIndex: "fullName",
                        },

                        {
                            title: "Role",
                            dataIndex: "role",
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                        },

                    ]}
                />

                <Divider />

                {/* Services */}
                <Title level={4} className="font-[Outfit]">
                    Services
                </Title>

                <Table
                    pagination={false}
                    dataSource={data?.salon?.services || []}
                    columns={[
                        {
                            title: "Service Name",
                            dataIndex: "serviceName",
                        },
                        {
                            title: "Time(mins)",
                            dataIndex: "duration",
                            key: "duration",
                            render: (duration) => duration ? `${duration} min` : "-",
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => price ? `₹${price}` : "-",
                        },
                    ]}
                />

                <Divider />
                <Title level={4} className="font-[Outfit]">
                    Bookings Of This Salon
                </Title>

                <Table
                    pagination={false}
                    dataSource={data?.bookings || []}
                    columns={[
                        {
                            title: "Customer Name",
                            dataIndex: "customerName",
                        },
                        {
                            title: "Date",
                            dataIndex: "date",
                        },
                        {
                            title: "Time",
                            dataIndex: "time",
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                        },
                    ]}
                />



            </Card>
        </div>
    );
}

export default SalonDetails;