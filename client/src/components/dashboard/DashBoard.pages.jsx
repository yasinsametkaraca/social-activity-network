import {useAppContext} from "../../context/useContext.jsx";
import {useNavigate} from "react-router-dom";
import Center from "./components/Main.component.jsx";
import Right from "./components/Sugestion.component.jsx";
import { useState} from "react";
import AdvertisementItem from "../advertisement/AdvertisementItem.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const {
        autoFetch,
        user,
        token,
        dark,
        setNameAndToken,
        setOneState,
        isQrCode,
    } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(false);

    const getAllActivities = async () => {
        setLoading(true);
        try {
            const data = await autoFetch.get(
                `/activities/`
            );
            setActivities(data.data.results);
        } catch (error) {
            console.log(error);
            setError(true);
        }
        setLoading(false);
    };

    const getNewActivities = async () => {
        try {
            const {data} = await autoFetch.get(
                `/activities/?page=${page + 1}`
            );
            setPage(page + 1);
            setActivities([...activities, ...data.results]);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='overflow-x-hidden min-h-screen pt-16 md:pt-[85px]'>
            <div className='w-screen grid grid-cols-11 md:gap-x-12 px-3 sm:px-7 md:px-10 relative'>
                <div className='col-span-11 md:col-span-3 relative order-1 '>
                    {/*<Left autoFetch={autoFetch} dark={dark} />*/}
                    <AdvertisementItem
                        autoFetch={autoFetch}
                        dark={dark}
                        user={user}
                    ></AdvertisementItem>
                </div>
                <div className='col-span-11 md:col-span-5 shrink-0 order-3 md:order-2'>
                    <Center
                        autoFetch={autoFetch}
                        dark={dark}
                        setOneState={setOneState}
                        token={token}
                        user={user}
                        getAllActivities={getAllActivities}
                        loading={loading}
                        activities={activities}
                        setActivities={setActivities}
                        getNewActivities={getNewActivities}
                        error={error}
                        isQrCode={isQrCode}
                    />
                </div>
                <div className='col-span-11 md:col-span-3 relative order-2 md:order-3 '>
                    {user?.role === "FRIEND" &&
                        <Right
                            autoFetch={autoFetch}
                            getAllActivities={getAllActivities}
                            navigate={navigate}
                            setNameAndToken={setNameAndToken}
                            user={user}
                            token={token}
                            dark={dark}
                            error={error}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
