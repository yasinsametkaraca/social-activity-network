import React, { useEffect, useMemo, useState } from "react";
import { LineChart } from "../../../";
import { useAppContext } from "../../../../context/useContext.jsx";
import {toast} from "react-toastify";

const Chart = ({ convertDate }) => {
    const { autoFetch } = useAppContext();

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [dataPosts, setDataPosts] = useState([]);
    const [dataUsers, setDataUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
        getAllPosts();
    }, []);

    const getAllUsers = async () => {
        setLoadingUsers(true);
        try {
            const {data} = await autoFetch.get(
                `/profiles/admin/users/`
            );
            setDataUsers(data.results);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoadingUsers(false);
    };

    const getAllPosts = async () => {
        setLoadingPosts(true);
        try {
            const {data} = await autoFetch.get(
                `/activities/admin/`
            );
            setDataPosts(data.results);
        } catch (error) {
            toast.error("Something went wrong. Try again!");
        }
        setLoadingPosts(false);
    };

    const datasetPosts = useMemo(() => {
        const data = [];
        dataPosts.forEach((v) => {
            const x = convertDate(v.created_at);
            const index = data.find((v) => v.x === x);
            if (!index) {
                data.push({ x: x, y: 1 });
            } else {
                data[data.length - 1].y += 1;
            }
        });
        return data;
    }, [dataPosts]);

    const datasetUser = useMemo(() => {
        const data = [];
        dataUsers.forEach((v) => {
            const x = convertDate(v.created_at);
            const index = data.find((v) => v.x === x);
            if (!index) {
                data.push({ x: x, y: 1 });
            } else {
                data[data.length - 1].y += 1;
            }
        });
        return data;
    }, [dataUsers]);

    const datasets = [
        {
            label: loadingPosts ? "Loading..." : "Posts",
            data: datasetPosts,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
            borderWidth: 1,
            pointBorderWidth: 0,
            pointHoverBorderWidth: 3,
            pointHoverRadius: 3,
            pointHitRadius: 5,
            pointRadius: 0,
            pointBackgroundColor: "rgb(75, 192, 192)",
        },
        {
            label: loadingUsers ? "Loading..." : "Users",
            data: datasetUser,
            borderColor: "#1565C0",
            tension: 0.3,
            borderWidth: 1,
            pointBorderWidth: 0,
            pointHoverBorderWidth: 3,
            pointHoverRadius: 3,
            pointHitRadius: 5,
            pointRadius: 0,
            pointBackgroundColor: "#1565C0",
        },
    ];

    const option = {
        legend: {
            display: true,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (contents) => {
                        const arrTitle = [];
                        const contentLength = contents.length;
                        contents.forEach((v, index) => {
                            arrTitle.push(v.dataset.label);
                            arrTitle.push(v.raw.y);
                            arrTitle.push(v.raw.x);
                            if (index < contentLength - 1) {
                                arrTitle.push("----------------");
                            }
                        });
                        return arrTitle;
                    },
                    label: () => "",
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "week",
                    displayFormats: {
                        week: "DD/MM",
                    },
                },
                grid: { display: false },

                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                grid: { display: false },

                title: {
                    display: true,
                    text: "Quantity",
                },
            },
        },
        borderColor: "red",
    };

    return (
        <div className="w-full h-full flex items-center justify-center  ">
            <div className="w-full md:w-[60%] h-full ">
                <LineChart datasets={datasets} option={option} />
            </div>
        </div>
    );
};

export default Chart;
