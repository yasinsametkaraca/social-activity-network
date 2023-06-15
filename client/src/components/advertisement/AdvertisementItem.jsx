import {useEffect, useState} from "react";
import moment from "moment/moment.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Modal from "../common/Modal.jsx";
import PostLoading from "../loading/Loading.Post.jsx";

const AdvertisementItem = ({dark, autoFetch, user={},getAdvertisements=[] ,isAdvertisementList = false, advertisementItem = {} }) => {

    const navigate = useNavigate();
    const [advertisement, setAdvertisement] = useState(advertisementItem);
    const [imageEdit, setImageEdit] = useState(advertisementItem?.image);
    const [descriptionEdit, setDescriptionEdit] = useState(advertisementItem?.description);
    const [totalPlayerCountEdit, setTotalPlayerCountEdit] = useState(advertisementItem?.total_user_count);
    const [startDateEdit, setStartDateEdit] = useState(advertisementItem?.start_date);
    const [endDateEdit, setEndDateEdit] = useState(advertisementItem?.end_date);
    const [addressEdit, setAddressEdit] = useState(advertisementItem?.address);
    const [categoryEdit, setCategoryEdit] = useState(advertisementItem?.category);
    const [priceEdit, setPriceEdit] = useState(advertisementItem?.advertisement_price);
    const [titleEdit, setTitleEdit] = useState(advertisementItem?.title);
    const [advertisementUrl, setAdvertisementUrl] = useState(advertisementItem?.advertisement_url);
    const [advertisementStatus, setAdvertisementStatus] = useState(advertisementItem?.advertisement_status);
    const [attachment, setAttachment] = useState(
        advertisementItem?.image ? "photo" : ""
    );
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showOption, setShowOption] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [convertActivity, setConvertActivity] = useState(false);

    useEffect(() => {
        !isAdvertisementList && getHighlightAdvertisement();
    }, []);

    const getHighlightAdvertisement = async () => {
        try {
            const {data} = await autoFetch.get(`/advertisements/highlight/`);
            setAdvertisement(...data);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
    }

    const updateAdvertisement = async (file) => {
        setLoadingEdit(true);
        try {
            let formData = new FormData();
            file && formData.append("image", file);
            formData.append("title", titleEdit);
            formData.append("description", descriptionEdit);
            formData.append("address.address_line1", addressEdit.address_line1);
            formData.append("address.city", addressEdit.city);
            formData.append("address.country", addressEdit.country);
            formData.append("category", categoryEdit);
            formData.append("advertisement_price", priceEdit);
            formData.append("total_user_count", totalPlayerCountEdit);
            formData.append("start_date", startDateEdit);
            formData.append("end_date", endDateEdit);
            advertisementUrl && formData.append("advertisement_url", advertisementUrl);

            const {data} = await autoFetch.patch(
                `/advertisements/${advertisement.id}/`, formData);
            setAdvertisement(data)
            setTitleEdit(data.title);
            setImageEdit(data.image);
            setDescriptionEdit(data.description);
            setTotalPlayerCountEdit(data.total_user_count);
            setStartDateEdit(data.start_date);
            setEndDateEdit(data.end_date);
            setAddressEdit(data.address);
            setCategoryEdit(data.category);
            setPriceEdit(data.activity_price);
            setAdvertisementUrl(data.advertisement_url);
            setAdvertisementStatus(data.advertisement_status);
            navigate(`/company/${advertisementItem?.company?.employer}`)
            if (data.image) {
                setAttachment("photo");
            }
            toast("Update advertisement success! Your ad will be approved by the system staff.!");
        } catch (error) {
            toast.error("Something went wrong!");
        }
        setLoadingEdit(false);
    };

    const convertAdvertisementToActivity = async (file) => {
        setLoadingEdit(true);
        try {
            let formData = new FormData();
            file && formData.append("image", file);
            formData.append("title", titleEdit);
            formData.append("description", descriptionEdit);
            formData.append("address.address_line1", addressEdit.address_line1);
            formData.append("address.city", addressEdit.city);
            formData.append("address.country", addressEdit.country);
            formData.append("category", categoryEdit);
            formData.append("activity_price", priceEdit);
            formData.append("total_player_count", totalPlayerCountEdit);
            formData.append("start_date", startDateEdit);
            formData.append("end_date", endDateEdit);

            const {data} = await autoFetch.post(`/activities/`, formData);
            toast("Activity create success! Your activity will be approved by the system staff.!");
            navigate(`/profile/${user?.username}`)
            setConvertActivity(false)
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoadingEdit(false);
    }

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';

        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

        return dateTime.toLocaleString('en-US', options);
    };

    const deleteAdvertisement = async () => {
        try {
            await autoFetch.delete(`/advertisements/${advertisementItem?.id}/`);
            toast.success("Advertisement deleted successfully.");
            navigate("/advertisement")
        } catch (e) {
            toast.error("Error.");
        }
    }

    if (loadingEdit) {
        return <PostLoading className='mb-4' />;
    }

    return (
        <div className={`bg-white ${!dark ? "shadow-post" : ""} dark:bg-[#242526] flex flex-col w-full rounded-lg py-2 sm:py-3 ${!isAdvertisementList ? "md:py-4 md:w-[24%] md:fixed" : "h-[100%]"} px-5 mb-5 `}>
            {!isAdvertisementList &&
                <div className='flex items-center justify-between text-[#8e8e8e] dark:text-[] font-semibold mb-2 '>
                    Highlight Advertisement
                </div>
            }
            <div className='flex mt-2 justify-between'>
                {openModal && (
                    <Modal
                        setOpenModal={setOpenModal}
                        attachment={attachment}
                        setAttachment={setAttachment}
                        isEditPost={true}
                        imageEdit={imageEdit}
                        setFormDataEdit={setFormData}
                        handleEditPost={convertActivity ? convertAdvertisementToActivity : updateAdvertisement}
                        setImageEdit={setImageEdit}
                        title={titleEdit}
                        setTitle={setTitleEdit}
                        description={descriptionEdit}
                        setDescription={setDescriptionEdit}
                        totalPlayerCount={totalPlayerCountEdit}
                        setTotalPlayerCount={setTotalPlayerCountEdit}
                        startDate={startDateEdit}
                        setStartDate={setStartDateEdit}
                        endDate={endDateEdit}
                        setEndDate={setEndDateEdit}
                        address={addressEdit}
                        setAddress={setAddressEdit}
                        category={categoryEdit}
                        setCategory={setCategoryEdit}
                        price={priceEdit}
                        setPrice={setPriceEdit}
                        isAdvertisement={!convertActivity}
                        advertisementUrl={advertisementUrl}
                        setAdvertisementUrl={setAdvertisementUrl}
                        convertActivity={convertActivity}
                    />
                )}
                <div
                    className='flex items-start gap-x-1 cursor-pointer'
                    onClick={() => {
                        navigate(`/company/${advertisement?.company.employer}`);
                    }}>
                    <img
                        src={`${advertisement?.company?.company_logo ? advertisement?.company?.company_logo : "/images/company.png"}`}
                        alt='advertisement company'
                        className='w-12 h-12 rounded-full'
                    />
                    <div className=''>
                        <div className='font-bold text-[15px]'>
                            {advertisement?.company?.name}
                        </div>
                        <div className='text-[14px] opacity-70 '>
                            {moment(advertisement?.created_at).fromNow()}
                        </div>
                    </div>
                </div>
                <div className='flex text-[15px]'>
                    {advertisement?.category}
                </div>
                {(advertisementItem?.company?.employer === user?.username) && advertisementStatus === true && (
                    <div
                        className='ml-2 text-[25px] transition-50 cursor-pointer font-bold w-[35px] h-[35px] rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] flex flex-row items-center justify-center group relative '
                        onClick={() => {
                            setShowOption(!showOption);
                        }}>
                        <div className='translate-y-[-12px] z-[100] '>...</div>
                        <ul
                            className={`text-base absolute top-[110%] text-center mr-9 ${
                                !showOption ? "hidden" : "flex flex-col"
                            }   `}
                            onMouseLeave={() => {
                                setShowOption(false);
                            }}>
                            <li
                                className='px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60 '
                                onClick={() => {
                                    setOpenModal(true);
                                }}>
                                Edit
                            </li>
                            <li
                                className='mt-1 px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60'
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Do u want delete this post?"
                                        )
                                    ) {
                                        deleteAdvertisement(advertisementItem?.id);
                                    }
                                }}>
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
                {advertisementStatus === false &&
                    <div className='flex text-[15px]'>
                        <span className="text-red-500">Waiting for approval</span>
                    </div>
                }
                {user?.role === "FRIEND" && isAdvertisementList &&
                    <div className='flex text-[15px]'
                         onClick={() => {
                             setOpenModal(true)
                             setConvertActivity(true)
                         }}>
                        <span className="text-green-600 cursor-pointer border-full">Convert Activity</span>
                    </div>
                }
            </div>
            <div className={"ml-1 cursor-pointer"} onClick={() => navigate("/advertisement/detail/" + advertisement?.id )}>
                {advertisement?.title &&
                    <div className={`content my-5 ${advertisement?.image || advertisement?.title.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                        <label className="font-bold">Title</label>
                        <div dangerouslySetInnerHTML={{ __html: advertisement?.title }}></div>
                    </div>
                }
                {advertisement?.description &&
                    <div className={`content my-3 ${advertisement?.image || advertisement?.description.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                        <label className="font-bold">Description</label>
                        <div dangerouslySetInnerHTML={{ __html: advertisement?.description }}></div>
                    </div>
                }
                {!isAdvertisementList &&
                    <>
                        <div className="grid grid-cols-2 gap-9 max-sm:grid-cols-2">
                            {advertisement?.start_date &&
                                <div className={`content my-3 ${advertisement?.image || advertisement?.start_date.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                    <label className="font-bold">Start Date</label>
                                    <div>{formatDate(advertisement?.start_date)}</div>
                                </div>
                            }
                            {advertisement?.end_date &&
                                <div className={`content my-3 ${advertisement?.image || advertisement?.end_date.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                    <label className="font-bold">End Date</label>
                                    <div>{formatDate(advertisement?.end_date)}</div>
                                </div>
                            }
                        </div>
                        <div className="grid grid-cols-2 gap-9 max-sm:grid-cols-2">
                            <div className={`content my-3 ${advertisement?.image || advertisement?.total_user_count?.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                <label className="font-bold">Price</label>
                                <div className={"flex"}>
                                    <div dangerouslySetInnerHTML={{ __html: advertisement?.advertisement_price}}></div><span>$</span>
                                </div>
                            </div>
                            <div className={`content my-3 ${advertisement?.image || advertisement?.total_user_count?.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                <label className="font-bold">Total User</label>
                                <div dangerouslySetInnerHTML={{ __html: advertisement?.total_user_count }}></div>
                            </div>
                        </div>
                        {advertisement?.advertisement_url > 0 &&
                            <div className={`content my-3 ${advertisement?.image || advertisement?.total_user_count?.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                <label className="font-bold">Url</label>
                                <a href={advertisement?.advertisement_url}><div dangerouslySetInnerHTML={{ __html: advertisement?.advertisement_url }}$></div></a>
                            </div>
                        }
                        <div className="flex">
                            <div className={`content my-3 ${advertisement?.image || advertisement?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                                <label className="font-bold">Address</label>
                                <div dangerouslySetInnerHTML={{ __html: `${advertisement?.address?.address_line1 ? advertisement?.address?.address_line1 : ""} 
                            ${advertisement?.address?.address_line2 ? advertisement?.address?.address_line2 : ''} ${advertisement?.address?.city ? advertisement?.address?.city : ""} 
                            ${advertisement?.address?.country ? advertisement?.address?.country : ""} 
                            ${advertisement?.address?.postal_code ? advertisement?.address?.postal_code : ""}` }}>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <div className={`content my-3 ${advertisement?.image || advertisement?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                    {advertisement?.image && (
                        <img
                            src={advertisement.image}
                            alt=''
                            className='object-cover'></img>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvertisementItem;
