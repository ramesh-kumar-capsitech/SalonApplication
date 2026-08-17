import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

const Inbox = () => {
    const currentPath = window.location.pathname;

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
           
        </div>
    );
};

export default Inbox;