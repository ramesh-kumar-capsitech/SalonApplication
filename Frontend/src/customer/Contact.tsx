import React from "react";
import { Card, Form, Input, Button, Avatar } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

import emailjs from "@emailjs/browser";
import { message } from "antd";
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

const Contact = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        Contact              </h1>

                </div>

            </div>

            <hr />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-[Outfit] m-6">


                <Card className="rounded-2xl border" bodyStyle={{ padding: 28 }}>
                    <h2 className="text-lg font-semibold mb-6">
                        Send us a Message
                    </h2>

                    <Form layout="vertical">
                        <Form.Item label={<span className="font-[Outfit]">Full Name</span>}>
                            <Input placeholder="John Doe" />
                        </Form.Item>

                        <Form.Item label={<span className="font-[Outfit]">Email</span>} >
                            <Input placeholder="john@example.com" />
                        </Form.Item>

                        <Form.Item label={<span className="font-[Outfit]">Subject</span>}>
                            <Input placeholder="How can we help?" />
                        </Form.Item>

                        <Form.Item label={<span className="font-[Outfit]">Message</span>}>
                            <Input.TextArea
                                rows={4}
                                placeholder="Your message..."
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            className="w-full rounded-full h-11"
                        >
                            Send Message
                        </Button>
                    </Form>
                </Card>

                {/* RIGHT : CONTACT INFO */}
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

export default Contact
