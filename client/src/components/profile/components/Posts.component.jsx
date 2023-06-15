import {useEffect, useState} from "react";
// icon
import {toast} from "react-toastify";
// components
import {LoadingPost, Modal, Post, LoadingForm, FormCreatePost} from "../..";

const Right = ({
    autoFetch,
    posts,
    own,
    dark,
    user,
    setOneState,
    loading,
    setPosts,
    getDeletePostId,
}) => {
    const [title, setTitle] = useState("");

    const [attachment, setAttachment] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [loadingCreateNewPost, setLoadingCreateNewPost] = useState(false);
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

    const createNewPost = async (file) => {
        setLoadingCreateNewPost(true);
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
            formData.append("activity_price", price);
            formData.append("total_player_count", totalPlayerCount);
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);

            const {data} = await autoFetch.post(`/activities/`, formData);
            toast.success("Your activity will be approved by the system staff.!");
            setPosts([data, ...posts]);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoadingCreateNewPost(false);
    };
    const PostInRight = () => {
        if (loading) {
            return <LoadingPost />;
        }
        if (posts?.length) {
            return posts?.map((p) => (
                <Post
                    key={p.id}
                    currentActivity={p}
                    userId={p?.userId}
                    user_img={p.avatar}
                    getDeletePostId={getDeletePostId}
                    className={!dark ? "shadow-post" : ""}
                    userRole={p?.role}
                />
            ));
        }
        return (
            <div className='text-center w-full text-4xl dark:bg-[#242526] py-5 rounded-lg '>
                No activity found
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
                isAdvertisement={user?.role === 'COMPANY_STAFF'}
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
                    createNewActivity={createNewPost}
                />
            )}

            {user?.username === own?.username && form()}
            <div className='mb-4'>
                {loadingCreateNewPost && <LoadingPost />}
            </div>
            {PostInRight()}
        </div>
    );
};

export default Right;
