import {useEffect, useState} from "react";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import ReactLoading from "react-loading";
import {toast} from "react-toastify";
// icon
import {AiOutlineHeart, AiFillHeart, AiOutlineSend, AiOutlineCamera,} from "react-icons/ai";
import {FiMessageSquare} from "react-icons/fi";
import {TiTick} from "react-icons/ti";
import {MdCancel} from "react-icons/md";
import {SlPeople} from "react-icons/sl";
// component
import Comment from "./Comment.jsx";
import {useAppContext} from "../../context/useContext.jsx";
import Modal from "./Modal.jsx";
import PostLoading from "../loading/Loading.Post.jsx";
import Participant from "./Participant.jsx";


const Post = ({
    currentActivity,
    user_img,
    userId,
    className = "",
    userRole,
    getDeletePostId = (postId) => {},
}) => {
    const navigate = useNavigate();
    const {autoFetch, setOneState, user} = useAppContext();
    const [showOption, setShowOption] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [post, setPost] = useState(currentActivity);
    const [textComment, setTextComment] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [imageComment, setImageComment] = useState(null);
    const [formData, setFormData] = useState(null);
    // open model for edit post
    const [openModal, setOpenModal] = useState(false);
    //edit post
    const [titleEdit, setTitleEdit] = useState(currentActivity?.title);
    const [attachment, setAttachment] = useState(
        currentActivity?.image ? "photo" : ""
    );
    const [imageEdit, setImageEdit] = useState(currentActivity?.image);
    const [descriptionEdit, setDescriptionEdit] = useState(currentActivity?.description);
    const [totalPlayerCountEdit, setTotalPlayerCountEdit] = useState(currentActivity?.total_player_count);
    const [startDateEdit, setStartDateEdit] = useState(currentActivity?.start_date);
    const [endDateEdit, setEndDateEdit] = useState(currentActivity?.end_date);
    const [addressEdit, setAddressEdit] = useState(currentActivity?.address);
    const [categoryEdit, setCategoryEdit] = useState(currentActivity?.category);
    const [priceEdit, setPriceEdit] = useState(currentActivity?.activity_price);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);

    // open modal
    useEffect(() => {
        setOneState("openModal", openModal);
    }, [openModal]);


    let likeCount = post?.add_favourite?.length;
    let commentCount = post?.comment_count;
    // set image to show in form
    const handleImage = (e) => {
        setImageComment(null);
        const file = e.target.files[0];
        setImageComment({url: URL.createObjectURL(file)});

        let formData = new FormData();
        formData.append("image", file);
        formData.append("activity_id", post.id)
        setFormData(formData);
    };

    // delete image in form
    const deleteImageComment = () => {
        setImageComment(null);
    };

    // upload image to cloudinary
    const handleUpImageComment = async () => {
        try {
            const {data} = await autoFetch.post(
                `/comments/upload-image/`,
                formData
            );
            return data.image;
        } catch (error) {
            toast.error("Upload image fail!");
            return null;
        }
    };
    const getComment = async (activityId) => {
        setShowComment(!showComment);
        setShowParticipants(false);
        try {
            const {data} = await autoFetch.get(`/comments/?activity=${activityId}&is_public=true`);
            setPost({...post, comments: data});
            setTextComment("");
            setImageComment(null);
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
    }

    const getParticipants = async (activityId) => {
        setShowComment(false);
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

    const addComment = async (activityId) => {
        if (!textComment) {
            return;
        }
        setCommentLoading(true);
        try {
            let image;
            if (imageComment) {
                image = await handleUpImageComment();
                if (!image) {
                    setCommentLoading(false);
                    setImageComment(null);
                    return;
                }
            }
            const {data} = await autoFetch.post("/comments/", {
                activity: activityId,
                is_public: true,
                comment: textComment,
                image
            });
            setPost((prevPost) => {
                const updatedComments = Array.isArray(prevPost.comments) ? [...prevPost.comments, data] : [data];
                return {...prevPost, comments: updatedComments,};
            });
            setShowComment(true);
            setShowParticipants(false);
            setTextComment("");
            setImageComment(null);
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
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

    const deletePost = async (activityId) => {
        try {
            const {data} = await autoFetch.delete(`/activities/${activityId}/`);
            setIsDelete(true);
            toast(data.msg);
            getDeletePostId(activityId);
        } catch (error) {
            console.log(error);
        }
    };

    //update activity
    const updateActivity = async () => {
        setLoadingEdit(true);
        try {
            let image = imageEdit;
            if (formData) {
                image = await handleUpImageComment();
                if (!image) {
                    toast.error("Upload image fail. Try again!");
                    setLoadingEdit(false);
                    return;
                }
            }
            const {data} = await autoFetch.patch(
                `/activities/${currentActivity.id}/`,
                {
                    title: titleEdit,
                    description: descriptionEdit,
                    total_player_count: totalPlayerCountEdit,
                    start_date: startDateEdit,
                    end_date: endDateEdit,
                    address: addressEdit,
                    category: categoryEdit,
                    activity_price: priceEdit,
                    image,
                }
            );
            setPost(data);
            setTitleEdit(data.title);
            setImageEdit(data.image);
            setDescriptionEdit(data.description);
            setTotalPlayerCountEdit(data.total_player_count);
            setStartDateEdit(data.start_date);
            setEndDateEdit(data.end_date);
            setAddressEdit(data.address);
            setCategoryEdit(data.category);
            setPriceEdit(data.activity_price);

            if (data.post.image) {
                setAttachment("photo");
            }
            toast("Update post success!");
        } catch (error) {
            console.log(error);
        }
        setLoadingEdit(false);
        setFormData(null);
    };

    // when post was delete
    if (isDelete) {
        return null;
    }

    // when error data
    if (!post?.owner) {
        return null;
    }

    if (loadingEdit) {
        return <PostLoading className='mb-4' />;
    }

    const joinActivity = async (activityId) => {
        try {
            const response = await autoFetch.post(`/activities/${activityId}/join/`);
            const {data} = response;
            if(response.status === 201){  //yani aktiviteye katılma isteği yollandıysa
                setPost((prevPost) => ({
                    ...prevPost,
                    activity_user: [...prevPost.activity_user, data.data],
                }));
            } else if(response.status === 200) {     //yani aktiviteye katılma isteği silindiyse
                setPost((prevPost) => ({
                    ...prevPost,
                    activity_user: prevPost.activity_user.filter((user) => user?.username !== data?.data?.username),
                }));
            }
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={`dark:bg-[#242526] bg-white mb-5 pt-3 pb-2.5 md:pb-3 rounded-lg ${className} `}>
            {/* Model when in mode edit post */}
            {openModal && (
                <Modal
                    setOpenModal={setOpenModal}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    isEditPost={true}
                    imageEdit={imageEdit}
                    setFormDataEdit={setFormData}
                    handleEditPost={updateActivity}
                    setImageEdit={setImageEdit}
                    title={titleEdit}
                    setTitle={setTitleEdit}
                    description={descriptionEdit}
                    setDescription={setDescriptionEdit}
                    totalPlayerCount={totalPlayerCountEdit}
                    setTotalPlayerCount={setTotalPlayerCountEdit}
                    startDate={startDateEdit}
                    setStartDate={setStartDateEdit}
                    endDate={endDateEdit}
                    setEndDate={setEndDateEdit}
                    address={addressEdit}
                    setAddress={setAddressEdit}
                    category={categoryEdit}
                    setCategory={setCategoryEdit}
                    price={priceEdit}
                    setPrice={setPriceEdit}
                />
            )}
            {/* header post */}
            <div className='flex items-center pl-2 pr-3 sm:px-3 md:px-4'>
                {/* avatar */}
                <img
                    src={`${user_img ? ("/api/v1/" + user_img) : "/images/profile.png"}`}
                    alt='avatar'
                    className='w-10 h-10 rounded-full object-cover cursor-pointer '
                    onClick={() => {
                        navigate(`profile/${post.owner}`);
                    }}
                />
                {/* name and time post */}
                <div className={`ml-2 font-bold `}>
                    <div
                        className='flex items-center gap-x-1 cursor-pointer '
                        onClick={() => {
                            navigate(`profile/${post.userId}`);
                        }}>
                        {post.owner}
                        {post.role === "ADMIN" && (
                            <TiTick className='text-[17px] text-white rounded-full bg-sky-500 ' />
                        )}
                    </div>
                    <div className='font-[400] text-[13px] dark:text-[#B0B3B8] flex items-center gap-x-1 '>
                        {moment(post.created_at).fromNow()}
                    </div>
                </div>
                {/* Edit or delete activity */}
                {(userId === post.userId || userRole === "ADMIN") && post.owner === user.username ? (
                    <div
                        className='ml-auto text-[25px] transition-50 cursor-pointer font-bold w-[35px] h-[35px] rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] flex flex-row items-center justify-center group relative '
                        onClick={() => {
                            setShowOption(!showOption);
                        }}>
                        <div className='translate-y-[-6px] z-[100] '>...</div>
                        <ul
                            className={`text-base absolute top-[110%] text-center mr-9 ${
                                !showOption ? "hidden" : "flex flex-col"
                            }   `}
                            onMouseLeave={() => {
                                setShowOption(false);
                            }}>
                            <li
                                className='px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60 '
                                onClick={() => {
                                    navigate(`/activity/detail/${post.id}`);
                                }}>
                                Detail
                            </li>
                            <li
                                className='px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60 '
                                onClick={() => {
                                    setOpenModal(true);
                                }}>
                                Edit
                            </li>
                            <li
                                className='mt-1 px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60'
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Do u want delete this post?"
                                        )
                                    ) {
                                        deletePost(post.id);
                                    }
                                }}>
                                Delete
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <button
                            className={`mr-0 ml-auto text-[14px] transition-50 cursor-pointer font-bold w-[80px] h-[35px] rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#3A3B3C] flex flex-row items-center justify-center group relative ${post?.activity_user?.some((participant) => participant?.username === user?.username && participant?.participate_status === 'Rejected') ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                            onClick={() => joinActivity(post.id)}
                            disabled={post?.activity_user?.some((participant) => participant?.username === user?.username && participant?.participate_status === 'Rejected')}
                        >
                            {post?.activity_user?.some((participant) => participant?.username === user?.username && participant?.participate_status === 'Accepted') ? 'Joined' : (post?.activity_user?.some((participant) => participant?.username === user?.username && participant?.participate_status === 'Wait-listed') ? 'Requested' : 'Join')}
                        </button>
                    </>
                )}
            </div>
            {/* post's text */}
            <div
                onClick={() => {
                    navigate(`/activity/detail/${post.id}`);
                }}
                className={`content mt-[11px] cursor-pointer px-4 ${
                    post?.image || post.title.length > 60
                        ? "text-[17px] "
                        : "text-[22px] "
                } `}
                dangerouslySetInnerHTML={{__html: post.title}}></div>
            <div
                onClick={() => {
                    navigate(`/activity/detail/${post.id}`);
                }}
                className={`content mt-[11px] px-4 cursor-pointer ${
                    post?.image || post.description.length > 60
                        ? "text-[13px] "
                        : "text-[17px] "
                } `}
                dangerouslySetInnerHTML={{__html: post.description}}></div>
            {/* when has image */}
            {post?.image && (
                <div className='mt-3 flex items-center justify-center px-2 cursor-pointer '>
                    <img
                        src={post?.image}
                        alt='img_content'
                        className='w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain bg-[#F0F2F5] dark:bg-[#18191A]'
                        onClick={() => {
                            navigate(`/activity/detail/${post.id}`);
                        }}
                    />
                </div>
            )}
            {/* post's comment and like quantity */}
            {(commentCount > 0 || likeCount > 0) && (
                <div className='px-4 py-[10px] flex gap-x-[6px] items-center text-[15px] '>
                    {/* like quantity */}
                    {likeCount > 0 && (
                        <>
                            {!post.add_favourite?.includes(user.username) ? (
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
                                            ? `You and ${likeCount - 1} other${
                                                  likeCount > 2 ? "s" : ""
                                              }`
                                            : `You`}
                                    </span>
                                </>
                            )}
                        </>
                    )}
                    {/* comment quantity */}
                    <span className='text-[14px] ml-auto text-[#65676b] dark:text-[#afb0b1]'>
                        {commentCount > 0 &&
                            `${commentCount} ${
                                commentCount > 1 ? "comments" : "comment"
                            }`}
                    </span>
                </div>
            )}

            {/* button like and comment */}
            <div className='mx-[12px] mt-2 py-1 flex items-center justify-between border-y dark:border-y-[#3E4042] border-y-[#CED0D4] px-[6px]  '>
                {post?.add_favourite.includes(user.username) ? (
                    <button
                        className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#c22727] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#c22727] transition-50 cursor-pointer  '
                        onClick={() => likeAndUnlike(post.id)}
                        disabled={likeLoading}>
                        {likeLoading ? (
                            <ReactLoading
                                type='spin'
                                width={20}
                                height={20}
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
                        className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer '
                        onClick={() => likeAndUnlike(post.id)}
                        disabled={likeLoading}>
                        {likeLoading ? (
                            <ReactLoading
                                type='spin'
                                width={20}
                                height={20}
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
            {/* participants box */}
            {showParticipants && (
                <div className='px-4 pt-1'>
                    {Object?.entries(post?.activity_user?.reduce((groups, participant) => {
                        const groupKey = participant?.participate_status?.trim();
                        if (!groups[groupKey]) {
                            groups[groupKey] = [];
                        }
                        groups[groupKey].push(participant);
                        return groups;
                    }, {})).map(([status, participants]) => (
                        <div key={status}>
                            <h2 className="text-[16px] pt-2 pb-[3px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer ">{status} Participants</h2>
                            <ul>
                                {participants?.map((participant) => (
                                    <Participant
                                        setPost={setPost}
                                        key={participant?.username}
                                        currentParticipant={participant}
                                        userId={userId}  // aktiviteyi oluşturanın user_idsi
                                        deleteComment={deleteComment}
                                        autoFetch={autoFetch}
                                        activityId={post?.id}
                                        post={post}
                                        navigate={navigate}
                                        user_img={user_img}  // aktiviteyi oluşturanın user_imgi
                                        participate_status={participant?.participate_status}
                                        avatar={participant?.avatar}
                                        description={participant?.description}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* comment box */}
            {showComment && (
                <div className='px-4 pt-1'>
                    {post?.comments?.map((comment) => (
                        <Comment
                            key={comment.id}
                            currentComment={comment}
                            userId={userId}
                            deleteComment={deleteComment}
                            autoFetch={autoFetch}
                            postId={post.id}
                            navigate={navigate}
                            user_img={user_img}
                        />
                    ))}
                </div>
            )}
            {/* form add comment */}
            <div className='flex gap-x-1.5 px-2 sm:px-3 md:px-4 py-1 items-center '>
                <img
                    src={`${user.avatar ? user.avatar : "/images/profile.png"}`}
                    alt='user_avatar'
                    className='w-8 sm:w-9 h-8 sm:h-9 object-cover shrink-0 rounded-full '
                />
                <form
                    className='flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]  '
                    onSubmit={(e) => {
                        e.preventDefault();
                        addComment(post.id);
                    }}>
                    <input
                        type='text'
                        className='px-2 py-1 sm:py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8] '
                        placeholder='Write a comment...'
                        value={textComment}
                        disabled={commentLoading}
                        onChange={(e) => {
                            setTextComment(e.target.value);
                        }}
                    />
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
                                type='spin'
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
    );
};

export default Post;
