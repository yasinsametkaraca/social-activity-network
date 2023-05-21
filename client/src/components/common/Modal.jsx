import React, {useState} from "react";
import {useAppContext} from "../../context/useContext.jsx";
import {GiEarthAmerica} from "react-icons/gi";
import {
    MdArrowDropDown,
    MdPhoto,
    MdAddPhotoAlternate,
    MdCancel,
} from "react-icons/md";
import {FaVideo} from "react-icons/fa";
import {toast} from "react-toastify";
import ReactLoading from "react-loading";

const Modal = ({
    setOpenModal = (event) => {},
    attachment = "",
    setAttachment = (event) => {},
    createNewActivity = () => {},
    handleEditPost = () => {},
    isEditPost = false,
    imageEdit = "",
    setFormDataEdit = (event) => {},
    setImageEdit = (event) => {},
    description= "",
    setDescription = (event) => {},
    address = "",
    setAddress = (event) => {},
    category = "",
    setCategory = (event) => {},
    price = "",
    setPrice = (event) => {},
    title = "",
    setTitle = (event) => {},
    totalPlayerCount = "",
    setTotalPlayerCount = (event) => {},
    startDate = "",
    setStartDate = (event) => {},
    endDate = "",
    setEndDate = (event) => {},
}) => {
    const {user} = useAppContext();
    const [image, setImage] = useState(imageEdit);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    const handleImage = async (e) => {
        setLoading(true);
        try {
            setImage(null);
            const file = e.target.files[0];
            // @ts-ignore
            setImage({url: URL.createObjectURL(file)});

            let formData = new FormData();
            formData.append("image", file);

            if (isEditPost) {
                setFormDataEdit(formData);
            } else {
                setFormData(formData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleButton = () => {
        if (isEditPost) {
            // Edit post
            handleEditPost();
        } else {
            // Create post
            createNewActivity(formData);
        }
        setTitle("");
        setDescription("");
        setAddress("");
        setCategory("");
        setPrice("");
        setTotalPlayerCount("");
        setStartDate("");
        setEndDate("");
        setOpenModal(false);
        setAttachment("");
        setFormData(null);
    };

    const uploadImage = () => {
        if (image) {
            return (
                <div className='w-full h-full relative group'>
                    <img
                        src={image}
                        alt='xasdws'
                        className='flex items-center justify-center w-full max-h-full object-contain '
                    />
                    <MdCancel
                        className='absolute top-1.5 right-1.5 text-[26px] text-[#8e8f91] hover:text-[#525151] dark:hover:text-[#c0bebe] transition-20 hidden group-hover:flex mb-1 z-[203] cursor-pointer '
                        onClick={() => {
                            setImage(null);
                            setImageEdit(null);
                            setFormData(null);
                            setFormDataEdit(null);
                        }}
                    />
                </div>
            );
        }
        if (loading) {
            return (
                <div className='flex items-center justify-center w-full h-full'>
                    <ReactLoading
                        type='spinningBubbles'
                        color='#6A7583'
                        height={50}
                        width={50}
                    />
                </div>
            );
        }
        return (
            <>
                <div className='w-full h-full rounded-md flex flex-col items-center justify-center dark:group-hover:bg-[#47494A] relative bg-[#EAEBED]/60 group-hover:bg-[#d9dadc]/60 dark:bg-inherit '>
                    <MdCancel
                        className='absolute top-1.5 right-1.5 text-[26px] text-[#8e8f91] hover:text-[#525151] dark:hover:text-[#c0bebe] transition-20 cursor-pointer mb-1 z-[203] '
                        onClick={() => {
                            setAttachment("");
                        }}
                    />
                    <div>
                        <MdAddPhotoAlternate className='w-10 h-10 rounded-full dark:bg-[#5A5C5C] p-1.5 text-black/60 bg-[#D8DADF] ' />
                    </div>
                    <div className='font-semibold text-[18px] leading-5 text-black/60 dark:text-white/60 '>
                        Add photos
                    </div>
                    <span className='text-[12px] text-[#949698] dark:text-[#b0b3b8] '>
                        or drag and drop
                    </span>
                </div>
                <input
                    type='file'
                    accept='image/*'
                    className='absolute w-full h-full top-0 left-0 z-[201] cursor-pointer opacity-0 '
                    onChange={(e) => handleImage(e)}
                />
            </>
        );
    };
    return (
        <div className='fixed flex items-center justify-center w-screen h-screen dark:bg-black/50 bg-white/50 z-[200] top-0 left-0 h-full'>
            <div
                className='z-[201] bg-none fixed w-full h-full top-0 right-0 '
                onClick={() => {
                    if (!isEditPost) {
                        setOpenModal(false);
                    }
                }}></div>
            <div className='mx-auto w-[90%] sm:w-[66%] md:w-[33%] bg-white dark:bg-[#242526] rounded-xl px-4 z-[202] box-shadow relative '>
                <MdCancel
                    className='absolute top-4 right-6 text-[30px] opacity-50 hover:opacity-100 cursor-pointer transition-50 '
                    onClick={() => {
                        setOpenModal(false);
                    }}
                />
                <div className='POST'>
                    <div className='font-extrabold py-4 text-xl text-center border-b-[1px] border-black/20 dark:border-white/20 '>
                        {isEditPost ? "Edit activity" : "Create Activity"}
                    </div>
                    <div className='flex gap-x-2 py-4 items-center'>
                        <img
                            src={`${user.avatar ? user.avatar : "images/profile.png"}`}
                            alt='userImage'
                            className='w-10 h-10 rounded-full object-cover '
                        />
                        <div>
                            <div className='text-[15px] font-semibold '>
                                {user?.username}
                            </div>
                            <button className='px-2 py-1 flex gap-x-0.5 items-center text-[12px] bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-lg mt-0.5 font-semibold scrollbar scrollbar-thumb-sky-200 scrollbar-track-gray-100 '>
                                <GiEarthAmerica className=' ' />
                                <span className=' '>Global</span>
                                <MdArrowDropDown className='text-base ' />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={title}
                        className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                            title?.length > 40 || attachment
                                ? "text-[11px] "
                                : "text-[17px]"
                        } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                        placeholder={`Title`}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        required
                    />
                    <textarea
                        value={description}
                        className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                            description?.length > 40 || attachment
                                ? "text-[11px] "
                                : "text-[17px]"
                        } ${attachment ? "h-[50px]" : "h-[60px]"} relative`}
                        placeholder={`Description`}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        required
                    />
                    <input
                        type={"number"}
                        max="1000"
                        value={totalPlayerCount}
                        className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                            totalPlayerCount?.length > 40 || attachment
                                ? "text-[11px] "
                                : "text-[17px]"
                        } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                        placeholder={`Total Player Count`}
                        onChange={(e) => {
                           e.target.value >= 2 ? setTotalPlayerCount(e.target.value) : setTotalPlayerCount(2);
                        }}

                    />
                    <div className={"flex"}>
                        <label className={`w-40 mt-3 ml-3 p-0 text-[#a0a0a1] ${attachment ? "text-[11px]" : "text-[17px]" }`}>Start Date</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] w-40 mt-2 ml-3 p-0 text-[#a0a0a1] ${attachment ? "text-[11px]" : "text-[17px]" }`}
                            placeholder={`Start Date`}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className={"flex"}>
                        <label className={`w-40 mt-5 mb-2 ml-3 p-0 text-[#a0a0a1] ${attachment ? "text-[11px]" : "text-[17px]" }`}>End Date</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] w-40 mt-2 ml-3 p-0 text-[#a0a0a1] ${attachment ? "text-[11px]" : "text-[17px]" }`}
                            placeholder={`End Date`}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                        />
                    </div>
                    <textarea
                        value={address.address_line1}
                        className={`input-modal style-3 mt-1 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                            address.address_line1?.length > 40 || attachment
                                ? "text-[11px] "
                                : "text-[17px]"
                        } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                        placeholder={`Address line 1`}
                        onChange={(e) => {
                            setAddress({...address, address_line1: e.target.value});
                        }}
                    />
                    <div className={"flex flex-row"}>
                        <textarea
                            value={address.city}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                                address.city?.length > 40 || attachment
                                    ? "text-[11px] "
                                    : "text-[17px]"
                            } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                            placeholder={`City`}
                            onChange={(e) => {
                                setAddress({...address, city: e.target.value});
                            }}
                        />
                        <textarea
                            value={address.country}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                                address.country?.length > 40 || attachment
                                    ? "text-[11px] "
                                    : "text-[17px]"
                            } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                            placeholder={`Country`}
                            onChange={(e) => {
                                setAddress({...address, country: e.target.value});
                            }}
                        />
                        <textarea
                            value={address.postal_code}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                                address.postal_code?.length > 40 || attachment
                                    ? "text-[11px] "
                                    : "text-[17px]"
                            } ${attachment ? "h-[40px]" : "h-[50px]"} relative`}
                            placeholder={`Postal Code`}
                            onChange={(e) => {
                                setAddress({...address, postal_code: e.target.value});
                            }}
                        />
                    </div>
                    <div className={"flex flex-row mt-3"}>
                        <input
                            type={"number"}
                            max="10000000"
                            value={price}
                            className={`input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] ${
                                price?.length > 40 || attachment
                                    ? "text-[11px] "
                                    : "text-[17px]"
                            } ${attachment ? "h-[30px]" : "h-[40px]"} relative`}
                            placeholder={`Price`}
                            onChange={(e) => {
                                e.target.value >= 0 ? setPrice(e.target.value) : setPrice(0);
                            }}
                        />
                        <select className={`w-40 w-full mb-2 border-0 outline-none mt-2 ml-3 p-0 text-[#a0a0a1] ${attachment ? "text-[11px]" : "text-[17px]"}`} value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Categories</option>
                            <option value={"Theatre"}>
                                {"Theatre"}
                            </option>
                            <option value={"Music"}>
                                {"Music"}
                            </option>
                            <option value={"Sport"}>
                                {"Sport"}
                            </option>
                        </select>
                    </div>
                    {attachment && (
                        <div className='relative flex w-full h-[200px] p-2 rounded-md border dark:border-white/20 group '>
                            {uploadImage()}
                        </div>
                    )}
                    {!attachment && (
                        <div className='flex items-center justify-between px-4 mt-3 border rounded-md dark:border-white/20 border-black/20 '>
                            <div className='text-[15px] font-semibold '>
                                Add to your activity
                            </div>
                            <div className='flex gap-x-4 items-center py-2  '>
                                <div
                                    className='w-[35px] h-[35px] rounded-full flex items-center justify-center dark:hover:bg-[#3A3B3C] px-1.5 cursor-pointer hover:bg-black/10 transition-20 '
                                    onClick={() => {
                                        setAttachment("photo");
                                    }}>
                                    <MdPhoto
                                        className={`relative text-[#45bd62] text-[26px] `}
                                    />
                                </div>
                                <div
                                    className='w-[35px] h-[35px]  rounded-full flex items-center justify-center dark:hover:bg-[#3A3B3C] px-1.5 cursor-pointer hover:bg-black/10 transition-20 '
                                    onClick={() => {
                                        toast("This function is updating...");
                                    }}>
                                    <FaVideo className='text-[#f3425f] text-[26px]' />
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        className={`w-full py-1.5 text-center rounded-[4px] font-semibold my-3 ${
                            title
                                ? "bg-[#3982E4] text-white "
                                : "dark:bg-[#505151] dark:text-white/70 bg-[#3982E4] text-white "
                        }`}
                        disabled={!title || loading}
                        onClick={handleButton}>
                        {isEditPost ? "Save" : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
