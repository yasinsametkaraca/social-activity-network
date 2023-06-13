import {useState} from "react";
import ReactLoading from "react-loading";
import {LoadingIntro, LoadingImage} from "../..";
import {AiOutlineMail, AiOutlinePhone} from "react-icons/ai";
import {CgWebsite} from "react-icons/cg";

const Left = ({user,
              images,
              navigate,
              own,
              autoFetch,
              dark,
              profileLoading,
              postLoading,
              setUser,
              }) => {
    const [editBio, setEditBio] = useState(false);
    const [textDescription, setTextDescription] = useState(user?.company?.description);
    const [loading, setLoading] = useState(false);
    const rounded = [0, 2, images.length - (images.length % 3 || 3), images.length % 3 === 0 ? images.length - 1 : 99999999,];
    const positionRounded = ["tl", "tr", "bl", "br"];

    const updateUser = async () => {
        setLoading(true);
        try {
            await autoFetch.patch(`/companies/`, {
                description: textDescription || "",
            });
            setUser({...user, company: {...user.company, description: textDescription}});
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSubmitBio = () => {
        if (!textDescription) {
            setEditBio(false);
        }
        updateUser();
        setEditBio(false);
    };


    const about = () => {
        if (editBio) {
            return (
                <form
                    className='flex items-center flex-col '
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitBio();
                    }}>
                    <textarea
                        autoFocus
                        value={textDescription}
                        className='bg-inherit border-[1px] rounded-lg px-4 py-2 w-[70%] my-3 '
                        placeholder='Type your description... '
                        onChange={(e) => {
                            setTextDescription(e.target.value);
                        }}
                    />
                    <div className='flex gap-x-1.5 '>
                        <button
                            className='bg-[#4E4F50]/20 dark:bg-[#4E4F50]/50 hover:text-white rounded-lg hover:bg-[#4E4F50] transition-50 w-[80px] py-1 '
                            type='submit'>
                            Save
                        </button>
                        <button
                            className=' w-[80px] bg-red-300 hover:text-white dark:bg-red-800 rounded-lg hover:bg-red-600 transition-50 '
                            onClick={() => {
                                setEditBio(false);
                                setTextDescription(user?.company?.description);
                            }}
                            type='reset'>
                            Cancel
                        </button>
                    </div>
                </form>
            );
        }
        return (
            <div
                className={`text-center mt-4 px-[20%] text-[15px] flex items-center justify-center gap-x-1 ${
                    loading && "opacity-60"
                } `}>
                {textDescription ||
                    user?.company?.description ||
                    "This company is very nice but don't leave any trace! "}
                <div className={`${!loading && "hidden"}`}>
                    <ReactLoading
                        type='bubbles'
                        width={25}
                        height={25}
                        color='#6A7583'
                    />
                </div>
            </div>
        );
    };

    const intro = () => {
        if (profileLoading) {
            return <LoadingIntro />;
        }
        return (
            <div
                className={`bg-white dark:bg-[#242526] p-4 rounded-lg ${
                    !dark ? "shadow-post" : ""
                } `}>
                <div className='text-2xl font-extrabold dark:text-[#e4e6eb] '>
                    Company
                </div>
                {about()}
                {user?.username === own?.username && !editBio && (
                    <button
                        className='mt-3 py-2 w-full bg-[#afb1b5]/30 hover:bg-[#afb1b5]/50 dark:bg-[#4E4F50]/50 dark:hover:bg-[#4E4F50] transition-20 rounded-md font-semibold '
                        onClick={() => {
                            setEditBio(true);
                            setTextDescription(user?.company?.description)
                        }}
                        disabled={loading}>
                        Edit Description
                    </button>
                )}

                <div className='mt-5 flex gap-x-2 items-center flex-col'>
                    {
                        user?.company?.company_mail && (
                            <div className="flex flex-col items-center mb-7 justify-center">
                                <AiOutlineMail className="text-3xl" />
                                <div className="text-xs">
                                    <strong>
                                        <a href={`mailto:${user?.company?.company_mail}`}>
                                            {user?.company?.company_mail}
                                        </a>
                                    </strong>
                                </div>
                            </div>
                        )
                    }
                    {
                        user?.company?.company_phone && (
                            <div className="flex flex-col items-center mb-7 justify-center">
                                <AiOutlinePhone className="text-3xl" />
                                <div className="text-xs">
                                    <a href={`tel:${user?.company?.company_phone}`}>
                                        <strong>{user?.company?.company_phone}</strong>
                                    </a>
                                </div>
                            </div>
                        )
                    }
                    {user?.company?.company_url &&
                        <div className={"flex flex-col mb-7 items-center justify-center"}>
                            <a href={user?.company?.company_url} target="_blank" rel="noopener noreferrer"><CgWebsite className='text-3xl'/></a>
                            <div className='text-xs' >
                                <strong><a href={user?.company?.company_url} target="_blank" rel="noopener noreferrer">Company URL</a></strong>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    };

    const photo = () => {
        if (postLoading) {
            return <LoadingImage />;
        }
        return (
            <div
                className={`bg-white dark:bg-[#242526] p-4 rounded-lg ${
                    !dark ? "shadow-post" : ""
                }`}>
                <div className='flex justify-start items-center '>
                    <div className='text-2xl font-extrabold dark:text-[#e4e6eb] '>
                        Photo
                    </div>
                </div>
                <div
                    className={`grid grid-cols-3 grid-rows-${
                        (images?.length - (images?.length % 3)) / 3
                    } rounded-lg gap-1 mt-3 `}>
                    {images?.length > 0 ? (
                        images?.map((i, k) => (
                            <div
                                key={i?.image}
                                className='w-full  pt-[100%] relative cursor-pointer '
                                onClick={() => {
                                    navigate(`/advertisement/detail/${i?.id}`);
                                }}>
                                <img
                                    src={i?.image}
                                    alt='aaa'
                                    className={`w-full h-full absolute top-0 left-0 object-cover ${
                                        rounded.includes(k)
                                            ? `rounded-${
                                                positionRounded[
                                                    rounded.indexOf(k)
                                                    ]
                                            }-lg`
                                            : ""
                                    } `}
                                />
                            </div>
                        ))
                    ) : (
                        <div className='text-center my-3 col-span-3 '>
                            No image found!
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className='mb-4 '>
            {/* Intro */}
            {intro()}
            {/* image */}
            <div className='mt-4'>{photo()}</div>
        </div>
    );
};

export default Left;
