import { CalendarOutlined, ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Empty, Spin, Tag } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { getApiAuthGetreplybyidId } from "../api/generated/loginsignuphome";
import dayjs from "dayjs";
import { useEffect } from "react";
const Inbox = () => {
    const currentPath = window.location.pathname;
        const authData =JSON.parse(localStorage.getItem("persist:auth")!);

        const user =JSON.parse(authData.user);
     const {data: inbox = [],isLoading,error,} = useQuery({
            queryKey: ["contacts", user.id],
            queryFn: async () => {
                const res = await getApiAuthGetreplybyidId(user.id);
                
                return res.data;
            },
        });
 const queryClient = useQueryClient();
useEffect(() => {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7074/contactmessagereply")
                .withAutomaticReconnect()
                .build();
    
            connection
                .start()
                .then(() => {
                    console.log(" SignalR Connected");
                })
                .catch((err) => {
                    console.error(" SignalR Connection Error:", err);
                });
    
            connection.on("MessageUpdated", () => {
                console.log(" Message Received");
    
                queryClient.invalidateQueries({
                    queryKey: ["contacts"],
                });
            });
    
            return () => {
                connection.stop();
            };
        }, [queryClient]);
    return (
        <div>
             <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        Inbox              </h1>
                        <p>All Messages from BookMySalon</p>

                </div>
                <div>
                   <Dropdown
                                menu={{
                                    items: [
                                       {
                                            key: "contact",
                                            label: "Contact",
                                            disabled: currentPath === "/customer/contact",
                                        },
                                        {
                                            key: "inbox",
                                            label: "Inbox",
                                            disabled: currentPath === "/customer/inbox",
                                        },
                                        {
                                            key: "sent",
                                            label: "Sent",
                                            disabled: currentPath === "/customer/sent",
                                        },
                                    ],
                                    onClick: ({ key }) => {
                                        if (key === "inbox") {
                                            window.location.href = "/customer/inbox";
                                        } else if (key === "sent") {
                                            window.location.href = "/customer/sent";
                                        }
                                        else if (key === "contact") {
                                            window.location.href = "/customer/contact";
                                        }
                                    }
                                    // onClick: ({ key }) => handleMenuClick(key, salon.id)
                                }}
                            >
                                <Button shape="circle" icon={<MoreOutlined />} />
                            </Dropdown>
                </div>

            </div>
            <hr />
            <div>
                {
                isLoading ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Empty description={<span className="font-[outfit] text-red-500">Failed to load customer messages</span>} />

                       
                    </div>
                ) : inbox.length === 0 ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <p>No messages found</p>
                    </div>
                ) : (
                inbox.map((contact: any) => (
                                            <div className="m-3">
                                       <div key={contact.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                           
                                          
                                           <div className="p-4 sm:p-5">
                           
                                              
                                               <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                           
                                                  
                                                   <div className="w-full sm:w-24 flex-shrink-0 text-sm text-gray-500">
                                                       <div>
                                                            {dayjs(contact.messageDateTime).format("h:mm A")}
                                                       </div>
                           
                                                       <div className="font-semibold text-gray-900">
                                                           {dayjs(contact.messageDateTime).format("DD MMM YYYY")}
                                                       </div>
                                                   </div>
                           
                                                  
                                                   <Avatar
                                                       className="bg-blue-100 text-blue-600 flex-shrink-0"
                                                       size={38}
                                                   >
                                                       {contact.customerName
                                                           .charAt(0)
                                                           .toUpperCase()}
                                                   </Avatar>
                           
                                                  
                                                   <div className="min-w-0 flex-1">
                           
                                                       <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                           <p className="font-semibold text-gray-900 m-0 break-words">
                                                               {contact.customerName}
                                                           </p>
                           
                                                           <Tag color="blue" className="w-fit m-0">
                                                               You
                                                           </Tag>
                                                       </div>
                           
                                                       <p className="text-xs text-gray-500 m-0 mt-1 break-all">
                                                           Email: {contact.customerEmail}
                                                       </p>
                           
                                                       <p className="text-sm text-blue-600 font-medium mt-2 mb-1 break-words">
                                                           Subject: {contact.customerSubject}
                                                       </p>
                           
                                                       <p className="text-sm text-gray-600 leading-5 m-0 break-words">
                                                           {contact.customerMessage}
                                                       </p>
                                                   </div>
                                               </div>
                                           </div>
                           
                                           
                                           <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-5 py-2">
                                               <span className="text-xs font-semibold text-gray-500 uppercase">
                                                    Reply From BookMySalon
                                               </span>
                                           </div>
                           
                                           
                                           <div className="p-4 sm:p-5">
                           
                                               <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                           
                                                   
                                                   <div className="w-full sm:w-24 flex-shrink-0 text-sm text-gray-500">
                                                       <div>
                                                            {dayjs(contact.createdAt).format("h:mm A")}
                                                       </div>
                           
                                                       <div className="font-semibold text-gray-900">
                                                            {dayjs(contact.createdAt).format("DD MMM YYYY")}
                                                       </div>
                                                   </div>
                           
                                                 
                                                   <Avatar
                                                       className="bg-green-100 text-green-600 flex-shrink-0"
                                                       size={38}
                                                   >
                                                       A
                                                   </Avatar>
                           
                                                  
                                                   <div className="min-w-0 flex-1">
                           
                                                       <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                           <p className="font-semibold text-gray-900 m-0">
                                                               Admin
                                                           </p>
                           
                                                           <Tag color="green" className="w-fit m-0">
                                                               Replied
                                                           </Tag>
                                                       </div>
                           
                                                       <p className="text-sm text-blue-600 font-medium mt-2 mb-1 break-words">
                                                           Subject: {contact.replySubject}
                                                       </p>
                           
                                                       <p className="text-sm text-gray-600 leading-5 m-0 break-words">
                                                           {contact.replyMessage}
                                                       </p>
                                                   </div>
                                               </div>
                                           </div>
                           
                                       </div>
                                   </div>
                )
                )
            )
            }
            </div>

            
           
        </div>
    );
};

export default Inbox;