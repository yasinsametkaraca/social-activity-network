import {useEffect, useState} from "react";
import moment from "moment/moment.js";
import {useNavigate} from "react-router-dom";

const AdvertisementItem = ({dark, autoFetch, isAdvertisementList = false, advertisementItem = {} }) => {

    const navigate = useNavigate();
    const [advertisement, setAdvertisement] = useState(advertisementItem);

    useEffect(() => {
        !isAdvertisementList && getHighlightAdvertisement();
    }, []);

    const getHighlightAdvertisement = async () => {
        try {
            const {data} = await autoFetch.get(`/advertisements/highlight/`);
            setAdvertisement(...data);
        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';

        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

        return dateTime.toLocaleString('en-US', options);
    };

    return (
        <div className={`bg-white  ${!dark ? "shadow-post" : ""} dark:bg-[#242526] flex flex-col w-full rounded-lg py-2 sm:py-3 ${!isAdvertisementList ? "md:py-4 md:w-[24%] md:fixed" : "h-[100%]"} px-5 mb-5 `}>
            {!isAdvertisementList &&
                <div className='flex items-center justify-between text-[#8e8e8e] dark:text-[] font-semibold mb-2 '>
                    Highlight Advertisement
                </div>
            }
            <div className='flex mt-2 justify-between	'>
                <div
                    className='flex items-start gap-x-1 cursor-pointer'
                    onClick={() => {
                        navigate(`/company/${advertisement?.company.employer}`);
                    }}>
                    <img
                        src={`${advertisement?.company?.company_logo ? advertisement?.company?.company_logo: "/images/company.png"}`}
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
                <div className='flex ml-auto  text-[15px]'>
                    {advertisement?.category}
                </div>
            </div>
            <div className={"ml-1 cursor-pointer"} onClick={() => navigate("/advertisement/detail/" + advertisement.id )}>
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
                {!isAdvertisementList &&
                    <>
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
                        <div className={`content my-3 ${advertisement?.image || advertisement?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                            {advertisement?.image && (
                                <img
                                    src={advertisement.image}
                                    alt=''
                                    className='object-cover'></img>
                            )}
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default AdvertisementItem;
