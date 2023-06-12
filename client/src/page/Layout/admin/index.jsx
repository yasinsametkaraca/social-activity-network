import { useAppContext } from "../../../context/useContext.jsx";
import { Navigate } from "react-router-dom";
import { Admin } from "../../../components";
const AdminPages = () => {
    const { user } = useAppContext();
    if (user?.role !== "ADMIN") {
        return <Navigate to="/" />;
    }

    return <Admin />;
};

export default AdminPages;
