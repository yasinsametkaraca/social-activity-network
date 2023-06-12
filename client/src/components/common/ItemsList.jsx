import {useNavigate} from "react-router-dom";
// MUI
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// icon
import {TiTick} from "react-icons/ti";
const ADD_USER_TO_SEND_NEW_MESSAGE = "ADD_USER_TO_SEND_NEW_MESSAGE";
const CLEAR_WHEN_DUPLICATE = "CLEAR_WHEN_DUPLICATE";

export default function ItemsList({
    dataSource,
    dispatch = () => {},
    user,
    state = {
        listResultByPeopleSearch: [
            {
                username: "",
            },
        ],
    },
    searchInNav = false,
    clearList = () => {},
}) {
    const quantity = dataSource.length;
    const navigate = useNavigate();
    return (
        <div className='border dark:border-white/20 box-shadow'>
            <List
                className='bg-[#F0F2F5] w-full dark:bg-[#3A3B3C] '
                sx={{width: "100%"}}>
                {dataSource.length > 0 &&
                    dataSource.map((v, index) => (
                        <div
                            key={v.username + "listResult"}
                            className='cursor-pointer hover:bg-black/20 '
                            onClick={() => {
                                if (!searchInNav) {
                                    if (user && v.username === user.username) {
                                        dispatch({type: CLEAR_WHEN_DUPLICATE});
                                        return;
                                    }
                                    if (
                                        state.listResultByPeopleSearch.length >
                                        0
                                    ) {
                                        let username =
                                            state.listResultByPeopleSearch.find(
                                                (i) => i.username === v.username
                                            );
                                        dispatch({type: CLEAR_WHEN_DUPLICATE});
                                        if (username) return;
                                    }
                                    dispatch({
                                        type: ADD_USER_TO_SEND_NEW_MESSAGE,
                                        payload: {
                                            listResultByPeopleSearch: [
                                                ...state.listResultByPeopleSearch,
                                                v,
                                            ],
                                        },
                                    });
                                } else {
                                    navigate(`/profile/${v.username}`);
                                    clearList();
                                }
                            }}>
                            <ListItem className='flex items-center flex-start '>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={v.username}
                                        src={v.avatar}
                                        className='border-[1px] border-black/30 dark:bg-white bg-black/30 '
                                    />
                                </ListItemAvatar>
                                <div className='text-[18px] font-medium flex items-center gap-x-0.5 '>
                                    {v.username}
                                    {v.role === "ADMIN" && (
                                        <TiTick className='text-[14px] text-white rounded-full bg-sky-500 ' />
                                    )}
                                </div>
                            </ListItem>
                            {index < quantity - 1 && (
                                <Divider variant='inset' component='li' />
                            )}
                        </div>
                    ))}
            </List>
        </div>
    );
}
