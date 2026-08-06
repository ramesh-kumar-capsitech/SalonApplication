import React from "react";
import { Card, Typography } from "antd";


const { Title, Paragraph, Text } = Typography;

const Privacy = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        Privacy Policy              </h1>

                </div>

            </div>

            <hr />
            <div className="m-6">
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 32 }}
                >

                    <Text className="text-gray-500 text-sm font-[Outfit] ">
                        Last updated: January 19, 2026
                    </Text>


                    <Title level={4} className="mt-6 font-[Outfit]">
                        1. Information We Collect
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        We collect information that you provide directly to us, including
                        your name, email address, phone number, and payment information
                        when you create an account or make a booking.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        2. How We Use Your Information
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        We use the information we collect to provide, maintain, and improve
                        our services, process your bookings, send confirmations and updates,
                        and communicate with you about our services.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        3. Information Sharing
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        We share your booking information with the salon where you have made
                        a reservation. We do not sell your personal information to third
                        parties.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        4. Data Security
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        We implement appropriate security measures to protect your personal
                        information. However, no method of transmission over the Internet is
                        100% secure, and we cannot guarantee absolute security.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        5. Your Rights
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        You have the right to access, update, or delete your personal
                        information at any time. You can do this through your account
                        settings or by contacting us directly.
                    </Paragraph>
                </Card>


            </div>
        </div>
    )
}

export default Privacy
