import {useNavigate} from "react-router-dom";
import {Nav} from "../components";
import {useAppContext} from "../context/useContext.jsx";

const Home = () => {
    const navigate = useNavigate();
    const {dark} = useAppContext();

    return (
        <div>
            <Nav />
            <div className='w-screen h-screen '>
                {dark && (
                    <div
                        style={{backgroundImage: `url('/images/bg.png')`}}
                        className='fixed w-full h-full bottom-0 left-0 opacity-70 wave object-contain'
                    />
                )}
                <img
                    width={dark ? 500 : 1100}
                    src='images/img-home.png'
                    alt='rocket'
                    className={`absolute right-0 top-0 h-full object-contain wave`}
                />
                <div className='top-[13vh] md:top-[15vh] left-10 text-[20px] sm:text-[30px] md:text-[40px] font-semibold z-10 absolute text-[#210028] dark:text-sky-300 raleway '>
                    Do you want to find your social buddy?
                    <div className='text-[15px] sm:text-[25px] md:text-[30px] text-pink-600 font-light raleway-light '>
                        where start everything!
                    </div>
                </div>
                <div className='absolute bottom-16 left-10 md:w-[30%] pr-5 md:pr-0'>
                    <div className='font-bold text-xl sm:text-2xl md:text-3xl md:my-3 '>
                        Social Buddy
                    </div>
                    <div className='text-[13px] sm:text-base md:text-[18px] '>
                        You are no longer alone and you will never walk alone. Find your social buddy here!
                    </div>
                    <div className='flex gap-x-3 items-center justify-start mt-6 sm:mt-8 md:mt-10 '>
                        <button
                            className='btn-home boxed'
                            onClick={() => {
                                navigate("/login");
                            }}>
                            Login
                        </button>
                        <button
                            className='btn-home boxed'
                            onClick={() => {
                                navigate("/register");
                            }}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
