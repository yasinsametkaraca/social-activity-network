import React, {useEffect, useMemo, useState} from "react";
import Pagination from "@mui/material/Pagination";
// components
import {Table} from "../../..";
import {useAppContext} from "../../../../context/useContext.jsx";
import ReactLoading from "react-loading";
import {toast} from "react-toastify";

const Posts = ({convertDate, countPosts}) => {
    const {autoFetch} = useAppContext();

    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(15);

    const [page, setPage] = useState(1);
    // list all users
    const [posts, setPosts] = useState([]);
    // numbers of all users
    const [postsCount, setPostsCount] = useState(0);

    useEffect(() => {
        getAllPosts();
    }, [page, perPage]);

    const getAllPosts = async () => {
        setLoading(true);
        try {
            const {data} = await autoFetch.get(
                `/activities/admin/?page=${page}&perPage=${perPage}`
            );
            setPosts(data.results);
            setPostsCount(data.count);
            countPosts(data.count);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deletePost = async (postId) => {
        try {
            const {data} = await autoFetch.delete(
                `/api/post/admin/delete-post/${postId}`
            );
            toast("Delete post success!");
            getAllPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const fields = useMemo(
        () => [
            "no",
            "avatar",
            "name",
            "content",
            "image",
            "likeCount",
            "commentCount",
            "date",
        ],
        []
    );
    // titles of head table
    const titles = useMemo(
        () => [
            "No",
            "Avatar",
            "Name",
            "Content",
            "Image",
            "Like",
            "Comment",
            "Date  ",
        ],
        []
    );

    const data = useMemo(() => {
        return posts.map((v, index) => {
            return {
                id: v.id,
                no: index + (page - 1) * perPage + 1,
                avatar: v.avatar,
                name: v.owner,
                content: v.title,
                image: v?.image,
                likeCount: v.add_favourite?.length,
                commentCount: v.comment_count,
                date: convertDate(v.created_at),
                userId: v.owner,
            };
        });
    }, [posts, fields]);

    const listCenterTd = React.useMemo(
        () => ["no", "commentCount", "likeCount"],
        []
    );
    const listCenterHead = React.useMemo(
        () => ["No", "Date", "Posts", "Image", "Like", "Comment"],
        []
    );

    return (
        <div className='w-full h-full px-1'>
            <div className='w-full flex justify-between items-center pr-10 py-1 '>
                <div className='font-bold text-xl '> Posts </div>
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
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500-500 focus:border-green-500 block w-[70px] py-1 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500'
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
                            (postsCount - (postsCount % perPage)) / perPage + 1
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
                    bgHeadColor='#009688'
                    className='green'
                    typeTable='posts'
                    deletePost={deletePost}
                />
            </div>
        </div>
    );
};

export default Posts;
