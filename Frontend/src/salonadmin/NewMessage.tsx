import { CalendarOutlined, ClockCircleOutlined, DownOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Empty, Input, Spin, Tag } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { getApiAuthGetreplybyidId } from "../api/generated/loginsignuphome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const NewMessage = () => {
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
        const[inboxserach , setinboxsearch] = useState("")
        const filterInboxMessages = inbox.filter((contact:any)=>contact.status==="New").filter((contact:any)=>{
            const search = inboxserach.trim().toLowerCase()
            if(!search) return true
            return(
                 contact.customerName?.toLowerCase().includes(inboxserach.toLowerCase()) ||
            contact.customerEmail?.toLowerCase().includes(inboxserach.toLowerCase()) ||
             contact.messageId?.toLowerCase().includes(inboxserach.toLowerCase()) ||
             contact.customerSubject?.toLowerCase().includes(inboxserach.toLowerCase())  ||
             contact.customerMessage?.toLowerCase().includes(inboxserach.toLowerCase()) ||
             contact.replyMessage?.toLowerCase().includes(inboxserach.toLowerCase()) ||
             contact.replySubject?.toLowerCase().includes(inboxserach.toLowerCase())
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
        const [openMessage, setOpenMessage]= useState<string | null>(null)
    return (
        <div>
             <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        New Message            </h1>
                        <p>All New Messages from BookMySalon</p>

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
                 <div className='m-3 mb-0
         '>
                                   <Input placeholder="Search Inbox Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   'onChange={(e) => setinboxsearch(e.target.value)}  />
                                        </div>
                {
                isLoading ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Empty description={<span className="font-[outfit] text-red-500">Failed to load customer messages</span>} />

                       
                    </div>
                ) : filterInboxMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <p>No messages found</p>
                    </div>
                ) : (
                filterInboxMessages.map((contact: any) => (
                                            <div className="m-3">
                                       <div key={contact.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                       
                                                      
                                                       
                                       
                                                       
                                                       <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-5 py-2">
                                                           <span className="text-xs font-semibold text-gray-500 uppercase">
                                                               Message From BookMySalon
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
                                                                   className="bg-blue-100 text-blue-600 flex-shrink-0"
                                                                   size={38}
                                                               >
                                                                   {contact.customerName
                                                                       .charAt(0)
                                                                       .toUpperCase()}
                                                               </Avatar>
                                       
                                                              
                                                               <div className="min-w-0 flex-1">
                                       
                                                                   <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                       <p className="font-semibold text-gray-900 m-0">
                                                                           {contact.customerName}
                                                                       </p>
                                       
                                                                       <Tag color="purple" className="w-fit m-0">
                                                                         #{contact.id?.slice(-6).toUpperCase()}
                                                                       </Tag>
                                                                   </div>
                                       <p className="text-sm text-blue-600 font-medium mt-2  break-words">
                                                                      From: {contact.superadminEmail}
                                                                   </p>
                                                                   <p className="text-sm text-gray-600 font-medium mt-1 mb-1 break-words">
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

export default NewMessage;