import {useState} from "react";
import ReactLoading from "react-loading";
import {LoadingIntro, LoadingImage} from "../..";
import {AiOutlineLinkedin} from "react-icons/ai";

import {FaUniversity} from "react-icons/fa";
import {AiOutlineInstagram} from "react-icons/ai";
import {BsGenderFemale, BsGenderMale} from "react-icons/bs";
import moment from "moment";
import {RiCake2Line} from "react-icons/ri";

const Left = ({
    user,
    images,
    navigate,
    own,
    autoFetch,
    dark,
    profileLoading,
    postLoading,
}) => {
    const [editBio, setEditBio] = useState(false);
    const [textBio, setTextBio] = useState(user?.about);
    const [loading, setLoading] = useState(false);
    const rounded = [0, 2, images.length - (images.length % 3 || 3), images.length % 3 === 0 ? images.length - 1 : 99999999,];
    const positionRounded = ["tl", "tr", "bl", "br"];

    const updateUser = async () => {
        setLoading(true);
        try {
            await autoFetch.patch(`/profiles/about/`, {
                about: textBio || "",
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSubmitBio = () => {
        if (!textBio) {
            setEditBio(false);
        }
        updateUser();
        setEditBio(false);
    };

    const formattedDate = moment(user.birth_date).format('DD.MM.YYYY');

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
                        value={textBio}
                        className='bg-inherit border-[1px] rounded-lg px-4 py-2 w-[70%] my-3 '
                        placeholder='Type your bio... '
                        onChange={(e) => {
                            setTextBio(e.target.value);
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
                {textBio ||
                    user?.about ||
                    "This user is very nice but don't leave any trace! "}
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
                    Intro
                </div>
                {about()}
                {user?.username === own?.username && !editBio && (
                    <button
                        className='mt-3 py-2 w-full bg-[#afb1b5]/30 hover:bg-[#afb1b5]/50 dark:bg-[#4E4F50]/50 dark:hover:bg-[#4E4F50] transition-20 rounded-md font-semibold '
                        onClick={() => {
                            setEditBio(true);
                        }}
                        disabled={loading}>
                        Edit Biography
                    </button>
                )}
                <div className='mt-5 flex gap-x-2 items-center flex-col'>
                    {
                        user?.education_level && (
                            <div className="flex flex-col items-center mb-7 justify-center">
                                <FaUniversity className="text-3xl" />
                                <div className="text-xs">
                                    <strong>
                                        {user.education_level === "ES" ? "Elementary School" :
                                            user.education_level === "MS" ? "Middle School" :
                                                user.education_level === "HS" ? "High School" :
                                                    user.education_level === "AD" ? "Associate's Degree" :
                                                        user.education_level === "BD" ? "Bachelor's Degree" :
                                                            user.education_level === "MD" ? "Master's Degree" :
                                                                user.education_level === "PhD" ? "Doctorate or PhD" : ""}
                                    </strong>
                                </div>
                            </div>
                        )
                    }
                    {
                        user?.gender && (
                            <div className="flex flex-col items-center mb-7 justify-center">
                                {user?.gender==="M" ? <BsGenderMale className="text-3xl" /> : <BsGenderFemale className="text-3xl" />}
                                <div className="text-xs">
                                    <strong>
                                        {user.gender === "M" ? "Male" :
                                            user.gender === "F" ? "Female" : ""}
                                    </strong>
                                </div>
                            </div>
                        )
                    }
                    {user?.birth_date &&
                        <div className={"flex flex-col mb-7 items-center justify-center"}>
                            <RiCake2Line className='text-3xl'/>
                            <div className='text-xs'>
                                <strong>{formattedDate}</strong>
                            </div>
                        </div>
                    }
                    {user?.linkedin_url &&
                        <div className={"flex flex-col mb-7 items-center justify-center"}>
                            <a href={user?.linkedin_url} target="_blank" rel="noopener noreferrer"><AiOutlineLinkedin className='text-3xl'/></a>
                            <div className='text-xs' >
                                <strong><a href={user?.linkedin_url} target="_blank" rel="noopener noreferrer">{user?.linkedin_url}</a></strong>
                            </div>
                        </div>
                    }
                    {user?.website_url &&
                        <div className={"flex flex-col mb-7 items-center justify-center"}>
                            <a href={user?.website_url} target="_blank" rel="noopener noreferrer"><AiOutlineInstagram className='text-3xl'/></a>
                            <div className='text-xs'>
                                <strong><a href={user?.website_url} target="_blank" rel="noopener noreferrer">{user?.website_url}</a></strong>
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
                                    navigate(`/activity/detail/${i?.id}`);
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
