import {useEffect, useState} from "react";
// icon
import {toast} from "react-toastify";
// components
import {LoadingPost, Modal, LoadingForm, FormCreatePost} from "../..";
import AdvertisementItem from "../../advertisement/AdvertisementItem.jsx";

const Right = ({
                   autoFetch,
                   advertisements,
                   own,
                   dark,
                   user,
                   setOneState,
                   loading,
                   setAdvertisements,
                   getDeletePostId,
               }) => {

    const [title, setTitle] = useState("");
    const [attachment, setAttachment] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [loadingcreateNewAdvertisement, setLoadingcreateNewAdvertisement] = useState(false);
    const [description, setDescription] = useState("");
    const [totalPlayerCount, setTotalPlayerCount] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [address, setAddress] = useState({
        address_line1: "",
        city: "",
        postal_code:"",
        country: "",
    });
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState();
    const [advertisementUrl, setAdvertisementUrl] = useState("");


    useEffect(() => {
        setOneState("openModal", openModal);
    }, [openModal]);

    const createNewAdvertisement = async (file) => {
        setLoadingcreateNewAdvertisement(true);
        if (!title) {
            toast.error("You must type something...");
            return;
        }
        try {
            let formData = new FormData();
            file && formData.append("image", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("address.address_line1", address.address_line1);
            formData.append("address.city", address.city);
            formData.append("address.country", address.country);
            formData.append("category", category);
            formData.append("advertisement_price", price);
            formData.append("total_user_count", totalPlayerCount);
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);
            advertisementUrl && formData.append("advertisement_url", advertisementUrl);

            const {data} = await autoFetch.post(`/advertisements/`, formData);
            setAdvertisements([data, ...advertisements]);
            toast.success("Your ad will be approved by the system staff.!");
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoadingcreateNewAdvertisement(false);
    };
    const PostInRight = () => {
        if (loading) {
            return <LoadingPost />;
        }
        if (advertisements?.length) {
            return advertisements?.map((advertisementItem) => (
                <AdvertisementItem
                    key={advertisementItem.id}
                    autoFetch={autoFetch}
                    dark={dark}
                    isAdvertisementList={true}
                    advertisementItem={advertisementItem}
                    user={own}
                ></AdvertisementItem>
            ));
        }
        return (
            <div className='text-center w-full text-4xl dark:bg-[#242526] py-5 rounded-lg '>
                No advertisement found
            </div>
        );
    };
    const form = () => {
        if (loading) {
            return <LoadingForm />;
        }
        return (
            <FormCreatePost
                setAttachment={setAttachment}
                setOpenModal={setOpenModal}
                title={title}
                user={user}
                isAdvertisement={true}
            />
        );
    };

    return (
        <div>
            {openModal && (
                <Modal
                    setOpenModal={setOpenModal}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    totalPlayerCount={totalPlayerCount}
                    setTotalPlayerCount={setTotalPlayerCount}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    address={address}
                    setAddress={setAddress}
                    category={category}
                    setCategory={setCategory}
                    price={price}
                    setPrice={setPrice}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    createNewActivity={createNewAdvertisement}
                    isAdvertisement={true}
                    advertisementUrl={advertisementUrl}
                    setAdvertisementUrl={setAdvertisementUrl}
                />
            )}

            {user?.username === own?.username && form()}
            <div>
                {loadingcreateNewAdvertisement && <LoadingPost />}
            </div>
            {PostInRight()}
        </div>
    );
};

export default Right;
