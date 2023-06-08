import {useAppContext} from "../../context/useContext.jsx";
import {AiFillCamera} from "react-icons/ai";
import {useState} from "react";
import {toast} from "react-toastify";
import {TiTick} from "react-icons/ti";
import ReactLoading from "react-loading";

const UpdateProfile = () => {
    const {user, autoFetch, setName} = useAppContext();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [profileInfo, setProfileInfo] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        website_url: user.website_url,
        birth_date: user.birth_date,
        linkedin_url: user.linkedin_url,
        company_url: user.company_url,
        company_name: user.company_name,
        education_level: user.education_level,
        username: user.username,
        email: user.email,
        spotify_playlist: user.spotify_playlist,
    });

    const handleImage = async (e) => {
        try {
            setImage(null);
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));

            let formData = new FormData();
            formData.append("image", file);
            setFormData(formData);
        } catch (error) {
            console.log(error);
        }
    };

    const updateImage = async () => {
        try {
            const {data} = await autoFetch.post(
                `/api/post/upload-image`,
                formData
            );
            return {url: data.url, public_id: data.public_id};
        } catch (error) {
            toast.error("Upload image fail!");
            return null;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // let image;
            // if (formData) {
            //     image = await updateImage();
            //     if (!image) {
            //         setLoading(false);
            //         setImage(null);
            //         return;
            //     }
            // }
            const {data} = await autoFetch.patch(`/profiles/${user.username}/`, {
                ...profileInfo,
            });
            //setNameAndToken(data.user, data.token);
            localStorage.setItem("user", JSON.stringify(data));
            setName(data);
            toast.success("Update profile success!");
            //setState(initValueState);
        } catch (error) {
            if (error?.response?.data) {
                const errorMessages = [];
                Object.entries(error?.response?.data).forEach(([fieldName, fieldErrors]) => {
                    const fieldErrorMessages = fieldErrors.map(error => `${fieldName}: ${error}`);
                    errorMessages.push(...fieldErrorMessages);
                });
                errorMessages.forEach(errorMessage => {
                    toast.error(errorMessage);
                });
            }

        }
        setLoading(false);
    };

    const field = [
        {
            label: "First Name*",
            type: "text",
            placeholder: "First Name",
            name: "first_name",
            value: profileInfo.first_name || "",
            required: true
        },
        {
            label: "Last Name*",
            type: "text",
            placeholder: "Last Name",
            name: "last_name",
            value: profileInfo.last_name || "",
            required: true
        },
        {
            label: "Email*",
            type: "email",
            placeholder: "mail@mail.com",
            name: "email",
            value: profileInfo.email || "",
            required: true
        },
        {
            label: "Username*",
            type: "text",
            placeholder: "Username",
            name: "username",
            value: profileInfo.username || "",
            required: true
        },
        {
            label: "Education Level*",
            type: "select",
            placeholder: "Education Level",
            name: "education_level",
            value: profileInfo.education_level || "",
            options: [
                { value: "", label: "Education Level" },
                { value: "ES", label: "Elementary School" },
                { value: "MS", label: "Middle School" },
                { value: "HS", label: "High School" },
                { value: "AD", label: "Associate's Degree" },
                { value: "BD", label: "Bachelor's Degree" },
                { value: "MD", label: "Master's Degree" },
                { value: "PhD", label: "Doctorate or PhD" }
            ],
            required: true
        },
        {
            label: "Gender*",
            type: "select",
            placeholder: "Gender",
            name: "gender",
            value: profileInfo.gender || "",
            options: [
                { value: "", label: "Gender"},
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
            ],
            required: true
        },
        {
            label: "Linkedin URL",
            type: "url",
            placeholder: "Linkedin URL",
            name: "linkedin_url",
            value: profileInfo.linkedin_url || "",
        },
        {
            label: "Instagram URL",
            type: "url",
            placeholder: "Website URL",
            name: "website_url",
            value: profileInfo.website_url || "",
        },
        {
            label: "Spotify Playlist URL",
            type: "url",
            placeholder: "Spotify Playlist URL",
            name: "spotify_playlist",
            value: profileInfo.spotify_playlist || "",
        },
        {
            label: "Birth Date*",
            type: "date",
            placeholder: "Birth Date",
            name: "birth_date",
            value: profileInfo.birth_date || "",
            required: true
        },
        {
            label: "Company Name",
            type: "text",
            placeholder: "Company Name",
            name: "company_name",
            value: profileInfo.company_name || "",
        },
        {
            label: "Company URL",
            type: "url",
            placeholder: "Company URL",
            name: "company_url",
            value: profileInfo.company_url || "",
        },

        // {
        //     label: "Current password",
        //     type: "password",
        //     placeholder: "Type your current password",
        //     name: "currentPassword",
        //     value: state.currentPassword,
        // },
        // {
        //     label: "New password",
        //     type: "password",
        //     placeholder: "Type new password",
        //     name: "newPassword",
        //     value: state.newPassword,
        // },
        // {
        //     label: "Confirm new password",
        //     type: "password",
        //     placeholder: "Confirm new password",
        //     name: "confirmNewPassword",
        //     value: state.confirmNewPassword,
        // },
    ];

    const handleChange = (event) => {
        const {name,value} = event.target;
        setProfileInfo((prevState) => {
            return {
                ...prevState,
                [name] : value
            }
        })
    };

    return (
        <div className=' lg:h-screen h-auto pt-[70px] lg:grid lg:grid-cols-3 lg:px-[10%] px-[5%] overflow-x-hidden '>
            <div className='col-span-1 flex flex-col items-center justify-center pb-10 '>
                <label className='relative group w-40 h-40 cursor-pointer '>
                    <img
                        // @ts-ignore
                        src={image || (user?.avatar ? user?.avatar : "/images/profile.png")}
                        alt='avatar'
                        className='w-full h-full rounded-full object-cover '
                    />
                    <div className='hidden group-hover:flex flex-col items-center w-full h-full justify-center absolute z-10 dark:bg-black/50 bg-white/30 top-0 left-0 rounded-full transition-50 font-bold '>
                        <AiFillCamera className='text-4xl text-black/70 ' />
                    </div>
                    <input
                        onChange={handleImage}
                        type='file'
                        accept='image/*'
                        name='avatar'
                        hidden
                    />
                </label>
                <div className='mt-5 text-3xl font-bold text-center flex items-center gap-x-2 '>
                    {user.name}{" "}
                    {user.role === "ADMIN" && (
                        <TiTick className='text-[22px] text-white rounded-full bg-sky-500 ' />
                    )}
                </div>
                <span className='ml text-2xl font-normal mt-1 '>
                    ({user.username})
                </span>
            </div>
            <div className='col-span-2 my-[5%] lg:py-auto py-7 px-6 bg-gray-400/30 lg:rounded-3xl md:rounded-xl rounded-md'>
                <div className='w-full text-center lg:text-4xl md:text-3xl text-2xl font-bold lg:my-8 md:my-5 my-4 '>
                    Update profile
                </div>
                <form
                    className='md:grid grid-cols-2 md:gap-y-12 gap-x-10 flex flex-col gap-y-5 '
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    {field.map((v, k) => (
                        <div key={k + "field-update"} className=''>
                            <div
                                className={`text-sm md:text-[17px] font-bold ml-3 mb-2 ${
                                    v.disabled ? "opacity-70" : ""
                                } `}
                            >
                                {v.label}
                            </div>
                            {v.type === "select" ? (
                                <select
                                    className={`input-login ${
                                        v.disabled ? "opacity-70" : ""
                                    } w-full `}
                                    name={v.name}
                                    value={v.value}
                                    onChange={(event) => handleChange(event)}
                                    disabled={v.disabled || loading}
                                    required={v.required}
                                >
                                    {v.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={v.type}
                                    className={`input-login ${
                                        v.disabled ? "opacity-70" : ""
                                    } w-full `}
                                    placeholder={v.placeholder}
                                    name={v.name}
                                    value={v.value}
                                    onChange={(event) => handleChange(event)}
                                    disabled={v.disabled || loading}
                                    required={v.required}
                                />
                            )}
                        </div>
                    ))}
                    <div className='col-span-2 flex justify-center items-center  '>
                        <button className='w-32 h-10 flex items-center justify-center transition-50 font-bold text-xl rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white opacity-75 hover:opacity-100 '>
                            {loading ? (
                                <ReactLoading
                                    type='bubbles'
                                    width={40}
                                    height={40}
                                    color='white'
                                />
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
