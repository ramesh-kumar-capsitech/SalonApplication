import { useQuery } from "@tanstack/react-query";
import { getApiAuthGetallcontacts } from "../api/generated/loginsignuphome";
import { Avatar, Empty, Spin, Tag } from "antd";
import dayjs from "dayjs";

const CustomerMessages: React.FC = () => {
    const {
        data: allContacts = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["contacts"],
        queryFn: async () => {
            const res = await getApiAuthGetallcontacts();
            return res.data;
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[11px] pb-0 mb-3">
                <div className="pt-3">
                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        Customer Messages
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Manage customer messages
                    </p>
                </div>
            </div>

            <hr />

            <div className="flex flex-col gap-3 m-3">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load customer messages</span>} />
                    </div>
                ) : allContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty
                            description={
                                <span className="font-[outfit]">
                                    No customer messages found.
                                </span>
                            }
                        />
                    </div>
                ) : (
                    allContacts.map((contact: any) => (
                        <div
                            key={contact.id}
                            className="border border-gray-200 rounded-xl p-4 bg-white"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="grid md:flex gap-3 min-w-0">
                                    <div className="text-sm text-gray-500 w-20 sm:w-24 flex-shrink-0">
                                        <div>
                                            {dayjs(contact.time).format("h:mm A") || "Time not available"}
                                        </div>

                                        <div className="font-semibold text-black">
                                            {dayjs(contact.date).format("DD MMM YYYY") || "Date not available"}
                                        </div>
                                    </div>

                                    <Avatar className="hidden md:block bg-blue-100 text-blue-600 flex-shrink-0">
                                        {(
                                            contact.name ||
                                            contact.customerName ||
                                            "S"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="font-medium m-0 break-words text-gray-900">
                                            {contact.name ||
                                                contact.customerName ||
                                                "Suresh Bishnoi 007"}
                                        </p>

                                        <p className="text-xs text-gray-500 m-0 break-words">
                                            Email:{" "}
                                            {contact.email || "sb@gmail.com"}
                                        </p>

                                        <p className="text-blue-600 text-xs mt-2 mb-0 break-words">
                                            Subject:{" "}
                                            {contact.subject ||
                                                "Service completed successfully"}
                                        </p>

                                        <p className="text-green-600 text-xs mt-1 mb-0 break-words">
                                            Message:{" "}
                                            {contact.message ||
                                                "Service completed successfully"}
                                        </p>
                                    </div>
                                </div>

                                <div className="self-start sm:self-auto">
                                    <Tag color="blue" className="cursor-pointer">
                                        Reply 
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerMessages;