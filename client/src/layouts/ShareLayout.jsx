import { Outlet } from "react-router-dom";
import Nav from "../components/navi/Nav.jsx";

const ShareLayout = () => {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    );
};

export default ShareLayout;