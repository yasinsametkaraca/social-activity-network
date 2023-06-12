import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {TiTick} from "react-icons/ti";
import Divider from "@mui/material/Divider";
import {useEffect, useState} from "react";
import {useAppContext} from "../../context/useContext.jsx";

const Notification = () => {

    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
    const {autoFetch} = useAppContext()
    const [notificationQuantity, setNotificationQuantity] = useState();

    useEffect(() => {
        getAllNotifications()
    }, []);

    const getAllNotifications = async () => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(`/notifications/`);
            setNotification(data);
            setNotificationQuantity(data.length);
            console.log(data)
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <div className='w-screen h-screen px-2 md:px-[5%] pt-[60px] md:pt-[80px] overflow-hidden '>
            <div className='flex justify-center'>
                <div className='border dark:border-white/20 box-shadow'>
                    <List
                        className='bg-[#F0F2F5] w-full dark:bg-[#3A3B3C] '
                        sx={{width: "100%"}}>
                        {notification?.length > 0 &&
                            notification?.map((v, index) => (
                                <div
                                    key={v.sender + "listResult"}
                                    className='cursor-pointer hover:bg-black/20 '
                                    onClick={() => {

                                    }}>
                                    <ListItem className='flex items-center flex-start '>
                                        {/*<ListItemAvatar>*/}
                                        {/*    <Avatar*/}
                                        {/*        alt={v.username}*/}
                                        {/*        src={v.avatar}*/}
                                        {/*        className='border-[1px] border-black/30 dark:bg-white bg-black/30 '*/}
                                        {/*    />*/}
                                        {/*</ListItemAvatar>*/}
                                        <div className='text-[18px] font-medium flex items-center gap-x-0.5 '>
                                            {v.sender} {v.type} {v.receiver}
                                        </div>
                                    </ListItem>
                                    {index < notificationQuantity - 1 && (
                                        <Divider  component='li' />
                                    )}
                                </div>
                            ))}
                    </List>
                </div>
            </div>
        </div>
    );
}

export default Notification;