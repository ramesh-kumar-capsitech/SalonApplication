import { Avatar, Button, Card, Switch, Tag } from 'antd'
import {
    CheckCircleOutlined,
    PlayCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from 'react';
import axios from 'axios';

const TotalBooking = () => {
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        const salonId = localStorage.getItem("salonId");
        const staffId = localStorage.getItem("staffId");

        if (!salonId || !staffId) {
            console.log("Missing IDs");
            return;
        }

        axios
            .get(`http://localhost:3001/auth/staff-bookings/${salonId}/${staffId}`)
            .then((res) => {
                console.log("API DATA:", res.data.data);

                if (res.data.success) {
                    setBookings(res.data.data);
                }
            })
            .catch(err => console.log(err));

    }, []);
    const appointments = bookings.map((item, index) => ({
        key: item._id || index,
        id: item._id?.slice(-6).toUpperCase(),
        customer: item.customerName,
        service: item.services?.map(s => s.name).join(", "),
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
        (a) => a.status === "Pending"
    ).length;

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.put(
                `http://localhost:3001/auth/update-booking/${id}`,
                { status }
            );

            if (res.data.success) {
                setBookings(prev =>
                    prev.map(b =>
                        b._id === id ? { ...b, status } : b
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }
    };
    const formatDate = (d) => {
        return new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[11px] pb-[0px] mb-3   ">
                <div className='pt-3'>
                    <h1 className="text-lg leading-[0.9] m-0 font-semibold text-gray-900">
                        Total Bookings
                    </h1>
                    <p className="text-gray-500 text-sm mt-0">
                        easy to manage your appointments and provide excellent service to your customers.
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
                        <p className="text-gray-500 m-0">Completed booking</p>
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
                            Total Appointments
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
                                        <div className="text-sm text-gray-500 w-20  ">
                                            {appt.time && (
                                                <p className="text-xs text-gray-500 m-0">
                                                    {appt.time}
                                                </p>
                                            )}
                                            {appt.date && (
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(appt.date)}
                                                </p>
                                            )}
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
                                            appt.status === "Completed"
                                                ? "green"
                                                : appt.status === "Confirmed"
                                                    ? "blue"
                                                    : appt.status === "Rejected"
                                                        ? "red"
                                                        : "gold"
                                        }
                                    >
                                        {appt.status}
                                    </Tag>
                                </div>


                                {/* ACTIONS */}

                                {/* PENDING */}
                                {appt.status === "Pending" && (
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            type="primary"
                                            className="flex-1 rounded-full bg-green-500"
                                            onClick={() => updateStatus(appt.key, "Confirmed")}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            danger
                                            className="flex-1 rounded-full"
                                            onClick={() => updateStatus(appt.key, "Rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {/* CONFIRMED */}
                                {appt.status === "Confirmed" && (
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            type="primary"
                                            icon={<PlayCircleOutlined />}
                                            className="flex-1 rounded-full"
                                            onClick={() => updateStatus(appt.key, "In Progress")}
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
                                {appt.status === "In Progress" && (
                                    <div className="mt-4">
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            className="w-full rounded-full bg-green-500"
                                            onClick={() => updateStatus(appt.key, "Completed")}
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

export default TotalBooking
