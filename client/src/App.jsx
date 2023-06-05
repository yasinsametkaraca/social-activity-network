import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useAppContext} from "./context/useContext.jsx";
import {ToastContainer} from "react-toastify";
// page
import {
    Home,
    Login,
    Register,
    ForgetPassword,
    Error,
    ProtectedLayout,
    ShareLayout,
} from "./page/index.jsx";
// layout
import {Dashboard, Messenger, Admin, Advertisement, AdvertisementDetail} from "./page/Layout/index.jsx";
import {Profile, UpdateProfile, Company} from "./page/user/index.jsx";
import {Information} from "./page/Post/index.jsx";
// modal qrCode
import {ModalQrCode} from "./components";

const App = () => {
    const {dark, openModal, isQrCode} = useAppContext();
    return (
        <div className={`${dark ? "dark" : ""} relative `}>
            {/* Notification */}
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme={dark ? "dark" : "light"}
            />
            {/*QR code*/}
            {openModal && isQrCode && <ModalQrCode />}
            {/* Router */}
            <BrowserRouter>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <ProtectedLayout>
                                <ShareLayout />
                            </ProtectedLayout>
                        }>
                        <Route
                            index
                            path='/'
                            element={<Dashboard />}
                        />
                        <Route path='/messenger' element={<Messenger />} />
                        <Route path='/advertisement' element={<Advertisement />} />
                        <Route
                            path={'/advertisement/detail/:id'}
                            element={<AdvertisementDetail />}>
                        </Route>
                        <Route path='/admin' element={<Admin />} />
                        <Route path='/profile/*' element={<Profile />} />
                        <Route
                            path='/update-profile'
                            element={<UpdateProfile />}
                        />
                        <Route path='/company/*' element={<Company />} />
                        <Route
                            path='/activity/detail/:id'
                            element={<Information />}
                        />
                    </Route>

                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route
                        path='/forget-password'
                        element={<ForgetPassword />}
                    />

                    <Route path='*' element={<Error />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
