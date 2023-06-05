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

    useEffect(() => {
        setOneState("openModal", openModal);
    }, [openModal]);

    const createNewAdvertisement = async (formData) => {
        setLoadingcreateNewAdvertisement(true);
        if (!title) {
            toast.error("You must type something...");
            return;
        }
        try {
            // let image = null;
            // if (formData) {
            //     const {data} = await autoFetch.post(
            //         `/api/post/upload-image`,
            //         formData
            //     );
            //     image = {url: data.url, public_id: data.public_id};
            // }
            const {data} = await autoFetch.post(`/advertisements/`, {
                title: title,
                description: description,
                address: address,
                category: category,
                activity_price: price,
                start_date: startDate,
                end_date: endDate,
                total_player_count: totalPlayerCount,
                image: formData ? formData : null,
            });
            setAdvertisements([data, ...advertisements]);
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
                description={description}
                totalPlayerCount={totalPlayerCount}
                startDate={startDate}
                endDate={endDate}
                address={address}
                category={category}
                price={price}
                user={user}
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
