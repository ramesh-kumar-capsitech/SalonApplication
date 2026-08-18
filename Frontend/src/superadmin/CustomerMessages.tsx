import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthGetallcontacts, getApiAuthGetreplycontacts, postApiAuthReplymessage, putApiAuthSeenmessageId } from "../api/generated/loginsignuphome";
import { Avatar, Button, Col, Drawer, Empty, Form, Input, message, Row, Segmented, Spin, Tag } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
 
const CustomerMessages: React.FC = () => {
   
    const authData = JSON.parse(localStorage.getItem("persist:auth")!);
    const user = JSON.parse(authData.user);

    const userId = user.id;
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
const [open, setOpen] = useState(false);
const [selectedContact, setSelectedContact] = useState<any>(null);

const [form] = Form.useForm();
  const [tab, settab] = useState<"pending" | "seen" | "replied">("pending")
  const pendingContacts = allContacts.filter((contact: any) => contact.status === "Delivered");
  const seenContacts = allContacts.filter((contact: any) => contact.status === "Seen");
//   const repliedContacts = allContacts.filter((contact: any) => contact.status === "Replied");
const onClose = () => {
    setOpen(false);
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
                    queryKey: [            "contacts"
                       
                    ],
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
    return (
        <div>
             <Drawer
                    title={`Reply to ${selectedContact?.name || selectedContact?.customerName || "Customer"}`}
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
                    ]}
                    className="rounded-lg bg-gray-100 max-w-[100%] font-[Outfit]  p-1 m-6 "
                />
            </div>

{tab === "pending" && (
    <div className="flex flex-col gap-3 m-3">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load customer messages</span>} />
                    </div>
                ) : pendingContacts.length === 0 ? (
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
                    pendingContacts.map((contact: any) => (
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

                                    <div className="min-w-0">
                                        <p className="font-medium m-0 break-words text-gray-900">
                                            {contact.name ||
                                                contact.customerName }
                                        </p>

                                        <p className="text-xs text-gray-500 m-0 break-words">
                                            Email:{" "}
                                            {contact.email }
                                        </p>

                                        <p className="text-blue-600 text-xs mt-2 mb-0 break-words">
                                            Subject:{" "}
                                            {contact.subject }
                                        </p>

                                        <p className="text-green-600 text-xs mt-1 mb-0 break-words">
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
                                        form.setFieldsValue({subject: `Ref: [${contact.id}] ${contact.subject}`,});
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
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load customer messages</span>} />
                    </div>
                ) : seenContacts.length === 0 ? (
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
                    seenContacts.map((contact: any) => (
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
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Empty description={<span className="font-[outfit]">Failed to load replied messages</span>} />
                    </div>
                ) : repliedContacts.length === 0 ? (
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
                    repliedContacts.map((contact: any) => (
                        
                         
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
                                    Customer
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
                        
                    ))
                )}
            </div>
)}
          
        </div>
    );
};

export default CustomerMessages;