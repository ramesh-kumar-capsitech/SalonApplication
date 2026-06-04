import React, { useEffect } from "react";
import {
    Drawer,
    Form,
    Input,
    Button,
    Row,
    Col,
} from "antd";

const { TextArea } = Input;

interface SalonFormDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    loading?: boolean;
    title?: string;
    initialValues?: any;
}

const SalonFormDrawer: React.FC<
    SalonFormDrawerProps
> = ({
    open,
    onClose,
    onSubmit,
    loading = false,
    title = "Salon Details",
    initialValues,
}) => {
        const [form] = Form.useForm();
        useEffect(() => {

            form.resetFields();

            if (initialValues) {

                form.setFieldsValue(initialValues);

            }

        }, [initialValues]);
        return (
            <Drawer
                title={title}
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
                            loading={loading}
                            onClick={() =>
                                form.submit()
                            }
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        onSubmit(values);

                        form.resetFields();
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">Salon Name</span>}
                                name="salonName"
                                rules={[
                                    { required: true, message: "Salon name is required" },
                                    { min: 3, message: "Minimum 3 characters required" }
                                ]}
                            >
                                <Input placeholder="Elite Styles" name="salonname" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">City</span>}
                                name="city"
                                rules={[
                                    { required: true, message: "City is required" },
                                    { min: 3, message: "Minimum 3 characters required" }
                                ]}
                            >
                                <Input placeholder="Manhattan, NY" name="city" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">Owner Name</span>}
                                name="ownerName"
                                rules={[
                                    { required: true, message: "Owner name is required" },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: "Only alphabets allowed"
                                    }
                                ]}
                            >
                                <Input placeholder="Jennifer Lee" name="ownername" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">Phone</span>}
                                name="phone"
                                rules={[
                                    { required: true, message: "Phone number is required" },
                                    { pattern: /^[0-9]{10}$/, message: "Invalid phone number" }
                                ]}
                            >
                                <Input placeholder="123-456-7890" name="phone" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">Email</span>}
                                name="email"
                                rules={[
                                    { required: true, message: "Email is required" },
                                    { type: "email", message: "Invalid email format" }
                                ]}
                            >
                                <Input placeholder="jennifer@example.com" name="email" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-[Outfit] ">Joined Year</span>}
                                name="joinedYear"
                                rules={[
                                    { required: true, message: "Joined year is required" }
                                ]}
                            >
                                <Input placeholder="2020" name="joinedYear" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Salon Address</span>}
                        name="salonAddress"
                        rules={[
                            { required: true, message: "Salon address is required" },
                            { min: 10, message: "Address too short" }
                        ]}
                    >
                        <TextArea rows={3}
                            placeholder="123 Fifth Avenue, New York, NY 10001" name="salonaddress" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Salon Description</span>}

                        name="salonDescription"
                        rules={[
                            { required: true, message: "Salon description is required" },
                            { min: 20, message: "Minimum 20 characters required" }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Premium full-service salon specializing in hair styling, coloring, and beauty treatments."

                            name="salonDescription"
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        );
    };

export default SalonFormDrawer;