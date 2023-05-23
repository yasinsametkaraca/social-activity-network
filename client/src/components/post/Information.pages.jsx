import {useEffect, useState} from "react";
import moment from "moment";
import {AiOutlineHeart, AiFillHeart, AiOutlineSend, AiOutlineCamera} from "react-icons/ai";
import ReactLoading from "react-loading";
import {FiMessageSquare} from "react-icons/fi";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
// context
import {useAppContext} from "../../context/useContext.jsx";
//components
import {Comment} from "../";
import {LoadingPostInformation} from "../";
import {LoadingPost} from "../";
import {Post} from "../";
import {MdCancel} from "react-icons/md";
import Participant from "../common/Participant.jsx";
import {SlPeople} from "react-icons/sl";

const Information = () => {
    const navigate = useNavigate();
    const currentActivityId = window.location.pathname.replace(
        "/activity/detail/",
        ""
    );
    const {autoFetch, user, dark} = useAppContext();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState();
    const [likeLoading, setLikeLoading] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [textComment, setTextComment] = useState("");
    const [imageComment, setImageComment] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isPrivate, setIsPrivate] = useState(true);
    const [showParticipants, setShowParticipants] = useState(false);



    useEffect(() => {
        getCurrentPost(currentActivityId);
    }, []);

    const getParticipants = async (activityId) => {
        setShowComment(false)
        if(!showParticipants){
            try {
                const {data} = await autoFetch.get(`/activities/${activityId}/user/`);
                setPost((prevPost) => ({
                    ...prevPost,
                    activity_user: data,
                }));
                setShowParticipants(!showParticipants);
            } catch (error) {
                console.log(error);
            }
        }
        setShowParticipants(!showParticipants);
        setCommentLoading(false);
    }

    const getComment = async (activityId) => {
        setShowParticipants(false)
        setShowComment(!showComment);
        let is_public = true;
        post.activity_user.map((participant_user) => {
            if(participant_user.username === user.username) {
                is_public = false;
            }
        })
        try {
            const {data} = await autoFetch.get(`/comments/?activity=${activityId}&is_public=${is_public}`);
            setPost({...post, comments: data});
            setTextComment("");
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
    }

    const likeAndUnlike = async (activityId) => {
        setLikeLoading(true);
        try {
            const {data} = await autoFetch.post(`/activities/${activityId}/addfavourite/`);
            setPost({...post, add_favourite: data.data.add_favourite});
        } catch (error) {
            console.log(error);
        }
        setLikeLoading(false);
    };

    const getCurrentPost = async (currentActivityId) => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/activities/${currentActivityId}/`
            );
            setLoading(false);
            setPost(data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const deleteComment = async (commentId) => {
        try {
            const {data} = await autoFetch.delete(`/comments/${commentId}/`);
            setPost((prevPost) => ({
                ...prevPost,
                comments: prevPost.comments.filter((comment) => comment.id !== commentId),
            }));
            toast("You have deleted comment! ");
        } catch (error) {
            toast("You have not deleted comment! ");
        }
    };

    const addComment = async (activityId) => {
        if (!textComment) {
            return;
        }
        setCommentLoading(true);
        try {
            // let image;
            // if (imageComment) {
            //     image = await handleUpImageComment();
            //     if (!image) {
            //         setCommentLoading(false);
            //         setImageComment(null);
            //         return;
            //     }
            // }
            const {data} = await autoFetch.post("/comments/", {
                activity: activityId,
                is_public: !isPrivate,
                comment: textComment,
            });
            setPost((prevPost) => ({
                ...prevPost,
                comments: [...prevPost.comments, data],
            }));
            setShowComment(true);
            setTextComment("");
        } catch (error) {
            if (error.response.status === 403) {
                toast.error("You can not make private comments without participating in this activity.");
            }
        }
        setCommentLoading(false);
    };

    if (loading) {
        return (
            <>
                <div className='hidden md:flex fixed w-screen h-screen  z-1000 dark:bg-black  dark:text-white pt-[65px] px-[15%] '>
                    <LoadingPostInformation />
                </div>
                <div className='md:hidden pt-[65px] h-screen '>
                    <LoadingPost />
                </div>
            </>
        );
    }
    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';

        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

        return dateTime.toLocaleString('en-US', options);
    };

    const commentCount = post?.comment_count;
    const likeCount = post?.add_favourite?.length;

    const handleImage = (e) => {
        setImageComment(null);
        const file = e.target.files[0];
        setImageComment({url: URL.createObjectURL(file)});

        let formData = new FormData();
        formData.append("image", file);

        setFormData(formData);
    };

    // upload image to cloudinary
    const handleUpImageComment = async () => {
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

    const deleteImageComment = () => {
        setImageComment(null);
    };

    return (
        <>
            <div className={`md:flex sm:w-screen sm:h-screen bg-[#F0F2F5] dark:bg-black dark:text-white pt-[65px] px-[5%] rounded-lg`}>
                <div className={`w-full h-[90%] mt-[3%] grid grid-cols-5 relative ${!dark & post?.image ? "shadow-post" : ""}`}>
                    <div className={`${post?.image ? "md:col-span-3" : "md:col-span-20 md:ml-[300px] md:mr-[300px]"} col-span-10 dark:bg-[#242526] p-4 h-full bg-white rounded`}>
                        <div className='flex items-center justify-between '>
                            <div
                                className='flex items-center gap-x-1 '
                                onClick={() => {
                                    navigate(`/profile/${post?.userId}`);
                                }}>
                                <img
                                    src={`${post?.avatar ? "/api/v1/" +post?.avatar : "/images/profile.png"}`}
                                    alt='avatar'
                                    className='w-12 h-12 rounded-full'
                                />
                                <div className=''>
                                    <div className='font-bold text-[20px]'>
                                        {post?.owner}
                                    </div>
                                    <div className='text-[16px] '>
                                        {post?.category}
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-[16px] opacity-70 '>
                                    {moment(post?.created_at).fromNow()}
                                </div>
                            </div>
                        </div>
                        <div className={`content my-5 ${post?.image || post?.title.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Title</label>
                            <div dangerouslySetInnerHTML={{ __html: post?.title }}></div>
                        </div>
                        <div className={`content my-3 ${post?.image || post?.description.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                            <label className="font-bold">Description</label>
                            <div dangerouslySetInnerHTML={{ __html: post?.description }}></div>
                        </div>
                        <div className="grid grid-cols-3 gap-9 max-sm:grid-cols-2">
                            <div className={`content my-3 ${post?.image || post?.start_date.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                                <label className="font-bold">Start Date</label>
                                <div>{formatDate(post?.start_date)}</div>
                            </div>
                            <div className={"max-sm:hidden"}></div>
                            <div className={`content my-3 ${post?.image || post?.end_date.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                                <label className="font-bold">End Date</label>
                                <div>{formatDate(post?.end_date)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-9 max-sm:grid-cols-2">
                            <div className={`content my-3 ${post?.image || post?.total_player_count.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                                <label className="font-bold">Total Player</label>
                                <div dangerouslySetInnerHTML={{ __html: post?.total_player_count }}></div>
                            </div>
                            <div className={"max-sm:hidden"}></div>
                            <div className={`content my-3 ${post?.image || post?.missing_player_count.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                                <label className="font-bold">Missing Player</label>
                                <div dangerouslySetInnerHTML={{ __html: post?.missing_player_count }}></div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className={`content my-3 ${post?.image || post?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                                <label className="font-bold">Address</label>
                                <div dangerouslySetInnerHTML={{ __html: `${post?.address?.address_line1} ${post?.address?.address_line2 ? post?.address?.address_line2 : ''} ${post?.address?.city} ${post?.address?.country} ${post?.address?.postal_code}` }}></div>
                            </div>
                        </div>
                        <div className={`md:hidden content my-3 ${post?.image || post?.address?.address_line1.length > 60 ? 'text-[15px]' : 'text-[17px]'}`}>
                            {post?.image && (
                                <img
                                    src={post.image}
                                    alt=''
                                    className='object-cover'></img>
                            )}
                        </div>
                        {(commentCount > 0 || likeCount > 0) && (
                            <div className=' py-[10px] flex gap-x-[6px] items-center text-[15px] '>
                                {likeCount > 0 && (
                                    <>
                                        {!post?.add_favourite?.includes(user.username) ? (
                                            <>
                                                <AiOutlineHeart className='text-[18px] text-[#65676b] dark:text-[#afb0b1]' />
                                                <span className='like-count'>
                                                    {`${likeCount} favourite${
                                                        likeCount > 1 ? "s" : ""
                                                    }`}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <AiFillHeart className='text-[18px] text-[#c22727] dark:text-[#c22727]' />
                                                <span className='like-count'>
                                                    {likeCount > 1
                                                        ? `You and ${
                                                              likeCount - 1
                                                          } other${
                                                              likeCount > 2
                                                                  ? "s"
                                                                  : ""
                                                          }`
                                                        : `You`}
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                                <span className='text-[14px] ml-auto text-[#65676b] dark:text-[#afb0b1] '>
                                    {commentCount > 0 &&
                                        `${commentCount} ${
                                            commentCount > 1
                                                ? "comments"
                                                : "comment"
                                        }`}
                                </span>
                            </div>
                        )}
                        <div className=' mt-2 py-1 flex items-center justify-between border-y dark:border-y-[#3E4042] border-y-[#CED0D4] px-[6px]'>
                            {post?.add_favourite?.includes(user.username) ? (
                                <button
                                    className=' py-[6px] flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#c22727] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#c22727] transition-50 cursor-pointer  '
                                    onClick={() => likeAndUnlike(post.id)}
                                    disabled={likeLoading}>
                                    {likeLoading ? (
                                        <ReactLoading
                                            type='bubbles'
                                            width='14%'
                                            height='14%'
                                            color='#c22727'
                                        />
                                    ) : (
                                        <>
                                            <AiFillHeart className='text-xl translate-y-[1px] text-[#c22727] ' />
                                            Favourite
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    className=' py-[6px] flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer '
                                    onClick={() => likeAndUnlike(post.id)}
                                    disabled={likeLoading}>
                                    {likeLoading ? (
                                        <ReactLoading
                                            type='bubbles'
                                            width='14%'
                                            height='14%'
                                            color='#6A7583'
                                        />
                                    ) : (
                                        <>
                                            <AiOutlineHeart className='text-xl translate-y-[1px] ' />
                                            Favourite
                                        </>
                                    )}
                                </button>
                            )}

                            <button
                                className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer '
                                onClick={() => getComment(post.id)}
                                disabled={!commentCount}>
                                <FiMessageSquare className='text-xl translate-y-[2px] ' />
                                Comment
                            </button>
                            <button
                                className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer '
                                onClick={() => getParticipants(post.id)}
                                disabled={!post?.activity_user?.length}
                            >
                                <SlPeople className='text-xl translate-y-[2px]' />
                                Participants
                            </button>
                        </div>
                        {((showComment) && (commentCount > 0)) && (
                            <div className='px-4 py-3 style-3 max-h-[38vh] overflow-y-scroll '>
                                {post?.comments?.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        currentComment={comment}
                                        userId={user?.id}
                                        deleteComment={deleteComment}
                                        autoFetch={autoFetch}
                                        navigate={navigate}
                                        postId={post?.id}
                                        user_img={user.image}
                                    />
                                ))}
                            </div>
                        )}
                        {showParticipants && (
                            <div className='px-4 pt-1'>
                                {Object.entries(post?.activity_user?.reduce((groups, participant) => {
                                    const groupKey = participant.participate_status.trim();
                                    if (!groups[groupKey]) {
                                        groups[groupKey] = [];
                                    }
                                    groups[groupKey].push(participant);
                                    return groups;
                                }, {})).map(([status, participants]) => (
                                    <div key={status}>
                                        <h2 className="text-[16px] pt-2 pb-[3px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer ">{status} Participants</h2>
                                        <ul>
                                            {participants.map((participant) => (
                                                <Participant
                                                    key={participant.username}
                                                    currentParticipant={participant}
                                                    userId={post.userId}  // aktiviteyi oluşturanın user_idsi
                                                    deleteComment={deleteComment}
                                                    autoFetch={autoFetch}
                                                    activityId={post.id}
                                                    post={post}
                                                    navigate={navigate}
                                                    user_img={post.avatar}  // aktiviteyi oluşturanın user_imgi
                                                    participate_status={participant.participate_status}
                                                    avatar={participant.avatar}
                                                    description={participant.description}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='flex gap-x-1.5 py-1'>
                            <img
                                src={`${user.avatar ? user.avatar : "/images/profile.png"}`}
                                alt='user_avatar'
                                className='w-[40px] h-[40px] object-cover shrink-0 rounded-full max-sm:w-[25px] max-sm:h-[25px] max-sm:mt-[8px]'
                            />
                            <form
                                className='flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]  '
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    addComment(post.id);
                                }}>
                                <input
                                    type='text'
                                    className='px-2 py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8] max-sm:text-sm '
                                    placeholder='Write a comment...'
                                    value={textComment}
                                    disabled={commentLoading}
                                    onChange={(e) => {
                                        setTextComment(e.target.value);
                                    }}
                                />
                                <div className="flex items-center flex-row mr-1">
                                    <label htmlFor="inline-2-checkbox" className="ml-0 text-sm font-medium text-gray-900 hover:opacity-100 dark:text-gray-300 mr-1 text-[#707173]">Private</label>
                                    <input id="inline-2-checkbox" type="checkbox" value="" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                </div>
                                {!commentLoading && (
                                    <label>
                                        <AiOutlineCamera className='shrink-0 text-[18px] transition-50 mr-2 opacity-60 hover:opacity-100 dark:text-[#b0b3b8] cursor-pointer ' />
                                        <input
                                            onChange={handleImage}
                                            type='file'
                                            accept='image/*'
                                            name='avatar'
                                            hidden
                                        />
                                    </label>
                                )}
                                <button
                                    type='submit'
                                    disabled={commentLoading || !textComment}>
                                    {commentLoading ? (
                                        <ReactLoading
                                            type='bubbles'
                                            width={20}
                                            height={20}
                                            color='#7d838c'
                                        />
                                    ) : (
                                        <AiOutlineSend className='shrink-0 text-xl transition-50 hover:scale-125 dark:text-[#b0b3b8] ' />
                                    )}
                                </button>
                            </form>
                        </div>
                        {/* image when comment have image */}
                        <div className='transition-50 flex items-start justify-start w-full px-20 group '>
                            {imageComment && (
                                <div className='relative '>
                                    <img
                                        // @ts-ignore
                                        src={imageComment.url}
                                        alt='image_comment'
                                        className='h-20 w-auto object-contain '
                                    />
                                    {!commentLoading && (
                                        <MdCancel
                                            className='absolute hidden group-hover:flex top-1 right-1 text-xl transition-50 cursor-pointer '
                                            onClick={deleteImageComment}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {post?.image &&
                        <div className='md:col-span-2 col-span-5 bg-white max-sm:hidden dark:bg-[#242526] relative flex items-center justify-center h-full'>
                            <div className='absolute h-[95%] w-[95%] flex items-center md:bg-[#F0F2F5] dark:bg-black  justify-center'>
                                {post?.image && (
                                    <img
                                        src={post.image}
                                        alt=''
                                        className='object-cover w-auto h-auto max-h-full'></img>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='md:hidden pt-[65px] px-1 min-h-screen'>
                <Post
                    currentPost={post}
                    userId={user._id}
                    userRole={user.role}
                    user_img={user.image}
                />
            </div>
        </>
    );
};

export default Information;
