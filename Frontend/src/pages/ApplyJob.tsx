import React, { useEffect, useState } from 'react'
import {
    Form,
    Input,
    Button,
    Card,
    Select,
    InputNumber,
    Upload,
    message,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyJob = () => {

    const [salon, setsalons] = useState([])
    useEffect(() => {
        axios.get("http://localhost:3001/auth/approved-salons").then(res => {
            const formatted = res.data.data.map((salon: any) => ({
                value: salon._id,
                label: `${salon.salonname} - ${salon.city} `
            }))
            setsalons(formatted)
        }).catch(err => {
            console.log(err)

        })
    }, [])

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [applyjob, setapplyjob] = useState({
        salonId: "",
        name: "",
        role: "",
        email: "",
        phone: "",
        skills: "",
        experience: '',
        availability: ""


    })
    const [msg, setmsg] = useState("")
    const [isError, setisError] = useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setapplyjob({ ...applyjob, [e.target.name]: e.target.value })
    }
    const onFinish = async (values: any) => {
        console.log(values)
        try {
            const res = await axios.post("http://localhost:3001/auth/apply-job",
                values
            );
            const { success, message: responseMessage } = res.data;
            if (success) {
                setmsg(responseMessage);
                setisError(false);
                message.success(responseMessage);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setmsg(responseMessage);
                setisError(true);
                message.error(responseMessage);
            }
        }
        catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            setmsg(errorMessage);
            setisError(true);
            message.error(errorMessage);

        }

        console.log("Salon ", values);
    }
    return (
        <div>
            <div className="min-h-screen bg-gray-50 flex justify-center p-10">
                <Card
                    className="w-full max-w-3xl rounded-2xl"
                    bodyStyle={{ padding: 32 }}
                >
                    <h2 className="text-2xl font-semibold mb-2">
                        Apply for Salon Staff
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Fill the form below to apply as a salon employee
                    </p>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<span className="font-[Outfit] ">Select Salon</span>}

                            name="salonId"
                            rules={[{ required: true, message: "Please select a salon" }]}
                        >
                            <Select
                                placeholder="Choose salon you want to apply for"
                                options={salon}
                                onChange={handleChange}
                                className='font-[Outfit] '
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Full Name</span>}

                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                onChange={handleChange}
                                placeholder="Sarah Johnson"
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Designation / Role</span>}


                            name="role"
                            rules={[{ required: true }]}
                        >
                            <Select
                                className='font-[Outfit] '
                                placeholder="Select role"
                                onChange={handleChange}
                                options={[
                                    { value: "Senior Stylist", label: "Senior Stylist" },
                                    { value: "Hair Stylist", label: "Hair Stylist" },
                                    { value: "Colorist", label: "Colorist" },
                                    { value: "Barber", label: "Barber" },
                                ]}
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Email</span>}

                            name="email"
                            rules={[{ required: true, type: "email" }]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                onChange={handleChange}
                                placeholder="sarah@email.com"
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Phone Number</span>}

                            name="phone"
                            rules={[{ required: true }]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                onChange={handleChange}
                                placeholder="+1 (555) 111-2222"
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Skills</span>}

                            name="skills"
                            rules={[{ required: true }]}
                        >
                            <Select
                                className='font-[Outfit] '
                                mode="multiple"
                                onChange={handleChange}
                                placeholder="Select skills"
                                options={[
                                    { value: "Haircut", label: "Haircut" },
                                    { value: "Styling", label: "Styling" },
                                    { value: "Hair Coloring", label: "Hair Coloring" },
                                    { value: "Facial", label: "Facial" },
                                    { value: "Manicure", label: "Manicure" },
                                ]}
                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Experience (Years)</span>}


                            name="experience"
                            rules={[{ required: true }]}
                        >
                            <Input

                                onChange={handleChange}
                                className="w-full"
                                placeholder="e.g. 5"

                            />
                        </Form.Item>


                        <Form.Item
                            label={<span className="font-[Outfit] ">Availability</span>}


                            name="availability"
                            rules={[{ required: true }]}
                        >
                            <Select
                                className='font-[Outfit] '
                                placeholder="Select availability"
                                onChange={handleChange}
                                options={[
                                    { value: "Available", label: "Available" },
                                    { value: "Part Time", label: "Part Time" },
                                    { value: "Full Time", label: "Full Time" },
                                ]}
                            />
                        </Form.Item>


                        {/* <Form.Item label={<span className="font-[Outfit] ">Upload Resume / Photo</span>}
                            name="resume">
                            <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload File</Button>
                            </Upload>
                        </Form.Item> */}
                        {isError && <div className="text-red-500 mb-4">{msg}</div>}
                        {!isError && msg && <div className="text-green-500 mb-4">{msg}</div>}
                        <div>
                            <div className="text-sm  ">
                                Don't have an account?
                                <span className='text-blue-700 hover:underline'> <Link to="/signup"> as customer</Link></span>  and <span className='text-blue-700 hover:underline'> <Link to="/applysalon"> Apply for Salon </Link></span>  and <span className='text-blue-700 hover:underline'></span> You have an account?
                                <span className='text-blue-700 hover:underline'> <Link to="/"> Please SignIn  </Link></span>
                                <span >Please check your <Link to="/applicationcheckform"> <span className='text-blue-700 hover:underline'> job application status </span></Link></span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <Button htmlType="reset">Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Submit Application
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div >
    )
}

export default ApplyJob
