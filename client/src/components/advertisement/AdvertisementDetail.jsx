import {useEffect} from "react";
import moment from "moment/moment.js";
import {useNavigate} from "react-router-dom";

const AdvertisementDetail = ({dark, autoFetch, setAdvertisement, advertisement, getHighlightAdvertisement}) => {

    let navigate = useNavigate();

    useEffect(() => {
        getHighlightAdvertisement();
    }, []);

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';

        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

        return dateTime.toLocaleString('en-US', options);
    };

    console.log("rekllamm",advertisement);


    return (
        <div className={`bg-white  ${!dark ? "shadow-post" : ""} dark:bg-[#242526] flex flex-col items-start rounded-lg py-2 sm:py-3 md:py-4 px-5 md:fixed w-full mb-5 md:w-[24%] `}>
            <div className='flex items-center justify-between text-[#8e8e8e] dark:text-[] font-semibold mb-2 '>
                Highlight Advertisement
            </div>
            <div className='flex items-start gap-x-20 mt-2 justify-between'>
                <div
                    className='flex items-start gap-x-1'
                    onClick={() => {
                        navigate(`/profile/${advertisement?.employer}`);
                    }}>
                    <img
                        src={`${advertisement?.image ? advertisement?.image : "/images/profile.png"}`}
                        alt='advertisement company'
                        className='w-12 h-12 rounded-full'
                    />
                    <div className=''>
                        <div className='font-bold text-[16px]'>
                            {advertisement?.advertisement_company}
                        </div>
                        <div className='text-[14px] opacity-70 '>
                            {moment(advertisement?.created_at).fromNow()}
                        </div>
                    </div>
                </div>
                <div className='text-[16px]'>
                    {advertisement?.category}
                </div>
            </div>
            <div className={"ml-1"}>
                <div className={`content my-5 ${advertisement?.image || advertisement?.title.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                    <label className="font-bold">Title</label>
                    <div dangerouslySetInnerHTML={{ __html: advertisement?.title }}></div>
                </div>
                <div className={`content my-3 ${advertisement?.image || advertisement?.description.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                    <label className="font-bold">Description</label>
                    <div dangerouslySetInnerHTML={{ __html: advertisement?.description }}></div>
                </div>
                <div className="grid grid-cols-2 gap-9 max-sm:grid-cols-2">
                    <div className={`content my-3 ${advertisement?.image || advertisement?.start_date.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                        <label className="font-bold">Start Date</label>
                        <div>{formatDate(advertisement?.start_date)}</div>
                    </div>
                    <div className={`content my-3 ${advertisement?.image || advertisement?.end_date.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                        <label className="font-bold">End Date</label>
                        <div>{formatDate(advertisement?.end_date)}</div>
                    </div>
                </div>
                <div className={`content my-3 ${advertisement?.image || advertisement?.total_user_count?.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                    <label className="font-bold">Total User</label>
                    <div dangerouslySetInnerHTML={{ __html: advertisement?.total_user_count }}></div>
                </div>
                <div className="flex">
                    <div className={`content my-3 ${advertisement?.image || advertisement?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[16px]'}`}>
                        <label className="font-bold">Address</label>
                        <div dangerouslySetInnerHTML={{ __html: `${advertisement?.address?.address_line1} ${advertisement?.address?.address_line2 ? advertisement?.address?.address_line2 : ''} ${advertisement?.address?.city ? advertisement?.address?.city : ""} ${advertisement?.address?.country ? advertisement?.address?.country : ""} ${advertisement?.address?.postal_code ? advertisement?.address?.postal_code : ""}` }}></div>
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
            </div>
        </div>
    );
};

export default AdvertisementDetail;
