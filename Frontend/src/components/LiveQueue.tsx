import React, { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import {
    Row,
    Col,
    Card,
    Avatar,
    Badge,
    Tag,
    Typography,
    Divider,
    Empty,
} from "antd";
import {
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getApiAuthGetbookingsalonSalonId, getApiAuthGetemployeesSalonId } from "../api/generated/loginsignuphome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
const { Title, Text } = Typography;


const getColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "gold";

        case "confirmed":
            return "blue";

        case "waiting":
            return "orange";

        case "in progress":
            return "blue";

        case "completed":
            return "green";

        case "cancelled":
            return "red";

        default:
            return "default";
    }
};
const LiveQueue = () => {
    const { salonId } = useParams();
    const queryClient = useQueryClient();
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7074/livequeuehub")
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {
                console.log(" SignalR Connected");
            })
            .catch((err) => {
                console.error(" SignalR Connection Error:", err);
            });

        connection.on("QueueUpdated", () => {
            console.log(" QueueUpdated Received");

            queryClient.invalidateQueries({
                queryKey: ["liveBookings", salonId],
            });
        });

        return () => {
            connection.stop();
        };
    }, [queryClient, salonId]);
    const { data: employees = [] } = useQuery({
        queryKey: ["staffList", salonId],
        queryFn: async () => {
            const res = await getApiAuthGetemployeesSalonId(salonId!);
            return res.data;
        },
        enabled: !!salonId,
    });
    const { data: bookings = [] } = useQuery({
        queryKey: ["liveBookings", salonId],
        queryFn: async () => {
            const res = await getApiAuthGetbookingsalonSalonId(salonId!);
            return res.data;
        },
    });
    const todayBookings = bookings
        .filter(
            (booking: any) =>
                dayjs(booking.date).isSame(dayjs(), "day") &&
                booking.status?.toLowerCase() !== "cancelled" && booking.status?.toLowerCase() !== "rejected" && booking.status?.toLowerCase() !== "completed"
        )
        .sort((a: any, b: any) => {
            const timeA = dayjs(a.time, "hh:mm A");
            const timeB = dayjs(b.time, "hh:mm A");

            return timeA.valueOf() - timeB.valueOf();
        });
    const liveQueue = employees.map((staff: any) => ({
        ...staff,
        bookings: todayBookings.filter(
            (booking: any) => booking.staffId === staff.id
        ),
    }));
    const staffWithBookings = liveQueue.filter(
        (staff: any) => staff.bookings.length > 0
    );
    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        Live Queue
                    </Title>

                    <Text type="secondary">
                        Real-time Staff Appointment Queue
                    </Text>

                </div>

                <Badge
                    status="processing"
                    text={
                        <span className="font-semibold">
                            LIVE
                        </span>
                    }
                />

            </div>

            {/* <Row gutter={[24, 24]}>

                {staffWithBookings.length === 0 ? (
                    <div className="flex items-center m-auto justify-center h-[65vh]">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="text-center">
                                    <h3 className="text-lg font-[Outfit] mb-1">
                                        No Bookings Today
                                    </h3>
                                    <p className="text-gray-500 m-0">
                                        There are no appointments scheduled for today.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                ) : (

                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns:
                                staffWithBookings.length === 1
                                    ? "1fr"
                                    : staffWithBookings.length === 2
                                        ? "1fr 1fr"
                                        : "repeat(auto-fit, minmax(380px, 1fr))",
                        }}
                    >
                        {staffWithBookings.map((staff: any) => (
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: 18,
                                    minHeight: "80vh",
                                }}
                                bodyStyle={{
                                    padding: 20,
                                }}
                            >



                                <div className="flex items-center gap-4">

                                    <Avatar
                                        size={60}
                                        icon={<UserOutlined />}
                                        src={staff.profileImage || undefined}
                                    />

                                    <div>

                                        <Title
                                            level={4}
                                            style={{
                                                marginBottom: 2,
                                            }}
                                        >
                                            {staff.fullName}
                                        </Title>

                                        <Text type="secondary">
                                            {staff.role}
                                        </Text>

                                    </div>

                                </div>

                                <Divider />

                                <div className="flex justify-between mb-4">

                                    <Text strong>
                                        Today's Queue
                                    </Text>

                                    <Tag color="blue">
                                        {staff.bookings.length} Bookings
                                    </Tag>

                                </div>

                                <div
                                    style={{
                                        height: "calc(80vh - 180px)",
                                        overflowY: "auto",
                                    }}
                                >

                                    {staff.bookings.length > 0 ? (
                                        staff.bookings.map((booking, index) => (
                                            <Card
                                                key={booking.id}
                                                size="small"
                                                className="mb-3"
                                                style={{ borderRadius: 12 }}
                                            >
                                                <div className="flex justify-between">
                                                    <Tag color="purple">#{booking.id?.slice(-4).toUpperCase()}</Tag>

                                                    <Tag color={getColor(booking.status)}>
                                                        {booking.status}
                                                    </Tag>
                                                </div>

                                                <Title level={5} style={{ marginTop: 10, marginBottom: 4 }}>
                                                    {booking.customerName}
                                                </Title>

                                                <Text> {booking.services?.map((s: any) => s.name).join(", ")}</Text>

                                                <br />

                                                <Text type="secondary">
                                                    <ClockCircleOutlined /> {booking.time}
                                                </Text>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="flex justify-center items-center py-16">
                                            <Empty
                                                description={
                                                    <span className="text-gray-500 font-medium">
                                                        No bookings available
                                                    </span>
                                                }
                                            />
                                        </div>
                                    )}

                                </div>

                            </Card>
                        ))}
                    </div>

                )}

            </Row> */}
            {staffWithBookings.length === 0 ? (
                <div className="flex items-center justify-center h-[65vh]">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <h3 className="text-lg font-[Outfit] mb-1">
                                    No Bookings Today
                                </h3>
                                <p className="text-gray-500 m-0">
                                    There are no appointments scheduled for today.
                                </p>
                            </div>
                        }
                    />

                </div>
            ) : (
                <div
                    className="grid gap-6 w-full"
                    style={{
                        gridTemplateColumns:
                            staffWithBookings.length === 1
                                ? "1fr"
                                : staffWithBookings.length === 2
                                    ? "1fr 1fr"
                                    : "repeat(auto-fit, minmax(380px, 1fr))",
                    }}
                >
                    {staffWithBookings.map((staff: any) => (
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 18,
                                minHeight: "80vh",
                            }}
                            bodyStyle={{
                                padding: 20,
                            }}
                        >



                            <div className="flex items-center gap-4">

                                <Avatar
                                    size={60}
                                    icon={<UserOutlined />}
                                    src={staff.profileImage || undefined}
                                />

                                <div>

                                    <Title
                                        level={4}
                                        style={{
                                            marginBottom: 2,
                                        }}
                                    >
                                        {staff.fullName}
                                    </Title>

                                    <Text type="secondary">
                                        {staff.designation}
                                    </Text>

                                </div>

                            </div>

                            <Divider />

                            <div className="flex justify-between mb-4">

                                <Text strong>
                                    Today's Queue
                                </Text>

                                <Tag color="blue">
                                    {staff.bookings.length} Bookings
                                </Tag>

                            </div>

                            <div
                                style={{
                                    height: "calc(80vh - 180px)",
                                    overflowY: "auto",
                                }}
                            >

                                {staff.bookings.length > 0 ? (
                                    staff.bookings.map((booking, index) => (
                                        <Card
                                            key={booking.id}
                                            size="small"
                                            className="mb-3"
                                            style={{ borderRadius: 12 }}
                                        >
                                            <div className="flex justify-between">
                                                <Tag color="purple">#{booking.id?.slice(-4).toUpperCase()}</Tag>

                                                <Tag color={getColor(booking.status)}>
                                                    {booking.status}
                                                </Tag>
                                            </div>

                                            <Title level={5} style={{ marginTop: 10, marginBottom: 4 }}>
                                                {booking.customerName}
                                            </Title>

                                            <Text> {booking.services?.map((s: any) => s.name).join(", ")}</Text>

                                            <br />

                                            <Text type="secondary">
                                                <ClockCircleOutlined /> {booking.time}
                                            </Text>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center py-16">
                                        <Empty
                                            description={
                                                <span className="text-gray-500 font-medium">
                                                    No bookings available
                                                </span>
                                            }
                                        />
                                    </div>
                                )}

                            </div>

                        </Card>
                    ))}

                </div>
            )}

        </div >
    );
};

export default LiveQueue;

