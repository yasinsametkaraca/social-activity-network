import {useEffect, useState} from "react";
import ReactLoading from "react-loading";
import {toast} from "react-toastify";
import {LoadingCard} from "../../../components";
import {useAppContext} from "../../../context/useContext.jsx";

const FollowingPage = ({
    dark,
    username,
    autoFetch,
    own,
    navigate,
    setNameAndToken,
    token,
}) => {
    const initList = {
        about: "",
        image: {url: "", public_id: ""},
        name: "",
        role: "",
        username: "",
        __v: 0,
        _id: "",
    };

    const [loading, setLoading] = useState(false);
    const [listFollowing, setListFollowing] = useState([initList]);
    useEffect(() => {
        getUserFollowing();
    }, []);

    const getUserFollowing = async () => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/profiles/following/${username}/`
            );
            setListFollowing(data);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoading(false);
    };
    if (loading) {
        return <LoadingCard />;
    }

    return (
        <div
            className={`bg-white w-full dark:bg-[#242526] p-4 rounded-lg ${
                !dark ? "shadow-post" : ""
            } `}>
            <div className='text-2xl font-extrabold dark:text-[#e4e6eb] '>
                Following
            </div>

            {listFollowing?.length > 0 ? (
                <div className='md:grid grid-cols-2 my-4 gap-1 '>
                    {listFollowing?.map((p) => (
                        <People
                            autoFetch={autoFetch}
                            navigate={navigate}
                            own={own}
                            p={p}
                            setNameAndToken={setNameAndToken}
                            token={token}
                            username={username}
                            key={p.username + "asdqweqw"}
                        />
                    ))}
                </div>
            ) : (
                <div className=' w-full text-center my-5  '>
                    User is not following anyone!
                </div>
            )}
        </div>
    );
};

export default FollowingPage;

export function People({
    p,
    navigate,
    username,
    own,
    setNameAndToken,
    token,
    autoFetch,
}) {
    const {setName} = useAppContext();
    const [loading, setLoading] = useState(false);

    const navigateToUserPage = (username) => {
        navigate(`/profile/${username}`);
    };
    const handleFollower = async (username) => {
        setLoading(true);
        try {
            const {data} = await autoFetch.post(`/profiles/follow/${username}/`);
            // setNameAndToken(data.user, token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setName(data.user);
            toast(`Follow ${username} success`);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoading(false);
    };
    const handleUnFollow = async (username) => {
        setLoading(true);
        try {
            const {data} = await autoFetch.post(`/profiles/follow/${username}/`);
            localStorage.setItem("user", JSON.stringify(data.user));
            //setNameAndToken(data.user, token);
            setName(data.user);
            toast.info(`You have unfollowed ${username}!`);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoading(false);
    };

    const btn = (p) => {
        if (loading) {
            return (
                <div className='w-16 sm:w-20 h-8 sm:h-10 flex items-center justify-center pb-2 ml-auto bg-[#3C4D63]/50 transition-20 text-white rounded-md'>
                    <ReactLoading
                        type='spin'
                        width='20%'
                        height='20%'
                        color='white'
                    />
                </div>
            );
        }
        if (p.username !== own.username) {
            if (own.following.includes(p.username)) {
                return (
                    <button
                        className='px-3 sm:px-4 py-1 md:py-2 ml-auto hover:bg-[#3C4D63] bg-[#3C4D63]/50 transition-20 text-white rounded-md text-[14px] sm:text-base '
                        onClick={() => {
                            if (
                                window.confirm("Do u want unfollow this user?")
                            ) {
                                handleUnFollow(p.username);
                            }
                        }}>
                        Unfollow
                    </button>
                );
            }
            return (
                <button
                    className=' px-3 sm:px-4 py-1 md:py-2 ml-auto hover:bg-[#3C4D63] bg-[#3C4D63]/50 transition-20 text-white rounded-md text-[14px] sm:text-base  '
                    onClick={() => handleFollower(p.username)}>
                    Follow
                </button>
            );
        }
        return null;
    };

    return (
        <div
            key={`${p.username}adada`}
            className='col-span-1 flex items-center gap-x-3 px-4 py-5 '>
            <img
                src={`${p.avatar ? (p.avatar) : "/images/profile.png"}`}
                alt=''
                className='w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 rounded-md object-cover cursor-pointer '
                onClick={() => navigateToUserPage(p.username)}
            />
            <div className=''>
                <div
                    className='text-[14px] sm:text-[17px]  font-semibold cursor-pointer '
                    onClick={() => navigateToUserPage(p.username)}>
                    {p.first_name}{" "}{p.last_name}
                </div>
                <div className='text-[12px] sm:text-[14px] dark:text-[#b0b3b8]  '>
                    {p.username}
                </div>
            </div>
            {btn(p)}
        </div>
    );
}
