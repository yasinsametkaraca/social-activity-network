import moment from "moment";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";

const NotificationItem = ({ notification, autoFetch }) => {

    const [isRead, setIsRead] = useState(notification?.is_read);

    const navigate = useNavigate();

    const markAsRead = async () => {
        try {
            const {data} = await autoFetch.put(`/notifications/${notification?.id}/`);
            setIsRead(true);
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
    };

    let notificationText = "";
    switch (notification?.type) {
        case "AJ":
            notificationText = `${notification?.sender} sent you an activity join request for "${notification?.activity_title}"`;
            break;
        case "AA":
            notificationText = `${notification?.sender} accepted your activity invitation for "${notification?.activity_title}"`;
            break;
        case "AR":
            notificationText = `${notification?.sender} rejected your activity invitation for "${notification?.activity_title}"`;
            break;
        case "F":
            notificationText = `${notification?.sender} followed you`;
            break;
        case "SSC":
            notificationText = `System staff confirmed your activity "${notification?.advertisement ? notification?.advertisement_title : notification?.activity_title}"`;
            break;
        case "SSR":
            notificationText = `System staff did not confirmed your activity "${notification?.advertisement ? notification?.advertisement_title : notification?.activity_title}"`;
            break;
        case "Fav":
            notificationText = `${notification?.sender} added your activity "${notification?.advertisement ? notification?.advertisement_title : notification?.activity_title}" to favorites`;
            break;
        default:
            notificationText = "New notification";
            break;
    }

    return (
        <div className={`flex items-center px-2 py-5 w-full ${isRead ? "bg-black/10" : ""}`}>
            <div className="mr-4">
                <div className={`w-10 h-10 bg-gray-300 rounded-full ${isRead ? "bg-black/10" : "bg-gray-300"}`}>
                    <img
                        src={`${
                            notification?.sender_avatar ? `/api/v1/${notification?.sender_avatar}` 
                                : notification?.type !== "SSC" && notification?.type !== "SSR"
                                    ? "/images/profile.png"
                                    : "/images/logo.png"
                        }`}
                        alt='avatar'
                        className='w-10 h-10 rounded-full object-cover cursor-pointer '
                        onClick={() => {
                            if(notification?.type === "SSC" || notification?.type === "SSR") return;
                            navigate(`/profile/${notification?.sender}`);
                        }}
                    />
                </div>
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <h4
                        onClick={() => {
                            if(notification?.advertisement)
                                return navigate(`/advertisement/detail/${notification?.advertisement}`)
                            navigate(`/activity/detail/${notification?.activity}`)}
                        }
                        className="cursor-pointer text-lg font-bold"
                    >
                        {notification?.advertisement ? notification?.advertisement_title : notification?.activity_title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{moment(notification?.created_at).fromNow()}</p>
                </div>
                <div className={"flex justify-between"}>
                    <p className={` ${notification?.type === "F" ? "text-lg font-bold mb-4" : " max-sm:w-full mt-1"}`}>{notificationText}</p>
                    {!isRead && (
                        <button
                            className="text-blue-500 text-sm"
                            onClick={markAsRead}
                        >
                            Mark as Read
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default NotificationItem;