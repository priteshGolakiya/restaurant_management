// import axios from "axios";

// const uploadImage = async (image: File) => {
//     try {
//         const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME
//             }/image/upload`;
//         const formData = new FormData();
//         formData.append("file", image);
//         formData.append("upload_preset", "restaurant_management");

//         const response = await axios.post(cloudinaryUrl, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });

//         console.log('response.data::: ', response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         throw new Error("Failed to upload image");
//     }
// };

// export default uploadImage;



import axios from "axios";

const uploadImage = async (image: File) => {
    try {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

        const response = await axios.post(cloudinaryUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log('Cloudinary response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
    }
};

export default uploadImage;