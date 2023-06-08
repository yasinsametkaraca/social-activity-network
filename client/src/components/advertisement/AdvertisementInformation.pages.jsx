import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {useAppContext} from "../../context/useContext.jsx";
import {toast} from "react-toastify";
import moment from "moment/moment.js";
import {useNavigate} from "react-router-dom";
import Modal from "../common/Modal.jsx";
import PostLoading from "../loading/Loading.Post.jsx";


const AdvertisementInformation = () => {
    const { id } = useParams();
    const {autoFetch, dark, user} = useAppContext();
    const [advertisementDetail, setAdvertisementDetail] = useState({});
    const navigate = useNavigate()
    const [showOption, setShowOption] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [imageEdit, setImageEdit] = useState(advertisementDetail?.image);
    const [descriptionEdit, setDescriptionEdit] = useState(advertisementDetail?.description);
    const [totalPlayerCountEdit, setTotalPlayerCountEdit] = useState(advertisementDetail?.total_player_count);
    const [startDateEdit, setStartDateEdit] = useState(advertisementDetail?.start_date);
    const [endDateEdit, setEndDateEdit] = useState(advertisementDetail?.end_date);
    const [addressEdit, setAddressEdit] = useState(advertisementDetail?.address);
    const [categoryEdit, setCategoryEdit] = useState(advertisementDetail?.category);
    const [priceEdit, setPriceEdit] = useState(advertisementDetail?.advertisement_price);
    const [titleEdit, setTitleEdit] = useState(advertisementDetail?.title);
    const [advertisementUrl, setAdvertisementUrl] = useState(advertisementDetail?.advertisement_url);
    const [attachment, setAttachment] = useState(
        advertisementDetail?.image ? "photo" : ""
    );
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [formData, setFormData] = useState(null);
    const [advertisementStatus, setAdvertisementStatus] = useState(advertisementDetail?.advertisement_status);


    useEffect(() => {
        getAdvertisementDetail(id)
    }, []);

    const getAdvertisementDetail = async (id) => {
        try {
            const {data} = await autoFetch.get(`/advertisements/${id}/`);
            setAdvertisementDetail(data);
            setTitleEdit(data.title);
            setImageEdit(data.image);
            setDescriptionEdit(data.description);
            setTotalPlayerCountEdit(data.total_user_count);
            setStartDateEdit(data.start_date);
            setEndDateEdit(data.end_date);
            setAddressEdit(data.address);
            setCategoryEdit(data.category);
            setPriceEdit(data.advertisement_price);
            setAdvertisementUrl(data.advertisement_url);
            setAdvertisementStatus(data.advertisement_status)
            console.log(data);
        } catch (e) {
            toast.error("Error.");
        }
    }

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';

        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

        return dateTime.toLocaleString('en-US', options);
    };

    const updateAdvertisement = async () => {
        setLoadingEdit(true);
        try {
            const {data} = await autoFetch.patch(
                `/advertisements/${advertisementDetail.id}/`,
                {
                    title: titleEdit,
                    description: descriptionEdit,
                    total_user_count: totalPlayerCountEdit,
                    start_date: startDateEdit,
                    end_date: endDateEdit,
                    address: addressEdit,
                    category: categoryEdit,
                    advertisement_price: priceEdit,
                    advertisement_url: advertisementUrl,
                    image: formData ? formData : null,
                }
            );
            setAdvertisementDetail(data);
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
            navigate(`/company/${advertisementDetail?.company?.employer}`)
            if (data.image) {
                setAttachment("photo");
            }
            toast("Update advertisement success! Your ad will be approved by the system staff.!");
        } catch (error) {
            toast.error("Something went wrong!");
        }
        setLoadingEdit(false);
    };

    if (loadingEdit) {
        return <PostLoading className='mb-4' />;
    }

    const deleteAdvertisement = async () => {
        try {
            await autoFetch.delete(`/advertisements/${advertisementDetail?.id}/`);
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
        <div className={`md:flex sm:w-screen sm:h-screen bg-[#F0F2F5] dark:bg-black dark:text-white pt-[65px] px-[5%] rounded-lg`}>
            <div className={`w-full h-[70%] mt-[3%] grid grid-cols-5 relative ${!dark && advertisementDetail?.image ? "shadow-post" : ""}`}>
                <div className={`${advertisementDetail?.image ? "md:col-span-3" : "md:col-span-20 md:ml-[100px] md:mr-[100px] lg:mr-[400px] lg:ml-[400px]"} col-span-10 dark:bg-[#242526] p-4 h-full bg-white rounded`}>
                    <div className='flex items-center justify-between'>
                        {openModal && (
                            <div>
                                <Modal
                                    setOpenModal={setOpenModal}
                                    attachment={attachment}
                                    setAttachment={setAttachment}
                                    isEditPost={true}
                                    imageEdit={imageEdit}
                                    setFormDataEdit={setFormData}
                                    handleEditPost={updateAdvertisement}
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
                                    isAdvertisement={true}
                                    advertisementUrl={advertisementUrl}
                                    setAdvertisementUrl={setAdvertisementUrl}
                                />
                            </div>
                        )}
                        <div
                            className='flex items-start gap-x-1'
                            onClick={() => {
                                navigate(`/company/${advertisementDetail?.company.employer}`);
                            }}>
                            <img
                                src={`${advertisementDetail?.image ? advertisementDetail?.company?.company_logo: "/images/company.png"}`}
                                alt='advertisement company'
                                className='w-12 h-12 rounded-full'
                            />
                            <div className=''>
                                <div className='font-bold text-[15px]'>
                                    {advertisementDetail?.company?.name}
                                </div>
                                <div className='text-[14px] opacity-70 '>
                                    {moment(advertisementDetail?.created_at).fromNow()}
                                </div>
                            </div>
                        </div>
                        <div className='flex text-[15px]'>
                            {advertisementDetail?.category}
                        </div>
                        {(advertisementDetail?.company?.employer === user?.username) &&  advertisementStatus === true && (
                            <div
                                className='ml-2 text-[25px] transition-50 cursor-pointer font-bold w-[35px] h-[35px] rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] flex flex-row items-center justify-center group relative '
                                onClick={() => {
                                    setShowOption(!showOption);
                                }}>
                                <div className='translate-y-[-6px] z-[100] '>...</div>
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
                                                deleteAdvertisement(advertisementDetail?.id);
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
                    </div>
                    {advertisementDetail?.title &&
                        <div className={`content my-5 ${advertisementDetail?.image || advertisementDetail?.title.length > 100 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Title</label>
                            <div dangerouslySetInnerHTML={{ __html: advertisementDetail?.title }}></div>
                        </div>
                    }
                    {advertisementDetail?.description &&
                        <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.description.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Description</label>
                            <div dangerouslySetInnerHTML={{ __html: advertisementDetail?.description }}></div>
                        </div>
                    }
                    {advertisementDetail?.advertisement_url > 0 &&
                        <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.total_user_count?.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Url</label>
                            <a href={advertisementDetail?.advertisement_url}><div dangerouslySetInnerHTML={{ __html: advertisementDetail?.advertisement_url }}></div></a>
                        </div>
                    }
                    <div className="grid grid-cols-3 gap-10 max-sm:grid-cols-2">
                        {advertisementDetail?.start_date &&
                            <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.start_date.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                                <label className="font-bold">Start Date</label>
                                <div>{formatDate(advertisementDetail?.start_date)}</div>
                            </div>
                        }
                        <div className={"max-sm:hidden"}></div>
                        {advertisementDetail?.end_date &&
                            <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.end_date.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                                <label className="font-bold">End Date</label>
                                <div>{formatDate(advertisementDetail?.end_date)}</div>
                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-3 gap-10 max-sm:grid-cols-2">
                        <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.total_user_count?.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Total User</label>
                            <div dangerouslySetInnerHTML={{ __html: advertisementDetail?.total_user_count }}></div>
                        </div>
                        <div className={"max-sm:hidden"}></div>
                        <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.total_user_count?.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Price</label>
                            <div className={"flex"}>
                                <div dangerouslySetInnerHTML={{ __html: advertisementDetail?.advertisement_price}}></div><span>$</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        <div className={`content my-3 ${advertisementDetail?.image || advertisementDetail?.address?.address_line1.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Address</label>
                            <div dangerouslySetInnerHTML={{ __html: `${advertisementDetail?.address?.address_line1 ? advertisementDetail?.address?.address_line1 : ""} 
                                ${advertisementDetail?.address?.address_line2 ? advertisementDetail?.address?.address_line2 : ''} ${advertisementDetail?.address?.city ? advertisementDetail?.address?.city : ""} 
                                ${advertisementDetail?.address?.country ? advertisementDetail?.address?.country : ""} 
                                ${advertisementDetail?.address?.postal_code ? advertisementDetail?.address?.postal_code : ""}` }}>
                            </div>
                        </div>
                    </div>
                    <div className={`md:hidden content my-3 ${advertisementDetail?.image || advertisementDetail?.address?.address_line1.length > 60 ? 'text-[16px]' : 'text-[17px]'}`}>
                        {advertisementDetail?.image && (
                            <img
                                src={advertisementDetail.image}
                                alt=''
                                className='object-cover'></img>
                        )}
                    </div>
                </div>
                {advertisementDetail?.image &&
                    <div className='md:col-span-2 col-span-5 bg-white max-sm:hidden dark:bg-[#242526] relative flex items-center justify-center h-full'>
                        <div className='absolute h-[95%] w-[95%] flex items-center md:bg-[#F0F2F5] dark:bg-black  justify-center'>
                            {advertisementDetail?.image && (
                                <img
                                    src={advertisementDetail.image}
                                    alt=''
                                    className='object-cover w-auto h-auto max-h-full'></img>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default AdvertisementInformation;