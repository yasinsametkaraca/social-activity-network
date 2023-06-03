import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {Nav} from "../components";
import {useAppContext} from "../context/useContext.jsx";
import {Navigate, NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {GrValidate} from "react-icons/gr";

const Register = () => {
    const navigate = useNavigate();
    const [eye, setEye] = useState(false);
    const [reEye, setReEye] = useState(false);
    const {dark, user, autoFetch, setNameAndToken} = useAppContext();

    const [loading, setLoading] = useState(false);
    const initState = {
        name: "",
        email: "",
        username: "",
        password: "",
        rePassword: "",
        first_name: "",
        last_name: "",
        secret_question: 1,
        secret_answer: "",
        role:"FRIEND",
    };
    const [state, setState] = useState(initState);

    const handleChangeInput = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const register = async () => {
        setLoading(true);
        try {
            const {name, password, rePassword,first_name,last_name,  secret_question,secret_answer, role, username} = state;
            if (name.includes("admin")) {
                toast.error(`Name cannot include "admin"`);
                setLoading(false);
                return;
            }
            if (password !== rePassword) {
                toast.error("Password and re-password not match!");
                setLoading(false);
                return;
            }
            const email = state.email.toLowerCase();
            const {data} = await autoFetch.post("/accounts/register", {
                name,
                email,
                username,
                password,
                first_name,
                last_name,
                secret_question,
                secret_answer,
                role: "FRIEND"
            });
            setNameAndToken(data.user, data.token);
            toast.success("Register success!");
            setState(initState);
            setLoading(false);
            // setTimeout(() => {
            //     navigate("/login");
            // }, 3000);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Please Fill In The Required Fields!");
        }
    };

    if (user) {
        return <Navigate to='/' />;
    }
    console.log(state.secret_question)
    return (
        <div>
            <Nav />
            <div
                className={`bg-[#5c7bd1] dark:bg-[#4E4F50] h-screen w-screen flex items-center relative transition-50 overflow-hidden md:grid-cols-3 `}
                style={{
                    backgroundImage: !dark ? "none" : "url(/images/bg.png)",
                }}>
                {/* image background */}
                <div className='hidden md:flex h-full items-center justify-center relative md:col-span-1 '>
                    <img
                        src='/images/cloud.png'
                        alt='cloud'
                        className='absolute bottom-0 left-0 opacity-70 w-full h-full '
                    />
                    <img
                        src='/images/heart.png'
                        alt='cloud'
                        className='absolute left-[10%] top-[20%] opacity-70 cursor-pointer rotate-90 '
                    />
                    <img
                        src='/images/heart.png'
                        alt='cloud'
                        className='absolute left-[30%] bottom-[5%] opacity-70 cursor-pointer rotate-[36 deg] '
                    />
                    <img
                        src='/images/heart.png'
                        alt='cloud'
                        className='absolute left-[10%] opacity-70 cursor-pointer '
                    />
                    <img
                        src='/images/heart.png'
                        alt='cloud'
                        className='absolute top-[10%] left-[20%] opacity-70 cursor-pointer '
                    />

                    <img
                        src={`/images/ship-space.png`}
                        alt='chicken'
                        className='w-[70%] h-auto object-contain z-10'
                    />
                </div>
                {/* form */}
                <div className='flex md:col-span-2 w-full items-center justify-center z-10'>
                    <div className='bg-[#ffffff]/80 mx-[5%] md:mx-0 w-full mt-9 dark:bg-[#3a3a3a]/80 dark:text-white/70 md:w-auto px-[20px] md:px-[80px] py-[15px] sm:py-[30px] md:py-[40px] rounded-3xl transition-50 '>
                        <div className=' mb-[18px] text-xl sm:text-2xl md:text-[30px] text-[#5b38bc] dark:text-[#9b7cee] font-extrabold '>
                            Register
                        </div>
                        <form
                            className='mt-[13px] sm:mt-[15px] md:mt-[20px] font-bold '
                            onSubmit={(e) => {
                                e.preventDefault();
                                register();
                            }}>
                            {/* name and email */}
                            <div className='grid grid-cols-2 gap-x-2 md:gap-x-3 '>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        First Name*
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='text'
                                        className='input-register '
                                        placeholder='Jack'
                                        name='first_name'
                                        onChange={(e) => handleChangeInput(e)}
                                        required
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Last Name*
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='text'
                                        className='input-register '
                                        placeholder='Frost'
                                        name='last_name'
                                        onChange={(e) => handleChangeInput(e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-x-2 md:gap-x-3 mt-4'>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Email
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='email'
                                        className=' input-register'
                                        placeholder='user@gmail.com'
                                        name='email'
                                        onChange={(e) => handleChangeInput(e)}
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Username*
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='text'
                                        className=' input-register'
                                        placeholder='jackfrost'
                                        name='username'
                                        onChange={(e) => handleChangeInput(e)}
                                        required={true}
                                    />
                                </div>
                            </div>
                            {/* password and confirm password */}
                            <div className='mt-4 md:mt-[25px] grid grid-cols-2 gap-x-2 md:gap-x-3'>
                                {/* Password */}
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Password*
                                    </div>
                                    <div className='flex items-center relative'>
                                        <input
                                            disabled={loading}
                                            type={eye ? "text" : "password"}
                                            className=' input-register '
                                            placeholder='Password'
                                            name='password'
                                            onChange={(e) =>
                                                handleChangeInput(e)
                                            }
                                            required
                                        />
                                        {eye ? (
                                            <AiOutlineEye
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setEye(!eye)}
                                            />
                                        ) : (
                                            <AiOutlineEyeInvisible
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setEye(!eye)}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Confirm password */}
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Confirm password*
                                    </div>
                                    <div className='flex items-center relative'>
                                        <input
                                            disabled={loading}
                                            type={reEye ? "text" : "password"}
                                            className=' input-register '
                                            placeholder='Password'
                                            name='rePassword'
                                            onChange={(e) =>
                                                handleChangeInput(e)
                                            }
                                            required={true}
                                        />
                                        {reEye ? (
                                            <AiOutlineEye
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setReEye(!reEye)}
                                            />
                                        ) : (
                                            <AiOutlineEyeInvisible
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setReEye(!reEye)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Question and answer */}
                            <div className='mt-4 md:mt-[25px] sm:grid grid-cols-2 gap-x-2 md:gap-x-3'>
                                {/* Question */}
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Question*{" "}
                                        <span className='font-normal text-[14.5px] '>
                                            (use when reset password)
                                        </span>
                                    </div>
                                    <select
                                        name='secret_question'
                                        onChange={(e) => handleChangeInput(e)}
                                        className='appearance-none
                                                md:h-[50px]
                                                w-full
                                                px-[20px]
                                                py-[8px]
                                                text-sm
                                                font-bold
                                                border
                                                rounded
                                                focus:text-gray-700 focus:bg-white focus:border-[#472899] focus:outline-none
                                                dark:bg-[#242526]
                                                dark:focus:border-white/40
                                                dark:text-white/70
                                                '
                                        aria-label='Default select example'>
                                        <option value={1}>
                                            What is your favorite color?
                                        </option>
                                        <option value={2}>
                                            What is your favorite animal?
                                        </option>
                                        <option value={3}>
                                            What is your favorite food?
                                        </option>
                                    </select>
                                </div>
                                {/* Answer */}
                                <div className='col-span-1 mt-4 sm:mt-5 md:mt-0'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Answer*
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='text'
                                        className=' input-register '
                                        placeholder='Something...'
                                        name='secret_answer'
                                        onChange={(e) => handleChangeInput(e)}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className='mt-[12px] md:mt-[17px] text-[13px] font-normal flex justify-between items-center '>
                                <NavLink to='/forget-password'>
                                    Forget password?
                                </NavLink>
                            </div>
                            <button
                                className={`mt-[30px] md:mt-[35px] w-full font-extrabold text-[20px] md:text-2xl bg-[#46289A]/80 hover:bg-[#46289A] border text-white py-[8px] md:py-[13px] rounded-[5px] transition-50 ${
                                    loading ? "loading" : ""
                                } `}
                                type='submit'
                                disabled={loading}>
                                {loading ? "Loading..." : "Register"}
                            </button>
                        </form>

                        <div className='mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center '>
                            <span className='block md:inline '>
                                If you have an account,{" "}
                            </span>
                            <NavLink
                                to='/login'
                                className='font-bold text-[17px]  '>
                                let's login
                            </NavLink>
                        </div>
                    </div>
                </div>
                {!dark && (
                    <>
                        <div className='fixed bottom-0 right-0'>
                            <img
                                src={`/images/dark-cloud-2.png`}
                                alt='cloud-2'
                                className='object-contain translate-y-2'
                            />
                        </div>
                        <div className='fixed top-0 right-0'>
                            <img
                                src={`/images/dark-cloud-3.png`}
                                alt='cloud-2'
                                className='object-contain translate-y-2'
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
