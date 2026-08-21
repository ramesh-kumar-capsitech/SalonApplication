import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthCustomerbookingstats, getApiAuthGetallcontacts, getApiAuthGetallsalons, getApiAuthGetreplycontacts, postApiAuthReplymessage, putApiAuthSeenmessageId } from "../api/generated/loginsignuphome";
import { Avatar, Button, Col, Drawer, Empty, Form, Input, message, Row, Segmented, Select, Spin, Tag } from "antd";
import dayjs from "dayjs";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { PlusCircleFilled } from "@ant-design/icons";

 
const CustomerMessages: React.FC = () => {
   
    const authData = JSON.parse(localStorage.getItem("persist:auth")!);
    const user = JSON.parse(authData.user);

    const userId = user.id;
    const userEmail = user.email;
    const { data: allContacts = [],isLoading, error,} = useQuery({
        queryKey: ["contacts"],
        queryFn: async () => {
            const res = await getApiAuthGetallcontacts();
            console.log("allContacts", res.data);
            return res.data;
        },
    });
    const {data:repliedContacts=[],}= useQuery({
        queryKey: ["replycontacts"],
        queryFn: async () => {
            const res = await getApiAuthGetreplycontacts();
           
            return res.data;
        },
    })
    const[repliedmessageSearch , setrepliedmessageSearch]= useState("")
    const filterRepliedContacts = repliedContacts.filter((contact:any)=>contact.status==="Replied").filter((contact :any)=>{
        const search = repliedmessageSearch.trim().toLowerCase();

        if (!search) return true;
        return(
            contact.customerName?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
            contact.customerEmail?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.messageId?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.customerSubject?.toLowerCase().includes(repliedmessageSearch.toLowerCase())  ||
             contact.customerMessage?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.replyMessage?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.replySubject?.toLowerCase().includes(repliedmessageSearch.toLowerCase())

        )
    })
    const filterSentContacts = repliedContacts.filter((contact:any)=>contact.status==="New").filter((contact :any)=>{
        const search = repliedmessageSearch.trim().toLowerCase();

        if (!search) return true;
        return(
            contact.customerName?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
            contact.customerEmail?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.messageId?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.customerSubject?.toLowerCase().includes(repliedmessageSearch.toLowerCase())  ||
             contact.customerMessage?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.replyMessage?.toLowerCase().includes(repliedmessageSearch.toLowerCase()) ||
             contact.replySubject?.toLowerCase().includes(repliedmessageSearch.toLowerCase())

        )
    })
const [open, setOpen] = useState(false);
const[sendmessageopen, setsendmessageopen]= useState(false)
const [selectedContact, setSelectedContact] = useState<any>(null);

const [form] = Form.useForm();
  const [tab, settab] = useState<"pending" | "seen" | "replied">("pending")
  const pendingContacts = allContacts.filter((contact: any) => contact.status === "Delivered");
  const [pendindmessageSearch, setpendindmessageSearch]=useState("")
  const filterPendingMessage = pendingContacts.filter((contact:any)=>{
    const search = pendindmessageSearch.trim().toLowerCase();

        if (!search) return true;
        return(
            contact.name?.toLowerCase().includes(pendindmessageSearch.toLowerCase()) ||
            contact.email?.toLowerCase().includes(pendindmessageSearch.toLowerCase()) ||
             contact.id?.toLowerCase().includes(pendindmessageSearch.toLowerCase()) ||
             contact.subject?.toLowerCase().includes(pendindmessageSearch.toLowerCase())  ||
             contact.message?.toLowerCase().includes(pendindmessageSearch.toLowerCase()) 

        )
  }) 
  const seenContacts = allContacts.filter((contact: any) => contact.status === "Seen");
  const[seenmessageSearch , setseenmessageSearch]= useState("")
  const filterSeenMessage = seenContacts.filter((contact:any)=>{
const search = seenmessageSearch.trim().toLowerCase();

        if (!search) return true;
        return(
            contact.name?.toLowerCase().includes(seenmessageSearch.toLowerCase()) ||
            contact.email?.toLowerCase().includes(seenmessageSearch.toLowerCase()) ||
             contact.id?.toLowerCase().includes(seenmessageSearch.toLowerCase()) ||
             contact.subject?.toLowerCase().includes(seenmessageSearch.toLowerCase())  ||
             contact.message?.toLowerCase().includes(seenmessageSearch.toLowerCase()) 

        )
  })
//   const repliedContacts = allContacts.filter((contact: any) => contact.status === "Replied");
const onClose = () => {
    setOpen(false);
    setsendmessageopen(false);
    setSelectedContact(null);
};

const queryClient = useQueryClient();
 const ReplyContactMutation =
        useMutation({
            mutationFn: async (values: any) => {

                const res =
                    await postApiAuthReplymessage(
                        {
                        SuperAdminId: userId,
                        SuperAdminEmail:userEmail,
                        MessageId: selectedContact?.id,
                        CustomerId: selectedContact?.customerId,
                        CustomerName: selectedContact?.name,
                        CustomerEmail: selectedContact?.email,
                        CustomerSubject: selectedContact?.subject,
                        CustomerMessage: selectedContact?.message,
                        MessageDateTime: selectedContact?.createdAt,
                        ReplySubject: values.subject,
                        ReplyMessage: values.message,   
                        }
                    );

                return res.data;
            },

            onSuccess: () => {

                message.success(
                    "Message sent successfully"
                );
                setOpen(false);
                form.resetFields();
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                       
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "replycontacts"
                       
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

        ReplyContactMutation.mutate(
            values
        );
    }
    const SeenMessageMutation =
        useMutation({
            mutationFn: async (id: string) => {

                const res =
                    await putApiAuthSeenmessageId(id);

                return res.data;
            },

            onSuccess: () => {

                message.success(
                    "Message marked as seen"
                );
                setOpen(false);
                form.resetFields();
                queryClient.invalidateQueries({
                    queryKey: ["contacts"],             
                  
                });
            },

            onError: (
                error: any
            ) => {
console.log(error?.response?.data ?.message );
                message.error(error?.response?.data ?.message ||"Something went wrong");
            },
        });
        const handleSeenMessage = (id: string) => {

        SeenMessageMutation.mutate(id);
    }
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
         const { data: salons = [] } = useQuery({
                queryKey: ["salons"],
                queryFn: async () => {
                    const res = await getApiAuthGetallsalons()
        
                    return res.data;
                }
            });
            const { data: users = [] } = useQuery({
                queryKey: ["customer"],
                queryFn: async () => {
                    const res = await getApiAuthCustomerbookingstats()
        
                    return res.data;
                }
            });
            const totalusers = [...salons , ...users]
             const NewMessageMutation  =
        useMutation({
            mutationFn: async (values: any) => {
                const selectedCustomers = totalusers.filter(
                    (customer:any)=>values.customeremail.includes(customer.email)
                )

                 const requests = selectedCustomers.map((customer: any) => {

            return postApiAuthReplymessage({
                SuperAdminId: userId,
                SuperAdminEmail:userEmail,

              
                CustomerId: customer.id,

                
                CustomerName: customer.ownerName,

                
                CustomerEmail: customer.email,

                
                CustomerSubject: null,
                CustomerMessage: null,

                
                MessageId: null,

                
                MessageDateTime: new Date().toISOString(),

                ReplySubject: values.subject,
                ReplyMessage: values.message,

               
                Status: "New"
            });

        });

                return Promise.all(requests);
            },

            onSuccess: () => {

                message.success(
                    "Message sent successfully"
                );
                setsendmessageopen(false);
                form.resetFields();
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                       
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "replycontacts"
                       
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
        const handleSendNewMessage = (values: any) => {

    NewMessageMutation.mutate(values);

};
    return (
        <div>
            <Drawer
                    title={`Send Message`}
                    width={800}
                    open={sendmessageopen}
                    onClose={onClose}
                    destroyOnClose
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button onClick={onClose}>
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                            >
                                Send
                            </Button>
                        </div>
                    }
                >

                <Form
                    form={form}
                    onFinish={handleSendNewMessage}
                    layout="vertical"
                   
                >
                   

                   

                 <Form.Item
                    label={<span className="font-[Outfit] ">To</span>}
                    name="customeremail"
                    rules={[
                        {
                            required: true,
                            message:"Please select Customer"
                        }
                    ]}
                >

                    <Select
                        mode="multiple"
                        size="middle"
                        placeholder="Select Mail id"
                    >
                    {totalusers.map((contact:any)=>(
                        <Select.Option key={contact.id} value={contact.email}>
                                                {contact.email}
                                            </Select.Option>
                    ))}                     

                    </Select>

                </Form.Item>

                     <Form.Item
                                label={<span className="font-[Outfit] ">Subject</span>}
                                name="subject"
                                rules={[
                                    { required: true, message: "Subject is required" }
                                ]}
                            >
                                <Input placeholder="Enter a subject for your reply" name="subject" />
                            </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Message</span>}

                        name="message"
                        rules={[
                            { required: true, message: "Message is required" },
                            { min: 20, message: "Minimum 20 characters required" }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter your message here..."

                            name="message"
                        />
                    </Form.Item>
                </Form>
            </Drawer>
             <Drawer
                    title={`Reply to ${selectedContact?.name ||  "Customer"}`}
                    width={800}
                    open={open}
                    onClose={onClose}
                    destroyOnClose
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button onClick={onClose}>
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                            >
                                Send
                            </Button>
                        </div>
                    }
                >

                <Form
                    form={form}
                    onFinish={handleSendMessage}
                    layout="vertical"
                   
                >
                   

                   

                 

                     <Form.Item
                                label={<span className="font-[Outfit] ">Subject</span>}
                                name="subject"
                                rules={[
                                    { required: true, message: "Subject is required" }
                                ]}
                            >
                                <Input placeholder="Enter a subject for your reply" name="subject" />
                            </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Message</span>}

                        name="message"
                        rules={[
                            { required: true, message: "Message is required" },
                            { min: 20, message: "Minimum 20 characters required" }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter your message here..."

                            name="message"
                        />
                    </Form.Item>
                </Form>
            </Drawer>
            

            <div className="flex items-center justify-between px-3 py-[11px] pb-0 mb-3">
                <div className="pt-3">
                    <h1 className="text-lg leading-[0.8] m-0 font-semibold text-gray-900">
                        Customer Messages
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Manage customer messages
                    </p>
                </div>
                <div>
                    <PlusCircleFilled className="text-blue-500 text-2xl cursor-pointer " onClick={()=>setsendmessageopen(true)}/>
                </div>
            </div>

            <hr />
             <div>
                <Segmented
                    block
                    value={tab}
                    onChange={(val) => settab(val as "pending" | "seen" | "replied")}
                    options={[
                        {
                            label: `Pending `,
                            value: 'pending',
                        },
                        {
                            label: `Seen `,
                            value: 'seen',
                        },
                        {
                            label: `Replied `,
                            value: 'replied',
                        },
                        {
                            label: `Sent`,
                            value: 'sent',
                        }
                    ]}
                    className="rounded-lg bg-gray-100 max-w-[100%] font-[Outfit]  p-1 m-6 mb-0 "
                />
            </div>
 
{tab === "pending" && (
    <div className="flex flex-col gap-3 m-3">
        <div className='m-3 mb-0
         '>
                                   <Input placeholder="Search Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   '  onChange={(e) => setpendindmessageSearch(e.target.value)}  />
                                        </div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load customer messages</span>} />
                    </div>
                ) : filterPendingMessage.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty
                            description={
                                <span className="font-[outfit]">
                                    No Pending customer messages found.
                                </span>
                            }
                        />
                    </div>
                ) : (
                    filterPendingMessage.map((contact: any) => (
                        <div
                            key={contact.id}
                            className="border border-gray-200 rounded-xl p-4 bg-white"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="grid md:flex gap-3 min-w-0">
                                    <div className="text-sm text-gray-500 w-20 sm:w-24 flex-shrink-0">
                                        <div>
                                           {dayjs(contact.createdAt).format("h:mm A")}
                                        </div>

                                        <div className="font-semibold text-black">
                                        {dayjs(contact.createdAt).format("DD MMM YYYY")}
                                        </div>
                                    </div>

                                    <Avatar className="hidden md:block bg-blue-100 text-blue-600 flex-shrink-0">
                                        {( contact.name  ).charAt(0).toUpperCase()}
                                    </Avatar>

                                    <div className="min-w-0 ">
                                       <div className="flex gap-2">
                                        <p className="font-medium m-0 break-words text-gray-900">
                                            {contact.name}
                                        </p>  
                                  <Tag color="purple">
                                      #{contact.id?.slice(-6).toUpperCase()}
                                </Tag></div>

                                        <p className="text-xs text-gray-500 m-0 break-words">
                                            Email:{" "}
                                            {contact.email }
                                        </p>

                                        <p className="text-blue-600 text-sm mt-2 mb-0 break-words">
                                            Subject:{" "}
                                            {contact.subject }
                                        </p>

                                        <p className="text-sm text-gray-600 leading-5 m-0 break-words">
                                            Message:{" "}
                                            {contact.message }
                                            
                                        </p>
                                    </div>
                                </div>

                                <div className=" grid gap-2 self-start sm:self-auto">
                                    <Tag color="blue"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        handleSeenMessage(contact.id);
                                    }}
                                
                                    >
                                    Seen
                                </Tag>
                                <Tag
                                    color="green"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        form.setFieldsValue({subject: `Ref: [${contact.id?.slice(-6).toUpperCase()}] ${contact.subject}`,});
                                        setOpen(true);
                                    }}
                                >
                                    Reply
                                </Tag>
                                

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
)}
{tab === "seen" && (
    <div className="flex flex-col gap-3 m-3">
         <div className='m-3 mb-0
         '>
                                   <Input placeholder="Search Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' onChange={(e) => setseenmessageSearch(e.target.value)} />
                                        </div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load customer messages</span>} />
                    </div>
                ) : filterSeenMessage.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty
                            description={
                                <span className="font-[outfit]">
                                    No Seen customer messages found.
                                </span>
                            }
                        />
                    </div>
                ) : (
                    filterSeenMessage.map((contact: any) => (
                        <div
                            key={contact.id}
                            className="border border-gray-200 rounded-xl p-4 bg-white"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="grid md:flex gap-3 min-w-0">
                                    <div className="text-sm text-gray-500 w-20 sm:w-24 flex-shrink-0">
                                        <div>
                                            {dayjs(contact.createdAt).format("h:mm A")}
                                        </div>

                                        <div className="font-semibold text-black">
                                             {dayjs(contact.createdAt).format("DD MMM YYYY")}
                                        </div>
                                    </div>

                                    <Avatar className="hidden md:block bg-blue-100 text-blue-600 flex-shrink-0">
                                        {(
                                            contact.name ||
                                            contact.customerName ||
                                            "?"
                                        )
                                            .charAt(0)                           
                                            .toUpperCase()}
                                    </Avatar> 

                                    <div className="min-w-0">
                                        <p className="font-medium m-0 break-words text-gray-900">
                                            {contact.name ||
                                                contact.customerName }
                                        </p>

                                        <p className="text-xs text-gray-500 m-0 break-words">
                                            Email:{" "}
                                            {contact.email }
                                        </p>

                                        <p className="text-blue-600 text-sm mt-2 mb-0 break-words">
                                            Subject:{" "}
                                            {contact.subject}
                                        </p>

                                        <p className="text-sm text-gray-600 leading-5 m-0 break-words">
                                            Message:{" "}
                                            {contact.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="self-start sm:self-auto">
                                <Tag
                                    color="blue"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        form.setFieldsValue({subject: `Ref: [${contact.id?.slice(-6).toUpperCase()}] ${contact.subject}`,});
                                        setOpen(true);
                                    }}
                                >
                                    Reply
                                </Tag>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
)}
{tab === "replied" && (
    <div className="flex flex-col gap-3 m-3">
        <div className='m-3 mb-0
         '>
                                   <Input placeholder="Search Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' onChange={(e) => setrepliedmessageSearch(e.target.value)} />
                                        </div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load replied messages</span>} />
                    </div>
                ) : filterRepliedContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty
                            description={
                                <span className="font-[outfit]">
                                    No Replied messages found.
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <>
                     
                    {filterRepliedContacts.map((contact: any) => (
                        
                         
                    <div className="m-3 mb-0">
                          
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
                                <div className="flex flex-row gap-5 ">
                                <Tag color="blue" className="w-fit m-0">
                                    Customer
                                </Tag>
                                <Tag color="purple">
                                      #{contact.messageId?.slice(-6).toUpperCase()}
                                </Tag>
                                </div>
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
                        Your Reply
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
                        
                    ))}
                    </>
                    
                )}
            </div>
)}
     {tab === "sent" && (
    <div className="flex flex-col gap-3 m-3">
        <div className='m-3 mb-0
         '>
                                   <Input placeholder="Search Messages...." className='  font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100   ' onChange={(e) => setrepliedmessageSearch(e.target.value)} />
                                        </div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load replied messages</span>} />
                    </div>
                ) : filterSentContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty
                            description={
                                <span className="font-[outfit]">
                                    No Replied messages found.
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <>
                     
                    {filterSentContacts.map((contact: any) => (
                        
                         
                    <div className="m-3 mb-0">
                          
            <div key={contact.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">

               
                

                
                <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-5 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                        Your Message
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
                            {/* {contact.customerName
                                .charAt(0)
                                .toUpperCase()} */}
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
                               To: {contact.customerEmail}
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
                        
                    ))}
                    </>
                    
                )}
            </div>
)}     
        </div>
    );
};

export default CustomerMessages;