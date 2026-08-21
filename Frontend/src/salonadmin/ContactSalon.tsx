import React, { useEffect } from "react";
import { Card, Form, Input, Button, Avatar, message, Dropdown } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    MoreOutlined,
} from "@ant-design/icons";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthGetcustomerprofileId, getApiAuthGetsalonprofileId, postApiAuthContact } from "../api/generated/loginsignuphome";
interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    lines: string[];
}

const InfoCard: React.FC<InfoCardProps> = ({
    icon,
    title,
    lines,
}) => {
    
    return (
        <Card className="rounded-2xl border" bodyStyle={{ padding: 20 }}>
            <div className="flex items-start gap-4">
                <Avatar className="bg-blue-100 text-blue-600">
                    {icon}
                </Avatar>

                <div>
                    <h3 className="font-medium mb-1">{title}</h3>
                    {lines.map((line) => (
                        <p
                            key={line}
                            className="text-gray-500 m-0 text-sm"
                        >
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const ContactSalon = () => {
     const [form] = Form.useForm();
    const [profileForm] = Form.useForm();
     const authData = JSON.parse(
        localStorage.getItem("persist:auth")!
    );

    const user = JSON.parse(authData.user);

    const userId = user.id;

    const { data: profileData } = useQuery({
        queryKey: ["adminProfile", userId],

        queryFn: async () => {
            const res = await getApiAuthGetsalonprofileId(userId)
console.log(res.data)
            return res.data.data;


        },




    });
    useEffect(() => {
        if (profileData) {
            profileForm.setFieldsValue({
                fullName: profileData.ownerName,
                email: profileData.email,
                phone: profileData.mobileNumber,
            });

            

          
        }
    }, [profileData]);

    const queryClient = useQueryClient();
        const messagecontactMutation =
        useMutation({
            mutationFn: async (values: any) => {

                const res =
                    await postApiAuthContact(
                        {
                            Name:
                                values.fullName,

                            Email:
                                values.email,

                            Subject:
                                values.subject,

                            Message:
                                values.message,
                            CustomerId: userId,   
                        }
                    );

                return res.data;
            },

            onSuccess: () => {

                message.success(
                    "Message sent successfully"
                );
                profileForm.resetFields(["message" , "subject"]);
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts",
                        userId,
                    ],
                });
            },

            onError: (
                error: any
            ) => {

                message.error(
                    error?.response?.data
                        ?.message ||
                    "Something went wrong"
                );
            },
        });
        const handleSendMessage = (values: any) => {

        messagecontactMutation.mutate(
            values
        );
    };
    const currentPath = window.location.pathname;
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        Contact              </h1>
                        <p>Here to get in touch with us </p>

                </div>
                <div>
                       <Dropdown
                                menu={{
                                    items: [

                                       {
                                            key: "contact",
                                            label: "Contact",
                                            disabled: currentPath === "/salonadmin/contactsalon",
                                        },
                                        {
                                            key: "newmessage",
                                            label: "New Message",
                                            disabled: currentPath === "/salonadmin/newmessage",
                                        },
                                        {
                                            key: "inbox",
                                            label: "Inbox",
                                            disabled: currentPath === "/salonadmin/inboxsalon",
                                        },
                                        {
                                            key: "sent",
                                            label: "Sent",
                                            disabled: currentPath === "/salonadmin/sentmessagesalon",
                                        },
                                    ],
                                    onClick: ({ key }) => {
                                        if (key === "inbox") {
                                            window.location.href = "/salonadmin/inboxsalon";
                                        } else if (key === "sent") {
                                            window.location.href = "/salonadmin/sentmessagesalon";
                                        }
                                        else if (key === "contact") {
                                            window.location.href = "/salonadmin/contactsalon";
                                        }
                                        else if (key === "newmessage") {
                                            window.location.href = "/salonadmin/newmessage";
                                        }
                                    }
                                    
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                </div>

            </div>

            <hr />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-[Outfit] m-6">


                <Card className="rounded-2xl border" bodyStyle={{ padding: 28 }}>
                    <h2 className="text-lg font-semibold mb-6">
                        Send us a Message
                    </h2>

                    <Form layout="vertical"  form={profileForm} onFinish={handleSendMessage}>
                        <Form.Item name="fullName" label={<span className="font-[Outfit]">Full Name</span>} 
                      rules={[
                        
                            {
                                required: true,
                                message: "Name is required"
                            },

                            {
                                min: 3,
                                message: "Minimum 3 characters required"
                            }
                              ]}>
                            <Input placeholder="John Doe" />
                        </Form.Item>

                        <Form.Item name="email" label={<span className="font-[Outfit]">Email</span>} 
                      rules={[
                        
                            {
                                required: true,
                                message: "Email is required"
                            },

                            {
                                type: "email",
                                message: "Please enter a valid email"
                            }
                              ]}>   
                            <Input placeholder="john@example.com" />
                        </Form.Item>

                        <Form.Item name="subject" label={<span className="font-[Outfit]">Subject</span>} 
                      rules={[
                        
                            {
                                required: true,
                                message: "Subject is required"
                            },
                            {
                                min: 6,
                                message: "Minimum 6 characters required"
                            }
                              ]}>
                            <Input placeholder="How can we help?" />
                        </Form.Item>

                        <Form.Item name="message" label={<span className="font-[Outfit]">Message</span>} 
                      rules={[
                        
                            {
                                required: true,
                                message: "Message is required"
                            },
                            {
                                min: 6,
                                message: "Minimum 6 characters required"
                            }
                              ]}>
                            <Input.TextArea
                                rows={4}
                                placeholder="Your message..."
                            />
                        </Form.Item>

                        <Button
                          htmlType="submit"
                            type="primary"
                            className="w-full rounded-full h-11"
                        >
                            Send Message
                        </Button>
                    </Form>
                </Card>

              
                <div className="space-y-6">
                    <InfoCard
                        icon={<MailOutlined />}
                        title="Email"
                        lines={[
                            "support@bookmysalon.com",
                            "info@bookmysalon.com",
                        ]}
                    />

                    <InfoCard
                        icon={<PhoneOutlined />}
                        title="Phone"
                        lines={[
                            "+1 (555) 123-4567",
                            "+1 (555) 987-6543",
                        ]}
                    />

                    <InfoCard
                        icon={<EnvironmentOutlined />}
                        title="Address"
                        lines={[
                            "123 Beauty Boulevard",
                            "New York, NY 10001",
                        ]}
                    />

                    <InfoCard
                        icon={<ClockCircleOutlined />}
                        title="Business Hours"
                        lines={[
                            "Monday - Sunday: 9AM - 8PM",

                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContactSalon
