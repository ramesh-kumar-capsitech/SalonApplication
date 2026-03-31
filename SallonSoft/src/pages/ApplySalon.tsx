import {
    Form,
    Input,
    Button,
    Upload,
    Card,
    Row,
    Col,
    Tag,
    message,
    Select

} from "antd";
import {
    UploadOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import salon from "./Saloncheck";


const ApplySalon = () => {
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        console.log(values)
        try {
            const parsedServices = values.services.map((s) => JSON.parse(s));

            const finalData = {
                ...values,
                services: parsedServices
            };
            const res = await axios.post(
                "http://localhost:3001/auth/applysalon",
                finalData
            );
            const { success, message: responseMessage } = res.data;
            if (success) {
                setmsg(responseMessage);
                setisError(false);
                message.success(responseMessage);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
            // if (!success) {
            //     setmsg(responseMessage);
            //     setisError(true);

            // }

            else {
                setmsg(responseMessage);
                setisError(true);
                message.error(responseMessage);
            }

        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            setmsg(errorMessage);
            setisError(true);
            message.error(errorMessage);

        }

        console.log("Salon ", values);
    };
    const navigate = useNavigate()
    const [applysalon, setapplysalon] = useState({
        salonname: "",
        city: "",
        ownername: "",
        phone: "",
        email: "",
        joinedyear: "",
        salonaddress: "",
        salondescription: "",
        staff: "",
        services: "",


    })
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const [errorDetails, setErrorDetails] = useState<any>(null)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setapplysalon({ ...applysalon, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <div className="p-10 bg-gray-50 min-h-screen flex justify-center">
                <Card className="w-full max-w-4xl rounded-2xl" bodyStyle={{ padding: 32 }}>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Apply New Salon</h2>
                        <p className="text-gray-500">
                            Submit your salon details for admin approval
                        </p>
                    </div>

                    <Form

                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}

                    >

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Salon Name</span>}
                                    name="salonname"
                                    rules={[{ required: true }]}

                                >
                                    <Input placeholder="Elite Styles" onChange={handleChange} name="salonname" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">City</span>}

                                    name="city"
                                    rules={[{ required: true }]}
                                >
                                    <Input prefix={<EnvironmentOutlined />} placeholder="Manhattan, NY" onChange={handleChange} name="city" />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Owner Name</span>}

                                    name="ownername"
                                    rules={[{ required: true }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Jennifer Lee" onChange={handleChange} name="ownername" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Phone</span>}

                                    name="phone"
                                    rules={[{ required: true }]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" onChange={handleChange} name="phone" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Email</span>}

                                    name="email"
                                    rules={[{ required: true, type: "email" }]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="salon@email.com" onChange={handleChange} name="email" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Joined Year</span>}

                                    name="joinedyear"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Jun 2025" onChange={handleChange} name="joinedyear" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Services</span>}

                                    name="services"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select services"
                                        optionLabelProp="label"
                                    >
                                        <Select.Option
                                            value={JSON.stringify({
                                                name: "Haircut",
                                                price: 100,
                                                duration: 20
                                            })}
                                            label="Haircut"
                                        >
                                            Haircut - ₹100 (20 min)
                                        </Select.Option>

                                        <Select.Option
                                            value={JSON.stringify({
                                                name: "Hair Spa",
                                                price: 300,
                                                duration: 40
                                            })}
                                            label="Hair Spa"
                                        >
                                            Hair Spa - ₹300 (40 min)
                                        </Select.Option>

                                        <Select.Option
                                            value={JSON.stringify({
                                                name: "Facial",
                                                price: 500,
                                                duration: 60
                                            })}
                                            label="Facial"
                                        >
                                            Facial - ₹500 (60 min)
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-[Outfit] ">Total Staff</span>}

                                    name="staff"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Total Staff" onChange={handleChange} name="staff" />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Salon Address</span>}

                            name="salonaddress"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="123 Fifth Avenue, New York, NY 10001"
                                onChange={handleChange}
                                name="salonaddress"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-[Outfit] ">Salon Description</span>}

                            name="salondescription"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Premium full-service salon specializing in hair styling, coloring, and beauty treatments."
                                onChange={handleChange}
                                name="salondescription"
                            />
                        </Form.Item>

                        {/* 
                        <div className="mb-6">
                            <Tag color="green">Active</Tag>
                            <Tag color="gold">Pending Review</Tag>
                        </div> */}

                        {/* 
                        <Form.Item

                            label={<span className="font-[Outfit] ">Upload Salon Images (3 required)</span>}


                            name="images"
                            rules={[{ required: true }]}
                        >
                            <Upload
                                listType="picture-card"
                                maxCount={3}
                                beforeUpload={() => false}
                            >
                                <UploadOutlined />
                                <div>Upload</div>
                            </Upload>
                        </Form.Item> */}

                        {isError && <div className="text-red-500 mb-4">{msg}</div>}
                        {!isError && msg && <div className="text-green-500 mb-4">{msg}</div>}


                        <div>
                            <div >
                                <div className="text-sm  ">
                                    Don't have an account?
                                    <span className='text-blue-700 hover:underline'> <Link to="/signup"> as customer</Link></span>  and <span className='text-blue-700 hover:underline'></span>  and <span className='text-blue-700 hover:underline'> <Link to="/applyjob"> As a Employee</Link></span> You have an account?
                                    <span className='text-blue-700 hover:underline'> <Link to="/salonstatuscheck"> Please check salon status</Link></span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <Button htmlType="reset">Cancel</Button>
                                <Button type="primary" htmlType="submit" >
                                    Submit for Approval
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div >
    )
}

export default ApplySalon
