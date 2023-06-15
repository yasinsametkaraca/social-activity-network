import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./context/useContext.jsx";
import "./index.css";
import "./font.css";
import "react-toastify/dist/ReactToastify.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AppProvider>
      <App />
    </AppProvider>
);

