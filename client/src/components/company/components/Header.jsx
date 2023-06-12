import {useState} from "react";
import ReactLoading from "react-loading";
// icon
import {FiEdit2} from "react-icons/fi";
import {TiTick} from "react-icons/ti";

const Header = ({
                    user,
                    own,
                    navigate,
                    autoFetch,
                    setNameAndToken,
                    token,
                }) => {
    const [loading, setLoading] = useState(false);


    const btn = () => {
        if (loading) {
            return (
                <div className='flex gap-x-1 items-center justify-center font-semibold w-20 h-10 bg-[#D8DADF]/50 dark:bg-[#4E4F50]/50 rounded-md pb-2 '>
                    <ReactLoading
                        type='spin'
                        width='20%'
                        height='20%'
                        color='white'
                    />
                </div>
            );
        }
        if (user?.username === own?.username && own.role === 'COMPANY_STAFF')
            return (
                <button
                    className='flex gap-x-1 items-center font-semibold px-3 py-2 bg-[#D8DADF]/50 hover:bg-[#D8DADF] dark:bg-[#4E4F50]/50 dark:hover:bg-[#4E4F50] transition-20 rounded-md '
                    onClick={() => {
                        navigate(`/update-company`);
                    }}>
                    <FiEdit2 className=' ' />
                    Edit Company
                </button>
            );
    };

    return (
        <div className='pt-[50px] md:pt-[75px] md:px-[15%] w-full dark:bg-[#242426] bg-white overflow-x-hidden '>
            {/* background image */}
            <img
                src='https://res.cloudinary.com/dcwekkkez/image/upload/v1656421547/bavmjvxcucadotx45jtk.jpg'
                alt='bg'
                className='w-full h-[18vh] sm:h-[25vh] md:h-[30vh] object-cover rounded-b-lg '
            />
            <div className='flex flex-col sm:flex-row mx-10 sm:items-start gap-x-4 border-b-[1px] dark:border-b-white/10 border-b-black/10 items-center '>
                {/* avatar */}
                <img
                    src={user?.company?.company_logo ? user?.company?.company_logo : "/images/company.png"}
                    alt='avatar'
                    className='w-[170px] h-[170px] rounded-full object-cover translate-y-[-32px] shrink-0  dark:border-white border-4 border-black/50 '
                />
                <div className='flex flex-col sm:flex-row w-full justify-between items-center sm:items-end pt-4 translate-y-[-32px] sm:translate-y-[0] '>
                    <div>
                        <div className='flex justify-start max-sm:justify-center '>
                            <div className='text-[32px] font-bold md:flex items-center gap-x-1 '>
                                <div className='text-center flex items-center justify-center '>
                                    {user?.company?.name}{" "}
                                    {user?.role === "COMPANY_STAFF" && (
                                        <TiTick className='text-[20px] text-white rounded-full bg-sky-500 ' />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='font-normal md:text-[18px] flex-shrink-0 '>
                            {user?.first_name && user?.last_name &&
                                `${user.first_name.charAt(0).toUpperCase()}${user.first_name.slice(1)} ${user.last_name.charAt(0).toUpperCase()}${user.last_name.slice(1)}`
                            }
                        </div>
                    </div>
                    <div className='flex mt-4 sm:mt-0 flex-shrink-0 '>
                        {btn()}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Header;
