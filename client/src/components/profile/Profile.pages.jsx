import {useAppContext} from "../../context/useContext.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
//components
import Header from "./components/Header.Component.jsx";
import Left from "./components/Details.component.jsx";
import Right from "./components/Posts.component.jsx";
import {LoadingProfile} from "../";
import FollowerPage from "./components/Follower.component.jsx";
import FollowingPage from "./components/Following.component.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const currentUsername = window.location.pathname.replace("/profile/", "");
    const {
        dark,
        autoFetch,
        setOneState,
        user: own,
        setNameAndToken,
        token,
    } = useAppContext();
    const [postLoading, setPostLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        image: "",
        name: "",
        username: currentUsername,
        about: "",
        id: "",
        follower: [],
        following: [],
    });
    const [menu, setMenu] = useState("Posts");

    useEffect(() => {
        getCurrentUsername(currentUsername);
        getPostWithUsername(currentUsername);
        setMenu("Posts");
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

    const getPostWithUsername = async (username) => {
        setPostLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/activities/${username}/`
            );
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
        setPostLoading(false);
    };
    useEffect(() => {
        if (posts?.length) {
            setImages(
                posts?.filter((p) => {
                    if (p && p.image) {
                        return p.image;
                    }
                })
            );
        }
    }, [posts]);

    const getDeletePostId = (postId) => {
        const newPosts = posts.filter((v) => v?.id !== postId);
        setPosts(newPosts);
        console.log("delete post: ", postId);
    };

    const main = () => {
        if (menu === "Following") {
            return (
                <FollowingPage
                    dark={dark}
                    username={user?.username}
                    autoFetch={autoFetch}
                    own={own}
                    navigate={navigate}
                    setNameAndToken={setNameAndToken}
                    token={token}
                />
            );
        }
        if (menu === "Follower") {
            return (
                <FollowerPage
                    dark={dark}
                    username={user?.username}
                    autoFetch={autoFetch}
                    navigate={navigate}
                    own={own}
                    setNameAndToken={setNameAndToken}
                    token={token}
                />
            );
        }
        return (
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
                        posts={posts}
                        setPosts={setPosts}
                        getDeletePostId={getDeletePostId}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className='min-h-screen w-[99.5vw] overflow-x-hidden pb-7 '>
            {!loading ? (
                <Header
                    user={user}
                    own={own}
                    navigate={navigate}
                    setMenu={setMenu}
                    menu={menu}
                    autoFetch={autoFetch}
                    setNameAndToken={setNameAndToken}
                    token={token}
                />
            ) : (
                <LoadingProfile />
            )}

            <div className='mx-4 sm:mx-[5%] md:mx-[15%] px-1 sm:px-10 mt-4 '>
                {main()}
            </div>
        </div>
    );
};

export default Profile;
