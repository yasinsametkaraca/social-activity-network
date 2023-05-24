import { useRef, useState} from "react";
import {toast} from "react-toastify";
import {useAppContext} from "../../context/useContext.jsx";
import {TiTickOutline} from "react-icons/ti";
import {MdOutlineCancel} from "react-icons/md";

const Participant = ({
                     currentParticipant,
                     userId,
                     deleteComment,
                     autoFetch,
                     activityId,
                     navigate,
                     user_img,
                     description,
                     avatar,
                     participate_status,
                     post,
                     setPost,
                 }) => {
    const [showOption, setShowOption] = useState(false);
    const [participant, setParticipant] = useState(currentParticipant);
    const [editLoading, setEditLoading] = useState(false);
    const cmtHistory = useRef(currentParticipant.description);
    const [isPublic, setIsPublic] = useState(true);
    const {user} = useAppContext();


    // if (!currentComment.owner) {
    //     return (
    //         <div className=' rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C] px-3 py-2 w-auto my-2 relative border border-red-500 opacity-50 '>
    //             This comment has been removed because the user is banned.
    //         </div>
    //     );
    // }

    const participantAcceptOrReject = async (status, username) => {
        try {
            const {data} = await autoFetch.put(`/activities/${activityId}/status/`, {
                    username: participant.username,
                    participate_status: status,
            });
            setParticipant({...participant, participate_status: status});
            setPost((prevPost) => ({
                ...prevPost,
                activity_user: prevPost.activity_user.map((participant) =>
                    participant.username === username ? { ...participant, participate_status: status } : participant
                ),
            }));
            toast.success(data.message);
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className={`relative mt-1`}>
            <div className='relative flex gap-x-1.5 mt-1.5 group'>
                <img
                    src={`${participant.avatar ? "/api/v1/" + participant.avatar : "/images/profile.png"}`}
                    alt='own_avt_cmt'
                    className='z-10 object-cover w-9 h-9 rounded-full cursor-pointer '
                    onClick={() => {
                        navigate(`/profile/${participant.participantId}`);
                    }}
                />
                <div className={`box-comment relative w-full ${editLoading && "opacity-50"} `}>
                    <div className='flex items-center w-full gap-x-1 '>
                        <div className='rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C] px-3 py-2 max-w-full relative  '>
                            <div
                                className='font-bold text-[15px] text-[#050505] dark:text-[#e4e6eb] flex items-center gap-x-1 cursor-pointer '
                                onClick={() => {
                                    navigate(
                                        `/profile/${participant.participantId}`
                                    );
                                }}>
                                {participant?.username}
                            </div>
                            <div
                                className={`content text-[15px] text-[#050505] dark:text-[#cecfd1] `}>
                                {description}
                            </div>
                            {/* accept or reject participant */}
                            {(user.username === post.owner) && (post.owner !== participant.username) && (
                                <div
                                    className='max-sm:bg-slate-200 shrink-1 w-10 h-10 hidden group-hover:flex cursor-pointer text-[23px] font-extrabold hover:bg-[#F0F2F5] items-center justify-center rounded-full transition-50 dark:hover:bg-[#3A3B3C] absolute z-[100]  right-[-45px] top-[50%] translate-y-[-50%] '
                                    onClick={() => {
                                        setShowOption(!showOption);
                                    }}>

                                    <div className='translate-y-[-6px] '>
                                        ...
                                    </div>
                                    <ul
                                        className={`text-base absolute left-[160%] text-center mb-1 ${
                                            !showOption
                                                ? "hidden"
                                                : "flex flex-row"
                                        }`}
                                        onMouseLeave={() => {
                                            setShowOption(false);
                                        }}
                                    >
                                        <li
                                            className='mx-1 mt-1 px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60'
                                            onClick={() => participantAcceptOrReject("Accepted", participant.username)}>
                                            <TiTickOutline className={"text-green-600"} size={26}></TiTickOutline>
                                        </li>
                                        <li
                                            className='mt-1 px-3 py-1 bg-[#F0F2F5] border-[#3A3B3C]/40 text-[#333]/60 hover:border-[#3A3B3C]/60 hover:text-[#333]/80 dark:bg-[#3A3B3C] rounded-md border dark:text-[#e4e6eb]/60 transition-50 dark:hover:text-[#e4e6eb] dark:border-[#3A3B3C] dark:hover:border-[#e4e6eb]/60'
                                            onClick={() => participantAcceptOrReject("Rejected", participant.username)}>
                                            <MdOutlineCancel className={"text-red-500"} size={25}></MdOutlineCancel>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Participant;
