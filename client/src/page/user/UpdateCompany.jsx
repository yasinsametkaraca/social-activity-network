import {useAppContext} from "../../context/useContext.jsx";
import {AiFillCamera} from "react-icons/ai";
import {useState} from "react";
import {toast} from "react-toastify";
import {TiTick} from "react-icons/ti";
import ReactLoading from "react-loading";

const UpdateCompany = () => {
    const {user, autoFetch, setName} = useAppContext();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(user?.company || {});

    const handleCompanyLogo = async (e) => {
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

    const handleSubmitCompany = async () => {
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
            const {data} = await autoFetch.put(`/companies/`, {
                name: companyInfo.name,
                description: companyInfo.description,
                company_url: companyInfo.company_url,
                company_mail: companyInfo.company_mail,
                company_phone: companyInfo.company_phone,
            });
            const userData = localStorage.getItem('user')
            const parsedUserData = JSON.parse(userData)
            parsedUserData.company = data
            localStorage.setItem("user", JSON.stringify(parsedUserData));
            setName(parsedUserData);
            toast.success("Update company success!");
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
            label: "Name*",
            type: "text",
            placeholder: "Name",
            name: "name",
            value: companyInfo.name || "",
            required: true
        },
        {
            label: "Description",
            type: "text",
            placeholder: "Description",
            name: "description",
            value: companyInfo.description || "",
        },
        {
            label: "Email*",
            type: "email",
            placeholder: "mail@mail.com",
            name: "company_mail",
            value: companyInfo.company_mail || "",
            required: true
        },
        {
            label: "URL",
            type: "text",
            placeholder: "URL",
            name: "company_url",
            value: companyInfo.company_url || "",
        },
        {
            label: "Phone*",
            type: "number",
            placeholder: "Phone",
            name: "company_phone",
            value: companyInfo.company_phone || "",
            required: true
        }
    ];

    const handleChange = (event) => {
        const {name,value} = event.target;
        setCompanyInfo((prevState) => {
            return {
                ...prevState,
                [name] : value
            }
        })
    };

    return (
        <div className=' lg:h-screen h-auto pt-[70px] lg:grid lg:grid-cols-3 lg:px-[10%] px-[5%] overflow-x-hidden'>
            <div className='col-span-1 flex flex-col items-center justify-center pb-10 '>
                <label className='relative group w-40 h-40 cursor-pointer'>
                    <img
                        src={image || (user?.company?.company_logo || "/images/company.png")}
                        alt='avatar'
                        className='w-full h-full rounded-full object-cover '
                    />
                    <div className='hidden group-hover:flex flex-col items-center w-full h-full justify-center absolute z-10 dark:bg-black/50 bg-white/30 top-0 left-0 rounded-full transition-50 font-bold '>
                        <AiFillCamera className='text-4xl text-black/70 ' />
                    </div>
                    <input
                        onChange={handleCompanyLogo}
                        type='file'
                        accept='image/*'
                        name='avatar'
                        hidden
                    />
                </label>
                <div className='mt-5 text-3xl font-bold text-center flex items-center gap-x-2 '>
                    {user.company.name}{" "}
                    {user?.role === "ADMIN" && (
                        <TiTick className='text-[22px] text-white rounded-full bg-sky-500 ' />
                    )}
                </div>
                <span className='ml text-2xl font-normal mt-1 '>
                    {user.username}
                </span>
            </div>
            <div className='col-span-2 my-[5%] lg:py-auto py-7 px-6 bg-gray-400/30 lg:rounded-3xl md:rounded-xl rounded-md'>
                <div className='w-full text-center lg:text-4xl md:text-3xl text-2xl font-bold lg:my-8 md:my-5 my-4 '>
                    Update Company
                </div>
                <form
                    className='md:grid grid-cols-2 md:gap-y-12 gap-x-10 flex flex-col gap-y-5 '
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitCompany();
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

export default UpdateCompany;
