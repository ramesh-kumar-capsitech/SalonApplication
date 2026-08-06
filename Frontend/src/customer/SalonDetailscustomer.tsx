
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
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApiAuthSalondetailsSalonId } from "../api/generated/loginsignuphome";

const { Title, Text } = Typography;

function SalonDetailscustomer() {
    const { id } = useParams();


    const { data, isLoading, error } = useQuery({
        queryKey: [
            "salonDetails",
            id
        ],

        queryFn: async () => {

            const res =
                await getApiAuthSalondetailsSalonId(id)

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


                <Title level={3} className="!mb-0 font-[Outfit]">
                    Details of {data?.salon?.salonName}
                </Title>

                <Text type="secondary" className="font-[Outfit]">
                    Complete salon information and management
                </Text>

                <Divider />


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
                        <div className="hidden  bg-gray-50 rounded-xl p-6 mt-6 md:grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="md:hidden bg-gray-50 rounded-xl p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Divider />


                <Title level={4} className="font-[Outfit]">
                    Gallery
                </Title>

                <div className="">
                    {data?.galleryImages?.length > 0 ? (

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

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


                <Title level={4} className="font-[Outfit]">
                    Staff Members
                </Title>

                <Table
                    pagination={false}
                    dataSource={data?.employees || []}
                    scroll={{ x: "max-content" }}
                    columns={[
                        {
                            title: "Name",
                            dataIndex: "fullName",
                        },
                        {
                            title: "Role",
                            dataIndex: "role",
                        },

                    ]}
                />

                <Divider />


                <Title level={4} className="font-[Outfit]">
                    Services
                </Title>

                <Table
                    pagination={false}
                    dataSource={data?.salon?.services || []}
                    scroll={{ x: "max-content" }}
                    columns={[
                        {
                            title: "Service Name",
                            dataIndex: "serviceName",
                        },
                        {
                            title: "Time",
                            dataIndex: "duration",
                            key: "duration",
                            render: (duration: number) => `${duration} mins`,
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price: number) => `₹${price.toFixed(2)}`,
                        },
                    ]}
                />

                <Divider />


            </Card>
        </div>
    );
}

export default SalonDetailscustomer;