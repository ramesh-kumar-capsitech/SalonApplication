import { Avatar, Button, Card, Switch, Tag } from 'antd'
import {
    CheckCircleOutlined,
    PlayCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from 'react';
import axios from 'axios';

const myshedule = () => {
    const [bookings, setBookings] = useState<any[]>([])
    useEffect(() => {

        const authData = JSON.parse(
            localStorage.getItem("persist:auth")!
        );

        const user = JSON.parse(
            authData.user
        );

        axios
            .get(
                `https://localhost:7074/api/auth/getemployeebookings/${user.id}`
            )
            .then((res) => {

                console.log("BOOKINGS:", res.data);

                setBookings(res.data);
            });

    }, []);
    // const today = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter((b) => {
        const bookingDate = new Date(b.date).toDateString();
        const todayDate = new Date().toDateString();

        return bookingDate === todayDate;
    });
    const appointments = todayBookings.map((item, index) => ({
        key: item.id || index,
        id: item.id?.slice(-6).toUpperCase(),
        customer: item.customerName,
        service: item.services?.map((s: { name: string }) => s.name).join(", "),
        time: item.time,
        status: item.status,
    }));
    const completedCount = appointments.filter(
        (a) => a.status === "completed"
    ).length;

    const inProgressCount = appointments.filter(
        (a) => a.status === "In Progress"
    ).length;

    const upcomingCount = appointments.filter(
        (a) => a.status === "pending"
    ).length;
    const todayDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await axios.put(
                `https://localhost:7074/api/auth/updatebookingstatus/${id}`,
                { status }
            );

            if (res.data.success) {
                setBookings(prev =>
                    prev.map(b =>
                        b.id === id ? { ...b, status } : b
                    )
                );
            }
        } catch (err) {
            console.log(err);
            console.log(err.response);

        }
    };
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3   ">
                <div className='pt-3'>
                    <h1 className="text-lg leading-[0.9] m-0 font-semibold text-gray-900">
                        Today My Schedule
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        {todayDate}
                    </p>
                </div>
                {/* <button className="flex justify-between border gap-2  py-2 px-3 rounded-full font-sm  ">
                    <p className='p-0 m-0'>Available</p>
                    <Switch
                    // checked={service.active}
                    // onChange={() => toggleService(service.id)}
                    />
                </button> */}


            </div>
            <hr />
            <div className='m-6 flex gap-6 '>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">





                    <div className="">
                        <p className="text-gray-500 m-0">Completed Today</p>
                        <h2 className="text-2xl font-semibold text-blue-700 m-0  ">
                            {completedCount}
                        </h2>
                    </div>

                </div>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">





                    <div className="">
                        <p className="text-gray-500 m-0">In Progress</p>
                        <h2 className="text-2xl font-semibold text-green-500 m-0  ">
                            {inProgressCount}
                        </h2>
                    </div>

                </div>
                <div className="w-1/3 bg-white rounded-2xl border border-gray-200 p-6 flex justify-start gap-5 ">



                    <div className="">
                        <p className="text-gray-500 m-0">Upcoming</p>
                        <h2 className="text-2xl font-semibold text-orange-500 m-0  ">
                            {upcomingCount}
                        </h2>
                    </div>

                </div>
            </div>
            <div>
                <Card
                    className="rounded-2xl border font-[Outfit] m-6"
                    bodyStyle={{ padding: 28 }}
                >

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">
                            Today's Appointments
                        </h2>
                        {/* <p className="text-gray-500 text-sm">
                            6 appointments scheduled
                        </p> */}
                    </div>


                    <div className="space-y-4">
                        {appointments.map((appt) => (
                            <div
                                key={appt.id}
                                className={`border rounded-xl p-4 ${appt.status === "In Progress"
                                    ? "border-blue-500 bg-blue-50"
                                    : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between">

                                    <div className="flex gap-4">
                                        <div className="text-sm text-gray-500 w-20">
                                            {appt.time}
                                        </div>

                                        <Avatar className="bg-blue-100 text-blue-600">
                                            {appt.customer?.[0]}

                                        </Avatar>

                                        <div>
                                            <p className="font-medium m-0">
                                                {appt.customer}
                                            </p>
                                            <p className="text-sm text-gray-500 m-0">
                                                {appt.service}·
                                                {/* {appt.duration} */}
                                            </p>

                                            {appt.status === "Completed" && (
                                                <p className="text-green-600 text-xs mt-1">
                                                    Service completed successfully
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <Tag
                                        color={
                                            appt.status === "completed"
                                                ? "green"
                                                : appt.status === "confirmed"
                                                    ? "blue"
                                                    : appt.status === "rejected"
                                                        ? "red"
                                                        : "gold"
                                        }
                                    >
                                        {appt.status}
                                    </Tag>
                                </div>


                                {/* ACTIONS */}

                                {/* PENDING */}
                                {appt.status === "pending" && (
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            type="primary"
                                            className="flex-1 rounded-full bg-green-500"
                                            onClick={() => updateStatus(appt.key, "confirmed")}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            danger
                                            className="flex-1 rounded-full"
                                            onClick={() => updateStatus(appt.key, "rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {/* CONFIRMED */}
                                {appt.status === "confirmed" && (
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            type="primary"
                                            icon={<PlayCircleOutlined />}
                                            className="flex-1 rounded-full"
                                            onClick={() => updateStatus(appt.key, "in progress")}
                                        >
                                            Start Service
                                        </Button>
                                        <Button
                                            icon={<ReloadOutlined />}
                                            className="flex-1 rounded-full"
                                        >
                                            Reschedule
                                        </Button>
                                    </div>
                                )}

                                {/* IN PROGRESS */}
                                {appt.status === "in progress" && (
                                    <div className="mt-4">
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            className="w-full rounded-full bg-green-500"
                                            onClick={() => updateStatus(appt.key, "completed")}
                                        >
                                            Mark as Completed
                                        </Button>
                                    </div>
                                )}


                                {/* {appt.status === "Completed" && (
                                    <div className="mt-4 text-green-600 text-sm">
                                        ✅ Service Completed
                                    </div>
                                )} */}
                            </div>
                        ))}
                    </div>
                </Card>


            </div>
        </div>
    )
}

export default myshedule
