import React, { useEffect, useState } from "react";
import {
    Card,
    Avatar,
    Tag,
    Button,
    DatePicker,
    Typography,
    Spin,
    Empty,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    UserOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApiAuthGetemployeebookingsEmployeeId } from "../api/generated/loginsignuphome";
import dayjs from "dayjs";
import { Dropdown, Modal } from "antd";



const { Title, Text } = Typography;



const Schedule = () => {
    const [dateFilter, setDateFilter] = useState("week");
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const appreq: any = location.state;
    console.log("Employee Id =>", id);
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["customerBookings",
            id],
        queryFn: async () => {
            const res = await getApiAuthGetemployeebookingsEmployeeId(id);
            console.log("API Response =>", res.data);


            return res.data;

        },
        enabled: !!id
    })



    const appointments = bookings.map((item, index) => ({
        key: item.id || index,
        id: item.id?.slice(-6).toUpperCase(),
        customer: item.customerName,
        service: item.services?.map(s => s.name).join(", "),
        duration:
            item.services?.reduce(
                (total, s) => total + (s.duration || 0),
                0
            ) ?? 0,
        time: item.time,
        date: item.date,
        status: item.status,
    }));
    const completedCount = appointments.filter(
        (a) => a.status === "Completed"
    ).length;

    const inProgressCount = appointments.filter(
        (a) => a.status === "In Progress"
    ).length;

    const upcomingCount = appointments.filter(
        (a) => a.status === "pending"
    ).length;
    useEffect(() => {
        if (error) {
            message.error(
                "Failed to load bookings"
            );
        }
    }, [error]);



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
    const filterByDate = (list: any[]) => {
        const today = new Date();

        return list.filter((item) => {
            const bookingDate = new Date(item.date);

            switch (dateFilter) {
                case "today":
                    return bookingDate.toDateString() === today.toDateString();

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
                    return bookingDate.getFullYear() === today.getFullYear();

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

    return (
        <div className="p-4 lg:p-8 bg-[#f7f8fc] min-h-screen">


            <Modal
                title="Select Date"
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
                    </Button>,
                ]}
            >
                <DatePicker
                    className="w-full"
                    onChange={(date) => setSelectedDate(date?.toDate() || null)}
                />
            </Modal>
            <div className="flex items-center justify-between flex-wrap gap-4">

                <div className="flex items-center gap-3">

                    <Button
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        onClick={() =>
                            navigate(
                                `/salonadmin/staffsalon`, {
                                state: appreq
                            }
                            )
                        }
                    />

                    <div>

                        <Title level={3} className="!mb-0">
                            Employee Schedule
                        </Title>

                        <Text type="secondary">
                            Manage employee appointments
                        </Text>

                    </div>

                </div>
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


            <Card className="rounded-3xl shadow-sm mt-6">

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                    <div className="flex gap-5">

                        <Avatar
                            size={80}
                            icon={<UserOutlined />}
                        />

                        <div>

                            <Title level={4} className="!mb-1">
                                {appreq.fullName}
                            </Title>

                            <Text>{appreq.role}</Text>

                            <br />

                            <Tag
                                color={
                                    appreq.status === "active"
                                        ? "green"
                                        : "gold"
                                }
                                className="rounded-full mt-2"
                            >
                                {
                                    appreq.status === "active"
                                        ? "Active"
                                        : "Deactive"
                                }
                            </Tag>


                            <div className="mt-4 space-y-1">



                                <Text>
                                    Services :
                                    {appreq.skills + ","}
                                </Text>

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:w-[420px]">

                        <Card size="small" className="text-center">



                            <h2 className="text-2xl font-semibold text-blue-700 m-0  ">
                                {completedCount}
                            </h2>

                            <Text>Completed booking</Text>

                        </Card>

                        <Card size="small" className="text-center">



                            <h2 className="text-2xl font-semibold text-orange-500 m-0  ">
                                {upcomingCount}
                            </h2>

                            <Text>Upcoming</Text>

                        </Card>


                        <Card size="small" className="text-center">



                            <h2 className="text-2xl font-semibold text-green-500 m-0  ">
                                {inProgressCount}
                            </h2>

                            <Text>In Progress</Text>

                        </Card>

                        <Card size="small" className="text-center">

                            <h2 className="text-2xl font-semibold text-blue-500 m-0  ">
                                ~
                            </h2>

                            <Text>Today Booking</Text>

                        </Card>

                    </div>

                </div>

            </Card>







            <div className="mt-6 space-y-4">

                {filterByDate(appointments).map((item) => (

                    <Card
                        key={item.id}
                        className={`rounded-2xl border-l-4 ${item.status === "Confirmed"
                            ? "border-blue-500"
                            : item.status?.toLowerCase() === "completed"
                                ? "border-green-500"
                                : item.status === "Upcoming"
                                    ? "border-orange-500"
                                    : item.status === "rejected"
                                        ? "border-red-400"
                                        : "border-gray-300 border-dashed"
                            }`}
                    >

                        <div className="flex flex-col lg:flex-row justify-between gap-4">

                            <div>
                                <Title level={5}>
                                    {dayjs(item.date).format("DD MMM YYYY")}
                                </Title>
                                <Text level={5}>
                                    {item.time}
                                </Text>


                                {item.status === "Available" && (
                                    <Text type="secondary">
                                        No Booking Available
                                    </Text>
                                )}

                                {item.status === "Break" && (
                                    <Text type="danger">
                                        Lunch Break
                                    </Text>
                                )}

                                {item.customer && (
                                    <>
                                        <div className="font-semibold">
                                            {item.customer}
                                        </div>

                                        <Text>
                                            {item.service}
                                        </Text>

                                        <br />


                                        <Text type="secondary">
                                            {item.duration} min
                                        </Text>

                                    </>
                                )}

                            </div>

                            <div className="flex items-center">

                                <Tag
                                    color={
                                        item.status === "Confirmed"
                                            ? "blue"
                                            : item.status === "Completed"
                                                ? "green"
                                                : item.status === "Upcoming"
                                                    ? "orange"
                                                    : item.status === "Break"
                                                        ? "red"
                                                        : "default"
                                    }
                                >
                                    {item.status}
                                </Tag>

                            </div>

                        </div>

                    </Card>

                ))}

            </div>

        </div>
    );
};

export default Schedule;