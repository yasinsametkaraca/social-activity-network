// common component
import Modal from "./common/Modal.jsx";
import Nav from "./common/Nav.jsx";
import Post from "./common/Post.jsx";
import Comment from "./common/Comment.jsx";
import Dropdown from "./common/Dropdown.jsx";
import FormCreatePost from "./common/FormCreatePost.jsx";
import ItemsList from "./common/ItemsList.jsx";
import GroupAvatars from "./common/GroupAvatars.jsx";
import ModalQrCode from "./common/ModalQrCode.jsx";
import Table from "./common/table/Table.jsx";
import LineChart from "./common/chart/LineChart.jsx";

// loading component
import LoadingPost from "./loading/Loading.Post.jsx";
import LoadingWeather from "./loading/Loading.Weather.jsx";
import LoadingSuggestion from "./loading/Loading.Suggestion.jsx";
import LoadingForm from "./loading/Loading.Form.jsx";
import LoadingProfile from "./loading/Loading.Profile.jsx";
import LoadingIntro from "./loading/Loading.Intro.jsx";
import LoadingImage from "./loading/Loading.Image.jsx";
import LoadingCard from "./loading/Loading.Card.jsx";
import LoadingPostInformation from "./loading/Loading.PostInformation.jsx";
import LoadingMessenger from "./loading/Loading.Messenger.jsx";

// pages
import Messenger from "./messenger/messenger.pages.jsx";
import Dashboard from "./dashboard/DashBoard.pages.jsx";
import Profile from "./profile/Profile.pages.jsx";
import Admin from "./admin/Admin.page.jsx";
import Information from "./post/Information.pages.jsx";

// function
import colorGeneration from "./common/colorGeneration.jsx";

export {
    // common
    Nav,
    Post,
    Modal,
    Comment,
    Dropdown,
    ItemsList,
    GroupAvatars,
    FormCreatePost,
    ModalQrCode,
    Table,
    LineChart,
    //loading
    LoadingPost,
    LoadingWeather,
    LoadingSuggestion,
    LoadingForm,
    LoadingProfile,
    LoadingIntro,
    LoadingImage,
    LoadingPostInformation,
    LoadingCard,
    LoadingMessenger,
    // page
    Messenger,
    Dashboard,
    Profile,
    colorGeneration,
    Admin,
    Information,
};
