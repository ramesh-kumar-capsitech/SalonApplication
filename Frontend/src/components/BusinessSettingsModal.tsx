import React, { useEffect, useState } from "react";
import {
    Drawer,
    Card,
    Checkbox,
    Typography,
    Divider,
    Button,
    DatePicker,
    Input,
    Space,
    List,
    Popconfirm,
    message,
} from "antd";
import {
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getApiAuthGetbusinesssettingsSalonId, putApiAuthUpdatebusinesssettings } from "../api/generated/loginsignuphome";

const { Title, Text } = Typography;

interface Holiday {
    date: string;
    reason: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const BusinessSettingsModal: React.FC<Props> = ({
    open,
    onClose,
}) => {
    const authData = JSON.parse(localStorage.getItem("persist:auth")!);

    const user = JSON.parse(authData.user);

    const salonId = user.salonId;
    const [weeklyOff, setWeeklyOff] = useState<string[]>(["Sunday"]);

    const [holidayDate, setHolidayDate] = useState<Dayjs | null>(null);

    const [reason, setReason] = useState("");

    const [holidays, setHolidays] = useState<Holiday[]>([]);

    const addHoliday = () => {
        if (!holidayDate) {
            message.warning("Please select a date.");
            return;
        }

        setHolidays([
            ...holidays,
            {
                date: holidayDate.format("YYYY-MM-DD"),
                reason,
            },
        ]);

        setHolidayDate(null);
        setReason("");
    };

    const removeHoliday = (date: string) => {
        setHolidays(holidays.filter((x) => x.date !== date));
    };

    const saveSettings = async () => {
        try {

            await putApiAuthUpdatebusinesssettings({
                salonId,
                weeklyOffDays: weeklyOff,
                specialHolidays: holidays,
            });

            message.success("Business Settings Updated");

            onClose();

        } catch {

            message.error("Failed to update settings");

        }
    };
    const { data, refetch } = useQuery({
        queryKey: ["business-settings", salonId],
        queryFn: () =>
            getApiAuthGetbusinesssettingsSalonId(salonId),
        enabled: false,
    });
    useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open]);
    useEffect(() => {
        console.log(data);
        if (!data) return;

        setWeeklyOff(data.data.weeklyOffDays ?? []);
        setHolidays(data.data.specialHolidays ?? []);
    }, [data]);

    return (
        <Drawer
            title="Business Settings"
            placement="right"
            width={500}
            open={open}
            onClose={onClose}
            extra={
                <Button
                    type="primary"
                    onClick={saveSettings}
                >
                    Save Settings
                </Button>
            }
        >
            <Card bordered={false}>
                <Title level={5}>Weekly Off</Title>

                <Checkbox.Group
                    value={weeklyOff}
                    onChange={(value) =>
                        setWeeklyOff(value as string[])
                    }
                >
                    <Space direction="vertical">
                        {weekDays.map((day) => (
                            <Checkbox
                                key={day}
                                value={day}
                            >
                                {day}
                            </Checkbox>
                        ))}
                    </Space>
                </Checkbox.Group>

                <Divider />

                <Title level={5}>Special Holidays</Title>

                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        value={holidayDate}
                        onChange={setHolidayDate}
                    />

                    <Input
                        placeholder="Holiday Reason"
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                    />

                    <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={addHoliday}
                    >
                        Add Holiday
                    </Button>
                </Space>

                <Divider />

                <List
                    bordered
                    locale={{
                        emptyText: (
                            <span style={{ fontFamily: "Outfit" }}>
                                No Holidays Added
                            </span>
                        ),
                    }}
                    dataSource={holidays}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    title={<span className="font-outfit">Delete Holiday?</span>} onConfirm={() =>
                                        removeHoliday(item.date)
                                    }
                                >
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                    />
                                </Popconfirm>,
                            ]}
                        >
                            <Space direction="vertical">
                                <Text strong>
                                    {dayjs(item.date).format(
                                        "DD MMM YYYY"
                                    )}
                                </Text>

                                <Text type="secondary">
                                    {item.reason}
                                </Text>
                            </Space>
                        </List.Item>
                    )
                    }
                />
            </Card >
        </Drawer >
    );
};

export default BusinessSettingsModal;