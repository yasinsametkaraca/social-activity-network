import {useAppContext} from "../../context/useContext.jsx";
import AdvertisementItem from "./AdvertisementItem.jsx";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {LoadingPost} from "../index.js";
import InfiniteScroll from "react-infinite-scroll-component";

const AdvertisementPages = () => {
    const {autoFetch, dark,} = useAppContext();
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
                <div className='md:flex md:flex-row max-sm:grid-cols-1 flex-wrap justify-center gap-4 auto-rows-auto max-w-[90%] mx-auto'>
                    <InfiniteScroll
                        dataLength={count}
                        next={getNewAdvertisements}
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%', overflow: 'auto' }}
                        hasMore={advertisementList.length <= count}
                        loader={<LoadingPost />}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>You have seen it all</b>
                            </p>
                        }
                    >
                        {advertisementList.map((advertisementItem) => (
                            <div key={advertisementItem?.id} className='mr-5 mb-5 w-full md:w-[24%]'>
                                <AdvertisementItem
                                    autoFetch={autoFetch}
                                    dark={dark}
                                    isAdvertisementList={true}
                                    advertisementItem={advertisementItem}
                                ></AdvertisementItem>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        </>
    );
}

export default AdvertisementPages;