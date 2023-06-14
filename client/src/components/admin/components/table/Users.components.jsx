import React, {useEffect, useMemo, useState} from "react";
import Pagination from "@mui/material/Pagination";
import ReactLoading from "react-loading";
// components
import {Table} from "../../..";
import {useAppContext} from "../../../../context/useContext.jsx";
import {toast} from "react-toastify";

const Users = ({convertDate, countUsers}) => {
    const {autoFetch} = useAppContext();

    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(15);

    const [page, setPage] = useState(1);
    // list all users
    const [listUser, setListUser] = useState([]);
    // numbers of all users
    const [totalUser, setTotalUser] = useState(0);

    useEffect(() => {
        getAllUsers();
    }, [page, perPage]);

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/profiles/admin/users/?page=${page}&perPage=${perPage}`
            );
            setTotalUser(data.count);
            setListUser(data.results);
            countUsers(data.count);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoading(false);
    };

    const fields = [
        "no",
        "avatar",
        "name",
        "email",
        "postNumber",
        "follower",
        "following",
        "date",
    ];
    // titles of head table
    const titles = [
        "No",
        "Avatar",
        "Name",
        "Email",
        "Posts",
        "Follower",
        "Following",
        "Date",
    ];

    const data = useMemo(() => {
        return listUser.map((v, index) => {
            return {
                id: v.id,
                no: index + (page - 1) * perPage + 1,
                avatar: v?.avatar,
                name: v?.user.username,
                email: v.user.email,
                postNumber: "n/a",
                follower: v.follower?.length,
                following: v.following?.length,
                date: convertDate(v.created_at),
            };
        });
    }, [listUser, fields]);

    const listCenterTd = React.useMemo(
        () => ["postNumber", "no", "follower", "following"],
        []
    );
    const listCenterHead = React.useMemo(
        () => ["No", "Email", "Posts", "Follower", "Following", "Date"],
        []
    );

    return (
        <div className='w-full h-full px-1'>
            <div className='w-full flex justify-between items-center px-1 md:pr-10 py-1 '>
                <div className='font-bold text-xl '> User </div>
                <div className='flex items-center gap-x-1 '>
                    {loading && (
                        <ReactLoading
                            type='spin'
                            width={20}
                            height={20}
                            color='#7d838c'
                        />
                    )}
                    <div>
                        <select
                            id='countries'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70px] py-1 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(parseInt(e.target.value));
                            }}>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                        </select>
                    </div>

                    <Pagination
                        count={
                            (totalUser - (totalUser % perPage)) / perPage + 1
                        }
                        page={page}
                        variant='outlined'
                        onChange={(setOneState, page) => {
                            setPage(page);
                        }}
                    />
                </div>
            </div>
            <div className='w-full h-full  '>
                <Table
                    titles={titles}
                    fields={fields}
                    data={data}
                    listCenterHead={listCenterHead}
                    listCenterTd={listCenterTd}
                    className='sky'
                    typeTable='users'
                />
            </div>
        </div>
    );
};

export default Users;
