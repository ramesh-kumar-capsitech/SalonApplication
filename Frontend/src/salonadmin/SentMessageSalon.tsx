import { CalendarOutlined, ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Empty, Input, Spin, Tag } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import * as signalR from "@microsoft/signalr";
import Divider from "antd/es/divider";
import { UserOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthGetcontactbyidId } from "../api/generated/loginsignuphome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const SentMessageSalon = () => {
        const currentPath = window.location.pathname;
        const authData =JSON.parse(localStorage.getItem("persist:auth")!);

        const user =JSON.parse(authData.user);

        const {data: allContacts = [],isLoading,error,} = useQuery({
        queryKey: ["contacts", user.id],
        queryFn: async () => {
            const res = await getApiAuthGetcontactbyidId(user.id);
            console.log("allContacts", res.data);
            return res.data;
        },
    });
    const [sentmessageSearch, setsentmessageSearch]= useState("")
    const filtersentMessage = allContacts.filter((contact:any)=>{
        const search = sentmessageSearch.trim().toLowerCase();
        if(!search) return true;
        return(
             contact.name?.toLowerCase().includes(sentmessageSearch.toLowerCase()) ||
            contact.email?.toLowerCase().includes(sentmessageSearch.toLowerCase()) ||
             contact.id?.toLowerCase().includes(sentmessageSearch.toLowerCase()) ||
             contact.subject?.toLowerCase().includes(sentmessageSearch.toLowerCase())  ||
             contact.message?.toLowerCase().includes(sentmessageSearch.toLowerCase()) 
        )

    })
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
                        Sent Messages
                    </h1>

                    <p>All sent messages will appear here </p>
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
            <div>
                <Card bordered={false}
                        style={{
                            borderRadius: 18,
                            
                          
                        }}
                        >

                
                        <div className="flex justify-between m-0 p-0 ">
                            <Text strong>
                                Total Messages
                            </Text>

                            <Tag color="blue">
                                {filtersentMessage.length} Messages
                            </Tag>
                        </div>
<div className='mt-3 mb-0
         '>
                                   <Input placeholder="Search Inbox Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' onChange={(e)=>setsentmessageSearch(e.target.value)} />
                                        </div>
                        </Card>

            {
                isLoading ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Empty description={<span className="font-[outfit] text-red-500">Failed to load customer messages</span>} />

                       
                    </div>
                ) : filtersentMessage.length === 0 ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <p>No messages found</p>
                    </div>
                ) : (
                filtersentMessage.map((contact: any) => (
                                       <Card
                        bordered={false}
                        style={{
                            borderRadius: 18,
                           
                        }}
                        
                    >
                        

                    

                       

                        <div 
                            style={{
                            
                                overflowY: "auto",
                            }}
                        >
                            <Card
                            
                                size="small"
                                className=""
                                style={{ borderRadius: 12 }}
                            >
                                <div className="flex justify-between">
                                    <Tag color="purple">
                                      #{contact.id?.slice(-6).toUpperCase()}
                                    </Tag>

                                    <Tag
                                    color={
                                        contact.status === "Delivered"
                                            ? "yellow"
                                            : contact.status === "Seen"
                                            ? "blue"
                                            : contact.status === "Replied"
                                            ? "green"
                                            : "default"
                                    }
                                >
                                    {contact.status}
                                </Tag>
                                </div>

                                <Title
                                    level={5}
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 4,
                                    }}
                                >
                                    Subject : {contact.subject}
                                </Title>

                                <Text>
                                    Message : {contact.message}
                                </Text>

                                <br />
                            <div className="grid  gap-1 mt-1">
                                <Text type="secondary">
                                    <ClockCircleOutlined />  {dayjs(contact.createdAt).format("h:mm A")}
                                </Text>
                                <Text type="secondary">
                                    <CalendarOutlined />  {dayjs(contact.createdAt).format("DD MMM YYYY")}
                                </Text>
                                </div>
                            </Card>

                            
                        
                            
                        </div>
                    </Card>
                )
                )
            )
            }

             
            </div>
           
        </div>
    );
};

export default SentMessageSalon;