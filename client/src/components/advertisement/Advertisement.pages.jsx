import {useAppContext} from "../../context/useContext.jsx";
import AdvertisementItem from "./AdvertisementItem.jsx";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {LoadingPost} from "../index.js";
import InfiniteScroll from "react-infinite-scroll-component";

const AdvertisementPages = () => {
    const {autoFetch, dark, user} = useAppContext();
    const [advertisementList, setAdvertisementList] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    useEffect(() => {
        getAdvertisements();
    }, []);

    const getAdvertisements = async () => {
        try {
            const {data} = await autoFetch.get(`/advertisements/`);
            setAdvertisementList(data.results);
            setCount(data.count)
        } catch (e) {
            toast.error("Error...");
        }
    }

    const getNewAdvertisements = async () => {
        try {
            const {data} = await autoFetch.get(
                `/advertisements/?page=${page + 1}`
            );
            setPage(page + 1);
            setAdvertisementList([...advertisementList, ...data.results]);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className='overflow-x-hidden min-h-screen pt-16 md:pt-[85px]'>
                <div className='w-screen grid grid-cols-11 md:gap-x-12 px-3 sm:px-7 md:px-10 relative'>
                    <div className='col-span-11 md:col-span-3 relative order-1 '>

                    </div>
                    <div className='col-span-11 md:col-span-5 shrink-0 order-3 md:order-2'>
                        <InfiniteScroll
                            dataLength={count}
                            next={getNewAdvertisements}
                            style={{ display: 'flex', flexDirection:'column', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%', overflow: 'auto' }}
                            hasMore={advertisementList.length < count}
                            loader={<LoadingPost />}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>You have seen it all</b>
                                </p>
                            }
                        >
                            {advertisementList.map((advertisementItem) => (
                                <div key={advertisementItem?.id} className='mr-5 mb-5 w-full md:w-[100%]'>
                                    <AdvertisementItem
                                        autoFetch={autoFetch}
                                        dark={dark}
                                        isAdvertisementList={true}
                                        advertisementItem={advertisementItem}
                                        user={user}
                                        getAdvertisements={getAdvertisements}
                                    ></AdvertisementItem>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                    <div className='col-span-11 md:col-span-3 relative order-2 md:order-3 '>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdvertisementPages;