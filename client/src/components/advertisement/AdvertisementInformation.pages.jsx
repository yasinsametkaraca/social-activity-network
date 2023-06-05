import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {useAppContext} from "../../context/useContext.jsx";
import {toast} from "react-toastify";
import moment from "moment/moment.js";
import {useNavigate} from "react-router-dom";


const AdvertisementInformation = () => {
    const { id } = useParams();
    const {autoFetch, dark} = useAppContext();
    const [advertisementDetail, setAdvertisementDetail] = useState({});
    const navigate = useNavigate()


    useEffect(() => {
        getAdvertisementDetail(id)
    }, []);

    const getAdvertisementDetail = async (id) => {
        try {
            const {data} = await autoFetch.get(`/advertisements/${id}/`);
            setAdvertisementDetail(data);
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

    return (
        <div className={`md:flex sm:w-screen sm:h-screen bg-[#F0F2F5] dark:bg-black dark:text-white pt-[65px] px-[5%] rounded-lg`}>
            <div className={`w-full h-[70%] mt-[3%] grid grid-cols-5 relative ${!dark && advertisementDetail?.image ? "shadow-post" : ""}`}>
                <div className={`${advertisementDetail?.image ? "md:col-span-3" : "md:col-span-20 md:ml-[100px] md:mr-[100px] lg:mr-[400px] lg:ml-[400px]"} col-span-10 dark:bg-[#242526] p-4 h-full bg-white rounded`}>
                    <div className='flex items-center justify-between'>
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
                        <div className='flex ml-auto  text-[15px]'>
                            {advertisementDetail?.category}
                        </div>
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
                            <a href={advertisementDetail?.advertisement_url}><div dangerouslySetInnerHTML={{ __html: advertisementDetail?.advertisement_url }}$></div></a>
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