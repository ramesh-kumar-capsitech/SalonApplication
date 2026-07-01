import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, DatePicker, Dropdown, Empty, message, Modal, Segmented, Table, Tag } from 'antd';
import axios from 'axios';
import { getApiAuthGetbookingsalonSalonId, putApiAuthUpdatebookingstatusId } from '../api/generated/loginsignuphome';
import { useState } from 'react';
import dayjs from 'dayjs';



const AllBooking = () => {
    const [dateFilter, setDateFilter] = useState("week");
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const filterByDate = (list: any[]) => {
        const today = new Date();

        return list.filter((item) => {
            const bookingDate = new Date(item.date);

            switch (dateFilter) {

                case "today":
                    return (
                        bookingDate.toDateString() ===
                        today.toDateString()
                    );

                case "week": {
                    const start = new Date(today);
                    start.setDate(today.getDate() - today.getDay());

                    const end = new Date(start);
                    end.setDate(start.getDate() + 6);

                    return bookingDate >= start && bookingDate <= end;
                }

                case "month":
                    return (
                        bookingDate.getMonth() === today.getMonth() &&
                        bookingDate.getFullYear() === today.getFullYear()
                    );

                case "year":
                    return (
                        bookingDate.getFullYear() ===
                        today.getFullYear()
                    );

                case "custom":
                    if (!selectedDate) return true;

                    return (
                        bookingDate.toDateString() ===
                        new Date(selectedDate).toDateString()
                    );

                default:
                    return true;
            }
        });
    };
    const [tab, settab] = useState<"pending" | "confirmed" | "completed" | "reject" | "cancel">("pending")
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
            title: "Staff Name",
            dataIndex: "staff",
            key: "staff",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const colors: Record<string, string> = {
                    pending: "orange",
                    confirmed: "blue",
                    completed: "green",
                    rejected: "red",
                    cancelled: "red",
                    "in progress": "gold",
                };

                return (
                    <Tag
                        color={colors[status?.trim().toLowerCase()] || "default"}
                        className="rounded-full px-3"
                    >
                        {status}
                    </Tag>
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
    const cancelReasonColumn = {
        title: "Cancel Reason",
        dataIndex: "cancelReason",
        key: "cancelReason",
        render: (reason: string) => (
            <span className="text-red-500 font-medium">
                {reason || "No reason"}
            </span>
        ),
    };
    const finalColumns =
        tab === "cancel"
            ? [...columns, cancelReasonColumn]
            : columns;

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
    const pendingBookings = bookings.filter(
        (b: any) => b.status?.toLowerCase() === "pending"
    );

    const confirmedBookings = bookings.filter(
        (b: any) => b.status?.toLowerCase() === "confirmed"
    );

    const completedBookings = bookings.filter(
        (b: any) => b.status?.toLowerCase() === "completed"
    );

    const rejectedBookings = bookings.filter(
        (b: any) => b.status?.toLowerCase() === "rejected"
    );

    const cancelledBookings = bookings.filter(
        (b: any) => b.status?.toLowerCase() === "cancelled"
    );
    const getDataSource = (list: any[]) =>
        list.map((item: any, index: number) => ({
            key: item.id || index,
            id: item.id?.slice(-6).toUpperCase(),
            customer:
                item.customerName?.charAt(0).toUpperCase() +
                item.customerName?.slice(1),
            service: item.services?.map((s: any) => s.name).join(", "),
            time: item.time,
            date: dayjs(item.date).format("DD MMM YYYY")
            ,
            staff: item.staffName,
            status: item.status,
            cancelReason: item.cancelReason,
        }));
    let tableData = [];

    switch (tab) {
        case "pending":
            tableData = getDataSource(filterByDate(pendingBookings));
            break;

        case "confirmed":

            tableData = getDataSource(filterByDate(confirmedBookings));
            break;

        case "completed":

            tableData = getDataSource(filterByDate(completedBookings));

            break;

        case "reject":

            tableData = getDataSource(filterByDate(rejectedBookings));

            break;

        case "cancel":

            tableData = getDataSource(filterByDate(cancelledBookings));

            break;

        default:
            tableData = [];
    }
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
            <Modal
                title={<span className='font-[Outfit]'>Select Date</span>}
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsFilterModalOpen(false)}>
                        Cancel
                    </Button>,

                    <Button
                        key="apply"
                        type="primary"
                        onClick={() => {
                            setDateFilter("custom");
                            setIsFilterModalOpen(false);
                        }}
                    >
                        Apply
                    </Button>
                ]}
            >
                <DatePicker
                    className="w-full font-[Outfit]"
                    onChange={(date) => setSelectedDate(date?.toDate() || null)}
                />
            </Modal>
            <div className="md:flex items-center justify-between  px-3 py-[13px]   ">
                <div>
                    <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                        All Booking
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Customer booking date,name
                    </p>
                </div>
                <div className='  md:p-4'>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "today",
                                    label: "Today",
                                    disabled: dateFilter === "today",
                                },
                                {
                                    key: "week",
                                    label: "This Week",
                                    disabled: dateFilter === "week",
                                },
                                {
                                    key: "month",
                                    label: "This Month",
                                    disabled: dateFilter === "month",
                                },
                                {
                                    key: "year",
                                    label: "This Year",
                                    disabled: dateFilter === "year",
                                },
                                {
                                    key: "custom",
                                    label: "Custom Date",
                                    disabled: dateFilter === "custom",
                                },
                            ],
                            onClick: ({ key }) => {
                                if (key === "custom") {
                                    setIsFilterModalOpen(true);
                                } else {
                                    setDateFilter(key);
                                }
                            }
                        }}
                    >
                        <a className="text-blue-600 font-medium hover:underline">
                            Filter:{" "}
                            <span className="font-medium">
                                {dateFilter === "today" && "Today"}
                                {dateFilter === "week" && "This Week"}
                                {dateFilter === "month" && "This Month"}
                                {dateFilter === "year" && "This Year"}
                                {dateFilter === "custom" && "Custom Date"}
                            </span>
                        </a>
                    </Dropdown>


                </div>


            </div>

            <hr />
            <div className="m-6 md:m-6 ">
                <Segmented
                    block
                    value={tab}
                    onChange={(val) =>
                        settab(val as "pending" | "confirmed" | "completed" | "reject" | "cancel")
                    }
                    options={[
                        {
                            label: `Pending`,
                            value: "pending",
                        },
                        {
                            label: `Confirmed`,
                            value: "confirmed",
                        },
                        {
                            label: `Completed`,
                            value: "completed",
                        },
                        {
                            label: `Reject`,
                            value: "reject",
                        },
                        {
                            label: `Cancel`,
                            value: "cancel",
                        }

                    ]}
                    className="w-full  rounded-lg bg-gray-100 p-1 font-[Outfit]"
                />
            </div>
            <div className=' m-6 '>
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 28 }}
                >

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">All {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings</h2>
                        <p className="text-gray-500 text-sm">
                            Manage appointments
                        </p>
                    </div>

                    {
                        tableData.length === 0 ? (
                            <Empty
                                description={<span className='font-[outfit] '>No {tab.charAt(0).toUpperCase() + tab.slice(1)} bookings found</span>}
                            />
                        ) : (
                            <Table
                                columns={finalColumns}
                                dataSource={tableData}
                                pagination={{ pageSize: 5, className: "font-[Outfit]" }}
                                scroll={{ x: "max-content" }}

                            />
                        )
                    }
                </Card>
            </div>

        </div >
    )
}

export default AllBooking
