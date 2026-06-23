import { Spin, Button, Card, message } from "antd";
import { CloseCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png'
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/authSlice";
const salonstatus = () => {
    const [ownername, setownername] = useState('')
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        dispatch(logout());

        message.success("Logged out successfully");

        navigate("/");
    };
    useEffect(() => {
        setownername(user.salonownername);

    }, [])
    const [status, setStatus] = useState("processing")

    const user = useAppSelector(
        (state) => state.auth.user
    );
    useEffect(() => {

        setStatus(user.status || "");

    }, [])
    return (
        <div>
            <div>
                <div className="flex items-center bg-gradient-to-b from-blue-700 to-blue-600
             gap-3  p-3">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <img src={logo} alt="" />

                    </div>
                    <div className='text-white'>
                        <h1 className="text-lg  m-0 leading-[0.8]  ">BookMySalon</h1>
                        <span className="  text-sm text-white/70">Premium Booking</span>
                    </div>
                </div>

            </div>
            <div className=" flex justify-center items-center m-6 ">
                {status === "pending" && (
                    <Card
                        className="w-full max-w-md text-center rounded-2xl shadow-lg"
                        bodyStyle={{ padding: 40 }}
                    >
                        <div>
                            <h3 className="text-xl mb-6 font-bold text-gray-800">Mr.{ownername}</h3>
                        </div>
                        <Spin size="large" />

                        <h2 className="mt-6 text-xl font-semibold">
                            Your request is currently being processed
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Please wait while we complete the process, in the 2-3 working days.
                        </p>

                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            className="mt-8"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Card>
                )}
                {status === "rejected" && (
                    <Card
                        className="w-full max-w-md text-center rounded-2xl shadow-lg"
                        bodyStyle={{ padding: 40 }}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <CloseCircleOutlined className="text-3xl text-red-600" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            Mr. {ownername}
                        </h3>

                        <h2 className="mt-4 text-2xl font-semibold text-red-600">
                            Application Rejected
                        </h2>

                        <p className="text-gray-600 mt-4">
                            Unfortunately, your salon application could not be approved at this time.
                        </p>

                        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                            <p className="font-semibold text-red-700 mb-2">
                                Rejection Reason:
                            </p>

                            <p className="text-gray-700">
                                Incomplete documentation was submitted during the application process.
                                Please ensure that all information and supporting documents are accurate,
                                complete, and original before reapplying.
                            </p>
                        </div>

                        <p className="text-gray-600 mt-5">
                            You may submit a new application after correcting the information and uploading valid documents.
                        </p>

                        <Button
                            type="primary"
                            className="mt-8"
                            onClick={() => navigate("/applysalon")}
                        >
                            Apply Again
                        </Button>

                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            className="mt-3 ml-3"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default salonstatus
