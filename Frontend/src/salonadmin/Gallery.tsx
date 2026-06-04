import {
    Button,
    Empty,
    Upload,
    message
} from "antd";

import {
    PlusOutlined
} from "@ant-design/icons";

import axios from "axios";
import { useEffect, useState } from "react";

const Gallery = () => {
    const [images,
        setImages] = useState<string[]>([]);

    const [loading,
        setLoading] = useState(false);
    const authData =
        JSON.parse(
            localStorage.getItem(
                "persist:auth"
            )!
        );

    const user = JSON.parse(authData.user);

    const salonId = user.salonId;
    const getGallery =
        async () => {
            console.log("SalonId:", salonId);
            const res =
                await axios.get(`https://localhost:7074/api/auth/gallery/${salonId}`);

            setImages(
                res.data
            );
        };

    useEffect(() => {

        getGallery();

    }, []);
    const uploadImage =
        async (file: File) => {

            try {

                setLoading(true);

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                formData.append(
                    "upload_preset",
                    "salonupload"
                );

                const cloudinaryRes =
                    await axios.post(

                        "https://api.cloudinary.com/v1_1/dmhp2b2dj/image/upload",

                        formData
                    );

                const imageUrl =
                    cloudinaryRes
                        .data
                        .secure_url;

                await axios.post(

                    "https://localhost:7074/api/auth/addgalleryimage",

                    {
                        salonId,
                        imageUrl
                    }
                );

                message.success(
                    "Image Added"
                );

                getGallery();

            }
            catch (error: any) {
                console.log("UPLOAD ERROR:", error);
                console.log("RESPONSE:", error?.response?.data);
                message.error(
                    "Upload Failed"
                );

            }
            finally {

                setLoading(false);
            }

            return false;
        };
    return (

        <div>

            <div className="flex items-center justify-between px-3 py-[13px]   ">
                <div className="flex gap-4  items-center justify-between w-full  px-2  pb-[0px] mb-[5px]    ">
                    <div>



                        <h2 className="text-2xl font-semibold">
                            Gallery
                        </h2>
                        <p className="text-gray-500 text-sm mt-0">
                            Manage your salon's gallery by adding or removing images to showcase your work and attract more customers.
                        </p>
                    </div>
                    <div>
                        <Upload

                            showUploadList={false}

                            beforeUpload={
                                uploadImage
                            }
                        >
                            <Button
                                type="primary"
                                icon={
                                    <PlusOutlined />
                                }
                                loading={loading}
                            >
                                Add Picture
                            </Button>
                        </Upload>
                    </div>
                </div>








            </div>
            <hr />
            <div className="">

                {
                    images?.length > 0 ? (

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3 py-[13px]">

                            {images.map(
                                (img, index) => (

                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className="w-full h-60 rounded-xl object-cover"
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="flex justify-center items-center py-16">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No Gallery Images"
                            />
                        </div>

                    )
                }

            </div>

        </div>
    );
}

export default Gallery

