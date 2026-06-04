import logo from '../assets/images/logo.png'
import { Card, Avatar } from "antd";
import {
    CheckCircleFilled,
} from "@ant-design/icons";

interface StatProps {
    value: string;
    label: string;
}

const Stat: React.FC<StatProps> = ({ value, label }) => {
    return (
        <div>
            <h2 className="text-3xl font-semibold text-blue-600">
                {value}
            </h2>
            <p className="text-gray-500 mt-1">
                {label}
            </p>
        </div>
    );
};

const AboutUs = () => {
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[23px]   ">
                <div>
                    <h1 className="text-lg  font-semibold text-gray-900 ">
                        About Us               </h1>

                </div>

            </div>

            <hr />
            <div className="m-6">
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 40 }}
                >
                    {/* TOP ICON */}
                    <div className="flex justify-center mb-6">
                        <Avatar size={64} className="bg-blue-100 text-2xl">
                            <img src={logo} alt="" />
                        </Avatar>
                    </div>

                    {/* TITLE */}
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-semibold">
                            Premium Salon Booking Platform
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Connecting customers with the finest salons and beauty professionals
                        </p>
                    </div>

                    {/* CONTENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* LEFT */}
                        <div>
                            <h3 className="font-semibold mb-3">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We're dedicated to revolutionizing the salon booking experience.
                                Our platform brings together premium salons and discerning customers,
                                making it easier than ever to book your perfect beauty appointment.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-4">
                                With our intuitive interface and comprehensive service offerings,
                                we ensure that every booking is seamless, every appointment is perfect,
                                and every customer leaves satisfied.
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div>
                            <h3 className="font-semibold mb-3">Why Choose Us</h3>

                            <ul className="space-y-3">
                                {[
                                    "Premium salon partnerships",
                                    "Easy online booking 24/7",
                                    "Verified professional stylists",
                                    "Secure payment processing",
                                    "Flexible rescheduling",
                                    "Customer satisfaction guarantee",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircleFilled className="text-blue-600" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="border-t my-10" />

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-8">
                        <Stat value="250+" label="Partner Salons" />
                        <Stat value="50K+" label="Happy Customers" />
                        <Stat value="4.9" label="Average Rating" />
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AboutUs
