import React from "react";
import logo from "../assets/images/logo.png";
import sign from "../assets/images/bookmysalon-removebg-preview.png"

import {
    CalendarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

// interface InvoiceProps {
//     booking: any;
// }

// { booking }: InvoiceProps

const Invoice = () => {
    const { state: booking } = useLocation();


    const subtotal = booking.totalPrice;

<<<<<<< HEAD
    const discount = subtotal * 0.02;

    const priceAfterDiscount = subtotal - discount;

    const gst = priceAfterDiscount * 0.05;

    const grandTotal = priceAfterDiscount + gst;
=======
const gst = subtotal * 0.05;      
const discount = gst;             

const grandTotal = subtotal + gst - discount;
>>>>>>> master
    return (
        <div
            id="invoice"
            className="bg-[#f5f7fb] m-auto mt-2 mb-2  flex justify-center"
            style={{
                width: "794px",
                background: "#f5f7fb"
            }}
        >
            <div className="w-[794px] bg-white shadow-2xl rounded-xl overflow-hidden">



                <div className="bg-[#1E3A8A] text-white px-10 py-8">

                    <div className="flex justify-between items-center">

                        <div className="flex items-center gap-5">

                            <img
                                src={logo}
                                className="w-20 h-20 rounded-full bg-white p-2"
                            />

                            <div>

                                <h1 className="text-3xl font-bold tracking-wide">
                                    BOOK MY SALON
                                </h1>

                                <p className="text-blue-100 mt-1">
                                    Premium Salon Management
                                </p>

                            </div>

                        </div>

                        <div className="text-right">

                            <h2 className="text-4xl font-bold">
                                TAX
                            </h2>

                            <p className="text-2xl font-semibold">
                                INVOICE
                            </p>

                        </div>

                    </div>

                </div>



                <div className="grid grid-cols-4 gap-6 px-10 py-6 bg-blue-50 border-b">

                    <div>

                        <p className="text-gray-500 text-sm">
                            Invoice No
                        </p>

                        <h3 className="font-bold">
                            INV-{booking.id?.slice(-4).toUpperCase()}
                        </h3>

                    </div>

                    <div>

                        <p className="text-gray-500 text-sm">
                            Booking ID
                        </p>

                        <h3 className="font-bold">
                            BK-{booking.id?.slice(-6).toUpperCase()}
                        </h3>

                    </div>

                    <div>

                        <p className="text-gray-500 text-sm">
                            Invoice Date
                        </p>

                        <h3 className="font-bold">
                            {booking.date}
                        </h3>

                    </div>

                    <div className="flex justify-end items-center">

                        <span className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow">
                            ✔ PAID
                        </span>

                    </div>

                </div>



                <div className="grid grid-cols-2 gap-8 p-10">



                    <div className="border rounded-xl p-6 shadow-sm">

                        <h2 className="font-bold text-lg text-[#1E3A8A] mb-5">
                            Salon Details
                        </h2>

                        <div className="space-y-4">

                            <div>

                                <p className="font-semibold text-lg">
                                    {booking.salonName}
                                </p>

                            </div>

                            <div className="flex gap-3">

                                <EnvironmentOutlined className="text-blue-600 mt-1" />

                                <span className="text-gray-600">
                                    {booking.location}
                                </span>

                            </div>

                            <div className="flex gap-3">

                                <PhoneOutlined className="text-blue-600 mt-1" />

                                <span className="text-gray-600">
                                    {booking.salonMobile || "+91 XXXXXXXXXX"}
                                </span>

                            </div>

                            <div>

                                <span className="font-medium">
                                    GSTIN :
                                </span>

                                <span className="ml-2 text-gray-600">
                                    08ABCDE1234F1Z5
                                </span>

                            </div>
                            <div>

                                <span className="font-medium">
                                    Email :
                                </span>

                                <span className="ml-2 text-gray-600">
                                    {booking.salonEmail || "salon@email.com"}
                                </span>

                            </div>
                        </div>

                    </div>



                    <div className="border rounded-xl p-6 shadow-sm">

                        <h2 className="font-bold text-lg text-[#1E3A8A] mb-5">
                            Customer Details
                        </h2>

                        <div className="space-y-4">

                            <div className="flex gap-3">

                                <UserOutlined className="text-blue-600 mt-1" />

                                <span className="font-semibold">
                                    {booking.customerName || "Customer"}
                                </span>

                            </div>

                            <div className="flex gap-3">

                                <PhoneOutlined className="text-blue-600 mt-1" />

                                <span>
                                    {booking.customerMobile || "+91 XXXXXXXXXX"}
                                </span>

                            </div>

                            <div>

                                <span className="font-medium">
                                    Email :
                                </span>

                                <span className="ml-2 text-gray-600">
                                    {booking.customerEmail || "customer@email.com"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="px-10 pb-8">

                    <div className="border rounded-xl overflow-hidden shadow-sm">

                        <div className="bg-[#1E3A8A] text-white px-6 py-3">
                            <h2 className="text-lg font-semibold">
                                Appointment Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-4 gap-6 p-6">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    <CalendarOutlined className="mr-2" />
                                    Appointment Date
                                </p>

                                <h3 className="font-semibold mt-1">
                                    {booking.date}
                                </h3>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Time
                                </p>

                                <h3 className="font-semibold mt-1">
                                    {booking.time}
                                </h3>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Staff
                                </p>

                                <h3 className="font-semibold mt-1">
                                    {booking.staffName || "Assigned Staff"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Payment Mode
                                </p>

                                <span className="inline-block mt-1 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                    CASH
                                </span>
                            </div>

                        </div>

                    </div>

                </div>



                <div className="px-10 pb-10">

                    <div className="border rounded-xl overflow-hidden shadow-sm">

                        <div className="bg-[#1E3A8A] text-white px-6 py-3">

                            <h2 className="text-lg font-semibold">
                                Services
                            </h2>

                        </div>

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="text-left p-4">
                                        Service
                                    </th>

                                    <th className="text-center">
                                        Duration
                                    </th>

                                    <th className="text-right pr-6">
                                        Price
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {booking.services?.map((service: any, index: number) => (

                                    <tr
                                        key={index}
                                        className="border-b last:border-none hover:bg-gray-50"
                                    >

                                        <td className="p-4 font-medium">
                                            {service.name}
                                        </td>

                                        <td className="text-center text-gray-600">
                                            {service.duration} min
                                        </td>

                                        <td className="text-right pr-6 font-semibold text-green-700">
                                            ₹{service.price}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>



                <div className="px-10 pb-10">

                    <div className="flex justify-end">

                        <div className="w-[360px] rounded-xl border overflow-hidden shadow">

                            <div className="bg-gray-50 p-5 space-y-3">

                                <div className="flex justify-between">

                                    <span>
                                        Sub Total
                                    </span>

                                    <span className="font-semibold">
                                        ₹{subtotal.toFixed(2)}
                                    </span>

                                </div>
<<<<<<< HEAD

=======
<div className="flex justify-between">

                                    <span>
                                        GST(5%)
                                    </span>

                                    <span className="font-semibold">
                                        + ₹{gst.toFixed(2)}
                                    </span>

                                </div>
>>>>>>> master
                                <div className="flex justify-between">

                                    <span>
                                        Discount(2%)
                                    </span>

                                    <span className="font-semibold">
                                        - ₹{discount.toFixed(2)}
                                    </span>

                                </div>

<<<<<<< HEAD
                                <div className="flex justify-between">

                                    <span>
                                        GST(5%)
                                    </span>

                                    <span className="font-semibold">
                                        + ₹{gst.toFixed(2)}
                                    </span>

                                </div>
=======
                                
>>>>>>> master

                            </div>

                            <div className="bg-[#1E3A8A] text-white px-6 py-5">

                                <div className="flex justify-between items-center">

                                    <span className="text-xl font-semibold">
                                        Grand Total
                                    </span>

                                    <span className="text-2xl font-bold">
                                        ₹{grandTotal.toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                <div className="px-10 pb-10">

                    <div className="grid grid-cols-2 gap-8">



                        <div>

                            <div className="inline-flex items-center gap-3 bg-green-100 border border-green-300 rounded-full px-6 py-3">

                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
                                    ✓
                                </div>

                                <div>

                                    <h3 className="font-bold text-green-700">
                                        PAYMENT SUCCESSFUL
                                    </h3>

                                    <p className="text-sm text-green-600">
                                        This invoice has been fully paid.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-8">

                                <h3 className="font-semibold text-lg">
                                    Thank You
                                </h3>

                                <p className="text-gray-500 mt-2 leading-7">

                                    Thank you for choosing
                                    <span className="font-semibold text-[#1E3A8A]">
                                        {" "}BookMySalon
                                    </span>.

                                    <br />

                                    We appreciate your visit and look forward to serving you again.

                                </p>

                            </div>

                        </div>



                        <div className="flex flex-col items-end gap-24">

                            <div className="text-right">

                                <h2 className="border-4 border-green-600 text-green-600 text-3xl font-bold px-8 py-3 rounded-md bg-white">

                                    PAID

                                </h2>

                            </div>

                            <div className="text-right">

                                <div className="border-b border-gray-400 w-52 ml-auto mb-2">
                                    <img src={sign} alt="Authorized Signature" />
                                </div>

                                <p className="font-semibold">
                                    Authorized Signature
                                </p>

                                <p className="text-gray-500 text-sm">
                                    BookMySalon
                                </p>

                            </div>

                        </div>

                    </div>

                </div>



                <div className="bg-gray-100 px-10 py-6 border-t">

                    <div className="flex justify-between items-center">

                        <div>

                            <h3 className="font-semibold">
                                Terms & Conditions
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">

                                • This is a computer generated invoice.

                                <br />

                                • No signature is required.

                                <br />

                                • Please keep this invoice for future reference.

                            </p>

                        </div>

                        <div className="text-right">

                            <img
                                src={logo}
                                className="w-16 h-16 ml-auto"
                            />

                            <h3 className="font-bold text-[#1E3A8A] mt-2">
                                BOOK MY SALON
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Premium Salon Management
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Invoice;