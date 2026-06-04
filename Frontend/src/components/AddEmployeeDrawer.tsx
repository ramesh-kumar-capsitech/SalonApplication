import {
    Drawer,
    Form,
    Input,
    Select,
    Button,
    Modal,
    message
} from "antd";

import axios from "axios";
import { useEffect } from "react";

const AddEmployeeDrawer = ({
    openDrawer,
    setOpenDrawer,
    getEmployees,
    editingEmployee,
    setEditingEmployee
}) => {

    const [staffForm] = Form.useForm();
    useEffect(() => {

        if (
            editingEmployee
            &&
            openDrawer
        ) {

            staffForm.setFieldsValue({

                fullName:
                    editingEmployee.fullName,

                role:
                    editingEmployee.role,

                email:
                    editingEmployee.email,

                phone:
                    editingEmployee.phone,

                skills:
                    editingEmployee.skills,

                experience:
                    editingEmployee.experience,

                availability:
                    editingEmployee.availability
            });
        }

    }, [
        editingEmployee,
        openDrawer
    ]);

    const handleAddEmployee =
        async (values) => {

            try {

                const authData =
                    JSON.parse(
                        localStorage.getItem(
                            "persist:auth"
                        )!
                    );

                const user =
                    JSON.parse(authData.user);

                const salonId =
                    user.salonId;

                let res;

                if (editingEmployee) {

                    res =
                        await axios.put(
                            `https://localhost:7074/api/auth/editemployee/${editingEmployee.id}`,
                            {
                                fullName:
                                    values.fullName,

                                role:
                                    values.role,

                                email:
                                    values.email,

                                phone:
                                    values.phone,

                                skills:
                                    values.skills,

                                experience:
                                    Number(
                                        values.experience
                                    ),

                                availability:
                                    values.availability
                            }
                        );

                } else {

                    res =
                        await axios.post(
                            "https://localhost:7074/api/auth/addemployee",
                            {
                                salonId,

                                fullName:
                                    values.fullName,

                                role:
                                    values.role,

                                email:
                                    values.email,

                                phone:
                                    values.phone,

                                skills:
                                    values.skills,

                                experience:
                                    Number(
                                        values.experience
                                    ),

                                availability:
                                    values.availability
                            }
                        );
                }

                if (res.data.success) {

                    message.success(
                        editingEmployee
                            ? "Employee Updated"
                            : "Employee Added"
                    );

                    if (!editingEmployee) {

                        Modal.success({

                            title:
                                "Employee Login Credentials",

                            content: (
                                <div>

                                    <p>
                                        Login ID:
                                    </p>

                                    <b>
                                        {
                                            res.data.data
                                                ?.loginEmail
                                        }
                                    </b>

                                    <p className="mt-3">
                                        Password:
                                    </p>

                                    <b>
                                        {
                                            res.data.data
                                                ?.loginPassword
                                        }
                                    </b>

                                </div>
                            )
                        });
                    }

                    getEmployees(salonId);

                    staffForm.resetFields();

                    setEditingEmployee(null);

                    setOpenDrawer(false);
                }

            } catch (err) {

                console.log(err);

                message.error(
                    "Operation Failed"
                );
            }
        };

    return (

        <Drawer
            title={
                editingEmployee
                    ? "Edit Staff"
                    : "Add New Staff"
            }
            placement="right"
            width={500}
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
        >

            <Form
                layout="vertical"
                form={staffForm}
                onFinish={handleAddEmployee}
            >


                <Form.Item
                    label={<span className="font-[Outfit] ">Full Name</span>}
                    name="fullName"

                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter full name"
                        }
                    ]}
                >

                    <Input
                        size="middle"
                        placeholder="Sarah Johnson"
                    />

                </Form.Item>


                <Form.Item
                    label={<span className="font-[Outfit] ">Designation / Role</span>}
                    name="role"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please select role"
                        }
                    ]}
                >

                    <Select
                        size="middle"
                        placeholder="Select role"
                    >

                        <Select.Option value="Hair Stylist">
                            Hair Stylist
                        </Select.Option>

                        <Select.Option value="Barber">
                            Barber
                        </Select.Option>

                        <Select.Option value="Makeup Artist">
                            Makeup Artist
                        </Select.Option>

                    </Select>

                </Form.Item>

                {/* EMAIL */}
                <Form.Item
                    label={<span className="font-[Outfit] ">Email</span>}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter email"
                        },
                        {
                            type: "email",
                            message:
                                "Invalid email"
                        }
                    ]}
                >

                    <Input
                        size="middle"
                        placeholder="sarah@email.com"
                    />

                </Form.Item>

                {/* PHONE */}
                <Form.Item
                    label={<span className="font-[Outfit] ">Phone Number</span>}
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter phone number"
                        },
                        {
                            pattern: /^[0-9]{10}$/,
                            message:
                                "Phone must be 10 digits"
                        }
                    ]}
                >

                    <Input
                        size="middle"
                        placeholder="9999999999"
                    />

                </Form.Item>


                <Form.Item
                    label={<span className="font-[Outfit] ">Skills</span>}
                    name="skills"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please select skills"
                        }
                    ]}
                >

                    <Select
                        mode="multiple"
                        size="middle"
                        placeholder="Select skills"
                    >

                        <Select.Option value="Hair Cutting">
                            Hair Cutting
                        </Select.Option>

                        <Select.Option value="Hair Spa">
                            Hair Spa
                        </Select.Option>

                        <Select.Option value="Facial">
                            Facial
                        </Select.Option>

                        <Select.Option value="Coloring">
                            Coloring
                        </Select.Option>

                    </Select>

                </Form.Item>


                <Form.Item
                    label={<span className="font-[Outfit] ">Experience (Years)</span>}
                    name="experience"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter experience"
                        }
                    ]}
                >

                    <Input
                        size="middle"
                        placeholder="e.g. 5"
                    />

                </Form.Item>


                <Form.Item
                    label={<span className="font-[Outfit] ">Availability</span>}
                    name="availability"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please select availability"
                        }
                    ]}
                >

                    <Select
                        size="middle"
                        placeholder="Select availability"
                    >

                        <Select.Option value="Full Time">
                            Full Time
                        </Select.Option>

                        <Select.Option value="Part Time">
                            Part Time
                        </Select.Option>

                    </Select>

                </Form.Item>


                <div className="flex justify-end gap-3">

                    <Button
                        onClick={() =>
                            setOpenDrawer(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Save Staff
                    </Button>

                </div>

            </Form>

        </Drawer>
    );
};

export default AddEmployeeDrawer;