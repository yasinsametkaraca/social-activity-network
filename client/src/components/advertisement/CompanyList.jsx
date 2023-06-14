import {useEffect, useState} from "react";
import {TiTick} from "react-icons/ti";
import {toast} from "react-toastify";
import {LoadingSuggestion} from "../index.js";
import {useNavigate} from "react-router-dom";

const CompanyList = ({user, autoFetch, dark,}) => {

    const [pLoading, setPLoading] = useState(false);
    const [listCompany, setListCompany] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getListCompany();
    }, []);
    const getListCompany = async () => {
        setPLoading(true);
        try {
            const {data} = await autoFetch.get(`/companies/suggestions/`);
            setListCompany(data.results);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setPLoading(false);
    };
    const content = () => {
        if (listCompany.length === 0) {
            return (
                <div className='w-full text-center text-xl font-semibold '>
                    <div>No suggestion found!</div>
                </div>
            );
        }
        if (pLoading) {
            return <LoadingSuggestion />;
        }

        if (listCompany.length) {
            return (
                <>
                    <div className='flex items-center justify-between text-[#8e8e8e] dark:text-[] font-semibold mb-2 '>
                        Suggestion to you
                    </div>
                    {listCompany.map((p) => {
                        return (
                            <div
                                className='flex items-center  py-1.5 '
                                key={
                                    p.id
                                }>
                                <div
                                    className='flex items-center gap-x-1.5 '
                                    role='button'
                                    onClick={() => {
                                        navigate(`/company/${p?.employer}`);
                                    }}>
                                    <img
                                        src={`${p?.company_logo ? p?.company_logo : "/images/company.png"}`}
                                        alt='company logo'
                                        className='w-9 h-9 object-cover rounded-full  '
                                    />
                                    <div>
                                        <div className='font-semibold text-sm flex items-center gap-x-0.5 '>
                                            <span>
                                                {
                                                    p?.name
                                                }
                                            </span>
                                        </div>
                                        <div className='text-[12px] text-[#8e8e8e] '>
                                            {
                                                p?.company_mail
                                            }
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className='text-sky-600 ml-auto text-[13px] font-semibold '
                                    onClick={() => navigate(`/company/${p?.employer}`)}>
                                    See more
                                </button>
                            </div>
                        );
                    })}
                </>
            );
        }
        return <></>;
    };
    return (
        <div
            className={`bg-white ${
                !dark && "shadow-post"
            } dark:bg-[#242526] rounded-lg py-4 px-5 md:fixed w-full md:w-[24%] mr-12 mb-4 md:mb-0 `}>
            {content()}
        </div>
    );
};

export default CompanyList;
