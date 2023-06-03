import {useEffect, useState} from "react";
import {TiTick} from "react-icons/ti";
import {toast} from "react-toastify";
import {LoadingSuggestion} from "../..";
import {useAppContext} from "../../../context/useContext.jsx";

const Right = ({
    navigate,
    user,
    autoFetch,
    setNameAndToken,
    getAllActivities,
    token,
    dark,
    error,
}) => {
    const [pLoading, setPLoading] = useState(false);
    const [listPeople, setListPeople] = useState([]);
    const {setName} = useAppContext();

    useEffect(() => {
        if (token) {
            getListPeople();
        }
    }, [token]);
    const getListPeople = async () => {
        setPLoading(true);
        try {
            const {data} = await autoFetch.get(`/profiles/suggestions/`);
            setListPeople(data);
        } catch (error) {
            console.log(error);
        }
        setPLoading(false);
    };

    const handleFollower = async (username) => {
        try {
            const {data} = await autoFetch.post(`/profiles/follow/${username}/`);
            localStorage.setItem("user", JSON.stringify(data.user));
            setName(data.user);

            let filtered = listPeople.filter((p) => p.username !== username);
            setListPeople(filtered);
            getAllActivities();
            toast(`Follow ${username} success`);
        } catch (error) {
            console.log(error);
        }
    };

    const content = () => {
        if (error || listPeople.length === 0) {
            return (
                <div className='w-full text-center text-xl font-semibold '>
                    <div>No suggestion found! Please fulfill your profile!</div>
                </div>
            );
        }
        if (pLoading) {
            return <LoadingSuggestion />;
        }

        if (listPeople.length) {
            return (
                <>
                    <div className='flex items-center justify-between text-[#8e8e8e] dark:text-[] font-semibold mb-2 '>
                        Suggestion to you
                        <button className='text-[#262626] dark:text-[#bbbbbb] text-xs font-semibold '>
                            See all
                        </button>
                    </div>
                    {listPeople.map((p) => {
                        // @ts-ignore
                        if (p.username === user.username) {
                            // @ts-ignore
                            return <div key={p.username}></div>;
                        }
                        return (
                            <div
                                className='flex items-center  py-1.5 '
                                key={
                                    // @ts-ignore
                                    p.username
                                }>
                                <div
                                    className='flex items-center gap-x-1.5 '
                                    role='button'
                                    onClick={() => {
                                        // @ts-ignore
                                        navigate(`profile/${p.username}`);
                                    }}>
                                    <img
                                        // @ts-ignore
                                        src={`${p.avatar ? p.avatar : "/images/profile.png"}`}
                                        alt='avatar'
                                        className='w-9 h-9 object-cover rounded-full  '
                                    />
                                    <div>
                                        <div className='font-semibold text-sm flex items-center gap-x-0.5 '>
                                            <span>
                                                {
                                                    // @ts-ignore
                                                    p.username
                                                }
                                            </span>
                                            {
                                                // @ts-ignore
                                                p.role === "ADMIN" && (
                                                    <TiTick className='text-[17px] text-white rounded-full bg-sky-500 ' />
                                                )
                                            }
                                        </div>
                                        <div className='text-[12px] text-[#8e8e8e] '>
                                            {
                                                // @ts-ignore
                                                p.username
                                            }
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className='text-sky-600 ml-auto text-[13px] font-semibold '
                                    onClick={() => handleFollower(p.username)}>
                                    Follow
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

export default Right;
