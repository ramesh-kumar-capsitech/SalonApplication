import React from "react";
import { Card, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;
const Terms = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        Terms and Service               </h1>

                </div>

            </div>

            <hr />
            <div className="m-6" >
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 32 }}
                >

                    <Text className="text-gray-500 text-sm font-[Outfit] ">
                        Last updated: January 19, 2026
                    </Text>


                    <Title level={4} className="mt-6 font-[Outfit]">
                        1. Acceptance of Terms
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        By accessing and using SalonBook's platform, you agree to be bound
                        by these Terms of Service. If you do not agree to these terms,
                        please do not use our service.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        2. Booking and Cancellations
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        All bookings made through our platform are subject to availability.
                        Cancellations must be made at least 24 hours in advance to avoid
                        cancellation fees. The salon reserves the right to charge a fee
                        for late cancellations or no-shows.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        3. Payment Terms
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        Payment is required at the time of booking or upon service completion,
                        depending on the salon's policy. All prices are listed in USD and
                        are subject to change without notice.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        4. User Responsibilities
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        Users are responsible for maintaining the confidentiality of their
                        account information and for all activities that occur under their
                        account. You agree to notify us immediately of any unauthorized
                        use of your account.
                    </Paragraph>


                    <Title level={4} className="font-[Outfit]">
                        5. Limitation of Liability
                    </Title>
                    <Paragraph className="text-gray-600 font-[Outfit]">
                        SalonBook acts as a platform connecting customers with salons.
                        We are not responsible for the quality of services provided by salons.
                        Any disputes regarding services should be resolved directly with the salon.
                    </Paragraph>
                </Card>
            </div>
        </div>
    )
}

export default Terms
