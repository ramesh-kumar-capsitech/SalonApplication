import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Dropdown, message, Table, Tag } from 'antd';
import axios from 'axios';
import { getApiAuthGetbookingsalonSalonId, putApiAuthUpdatebookingstatusId } from '../api/generated/loginsignuphome';



const AllBooking = () => {
    const columns = [
        {
            title: "Booking ID",
            dataIndex: "id",
            key: "id",
            render: (text: string) => (
                <span className="font-medium text-gray-900">{text}</span>
            ),
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Service",
            dataIndex: "service",
            key: "service",
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            ),
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: " date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: any) => {
                const s = status?.toLowerCase();

                return (
                    <Tag
                        className="rounded-full px-3"
                        color={
                            s === "confirmed"
                                ? "blue"
                                : s === "rejected"
                                    ? "red"
                                    : s === "completed"
                                        ? "green"
                                        : s === "in progress"
                                            ? "gold"
                                            : "default"
                        }
                    >
                        {status}
                    </Tag >
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: "Pending", label: "Pending", disabled: record.status === "Pending" },
                            { key: "Confirmed", label: "Confirmed", disabled: record.status === "Confirmed" },
                            { key: "Completed", label: "Completed", disabled: record.status === "Completed" },
                            { key: "Rejected", label: "Rejected", disabled: record.status === "Rejected" },
                            { key: "In Progress", label: "In Progress", disabled: record.status === "In Progress" },
                        ],
                        onClick: ({ key }) => updateStatus(record.key, key)
                    }}
                >
                    <a className="text-blue-600 font-medium hover:underline">
                        Manage
                    </a>
                </Dropdown>
            ),
        },
    ];
    const authData = JSON.parse(localStorage.getItem("persist:auth")!);
    const user = JSON.parse(authData.user);
    const salon = user.salonId;

    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["bookings", salon],
        queryFn: async () => {
            const res = await getApiAuthGetbookingsalonSalonId(salon)
            return res.data;
        },
        enabled: !!salon
    })

    const dataSource = bookings.map((item: any, index) => ({
        key: item.id || index,
        id: item.id?.slice(-6).toUpperCase(),
        customer: item.customerName?.charAt(0).toUpperCase() +
            item.customerName?.slice(1),
        service: item.services?.map(s => s.name).join(", "),
        time: item.time,
        date: new Date(item.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        staff: item.staffName,
        status: item.status,
    }));
    const queryClient = useQueryClient()
    const useStatusMutation = useMutation({
        mutationFn: async ({
            id,
            status
        }:
            {
                id: string;
                status: string;
            }
        ) => {
            const res =
                await putApiAuthUpdatebookingstatusId(id,
                    { status }
                );

            return res.data;

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            });
            message.success("Booking status updated ")
        },
        onError: () => {

            message.error("Failed to update booking status")
        }

    })
    const updateStatus = (
        id: string,
        status: string
    ) => {
        useStatusMutation.mutate({
            id,
            status
        });
    }


    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[13px]   ">
                <div>
                    <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                        All Booking
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Customer booking date,name
                    </p>
                </div>

            </div>

            <hr />
            <div className='m-6 '>
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 28 }}
                >
                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">All Bookings</h2>
                        <p className="text-gray-500 text-sm">
                            Manage today's appointments
                        </p>
                    </div>

                    {/* TABLE */}
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Card>
            </div>

        </div>
    )
}

export default AllBooking
