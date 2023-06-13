import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import {useEffect, useState} from "react";
import {useAppContext} from "../../context/useContext.jsx";
import NotificationItem from "./components/NotificationItem.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {LoadingPost} from "../index.js";


const Notification = () => {

    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
    const {autoFetch} = useAppContext()
    const [notificationQuantity, setNotificationQuantity] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getAllNotifications()
    }, []);

    const getAllNotifications = async () => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(`/notifications/`);
            setNotification(data.results);
            setNotificationQuantity(data.count);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const getNewNotifications= async () => {
        try {
            const {data} = await autoFetch.get(
                `/advertisements/?page=${page + 1}`
            );
            setPage(page + 1);
            setNotification([...notification, ...data.results]);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-screen h-screen px-2 md:px-[5%] pt-[60px] md:pt-[80px] overflow-hidden'>
            <div className='flex justify-center w-full'>
                <div className='border dark:border-white/20 box-shadow md:w-2/3 w-full'>
                    <InfiniteScroll
                        dataLength={notificationQuantity}
                        next={getNewNotifications}
                        style={{ display: 'flex', flexDirection:'column', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%', overflow: 'auto' }}
                        hasMore={notification.length < notificationQuantity}
                        loader={<LoadingPost />}
                        endMessage={
                            <p className={"my-3"} style={{ textAlign: 'center' }}>
                                <b>You have seen it all</b>
                            </p>
                        }
                    >
                        {<List
                            disablePadding={true}
                            className='bg-[#F0F2F5] dark:bg-[#3A3B3C]'
                            sx={{width: "100%"}}>
                            {notification?.length > 0 &&
                                notification?.map((v, index) => (
                                    <div
                                        key={v.id + "listResult"}
                                        className='cursor-pointer hover:bg-black/20 m-0 p-0'
                                        onClick={() => {

                                        }}>
                                        <ListItem className='flex items-center flex-start p-0' disablePadding={true}>
                                            <NotificationItem
                                                key={v.id}
                                                notification={v}
                                                autoFetch={autoFetch}
                                            />
                                        </ListItem>
                                        {index < notificationQuantity - 1 && (
                                            <Divider  component='li' />
                                        )}
                                    </div>
                                ))}
                        </List>}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
}

export default Notification;