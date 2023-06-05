import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../context/useContext.jsx";
import {useEffect, useState} from "react";
import Left from "../profile/components/Details.component.jsx";
import Right from "../company/components/Advertisements.component.jsx";
import Header from "../company/components/Header.jsx";
import {LoadingProfile} from "../index.js";

const Company = () => {
    const navigate = useNavigate();
    const currentCompanyEmployer = window.location.pathname.replace("/company/", "");
    const {
        dark,
        autoFetch,
        setOneState,
        user: own,
        setNameAndToken,
        token,
    } = useAppContext();

    const [postLoading, setPostLoading] = useState(false);
    const [advertisements, setAdvertisements] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
    });

    useEffect(() => {
        getCurrentUsername(currentCompanyEmployer);
        getAdvertisementWithUsername(currentCompanyEmployer);
        setImages([]);
    }, [window.location.pathname]);

    const getCurrentUsername = async (username) => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(`/profiles/${username}/`);
            setUser(data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getAdvertisementWithUsername = async (username) => {
        setPostLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/advertisements/${username}/`
            );
            setAdvertisements(data);

        } catch (error) {
            console.log(error);
        }
        setPostLoading(false);
    };

    useEffect(() => {
        if (advertisements?.length) {
            setImages(
                advertisements?.filter((p) => {
                    if (p && p.image) {
                        return p.image;
                    }
                })
            );
        }
    }, [advertisements]);

    const getDeletePostId = (postId) => {
        const newPosts = advertisements.filter((v) => v?.id !== postId);
        setAdvertisements(newPosts);
    };

    console.log(advertisements)

    return (
        <div className='min-h-screen w-[99.5vw] overflow-x-hidden pb-7 '>
            {!loading ? (
                <Header
                    user={user}
                    own={own}
                    navigate={navigate}
                    autoFetch={autoFetch}
                    setNameAndToken={setNameAndToken}
                    token={token}
                />
            ) : (
                <LoadingProfile />
            )}
            <div className='mx-4 sm:mx-[5%] md:mx-[15%] px-1 sm:px-10 mt-4 '>
                <div className='w-full sm:grid grid-cols-5 gap-x-4 '>
                    <div className='col-span-2'>
                        <Left
                            user={user}
                            own={own}
                            images={images}
                            navigate={navigate}
                            autoFetch={autoFetch}
                            dark={dark}
                            profileLoading={loading}
                            postLoading={postLoading}
                        />
                    </div>
                    <div className='col-span-3 '>
                        <Right
                            autoFetch={autoFetch}
                            dark={dark}
                            own={own}
                            user={user}
                            setOneState={setOneState}
                            loading={postLoading}
                            advertisements={advertisements}
                            setAdvertisements={setAdvertisements}
                            getDeletePostId={getDeletePostId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company;