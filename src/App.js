import React from "react";
import "./App.css";
import MainPage from "./Component/MainPage";
import RequireAuth from "./Component/RequireAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WatchDetail from "./Component/WatchDetail";
import WatchFilter from "./Component/WatchFilter";
import Register from "./Component/Register";
import RegisterPost from "./Component/RegisterPost";
import LoginPage from "./Component/Login";
import Profile from "./Component/Profile";
import EditProfile from "./Component/EditProfile";
import LayoutCom from "./Component/Layout";
import Cart from "./Component/Cart";
import MyPost from "./Component/MyPost";
import AboutUs from "./Component/AboutUs";
import UserDetail from "./Component/UserProfile";
import UnappraisedWatches from "./Component/UnappraisedWatches";
import AppraiseWatch from "./Component/AppraiseWatch";
import PaymentReturn from "./Component/PaymentReturn";
import MyOrders from "./Component/MyOrders";
import OrderDetail from "./Component/OrderDetail";
import Chat from "./Component/Chat";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/filter/:type" element={<WatchFilter />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route element={<RequireAuth role={["USER"]}></RequireAuth>}>
          <Route path="/upload" element={<RegisterPost />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/My-Post" element={<MyPost />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth roles={["APPRAISER"]} />}>
          <Route path="/unappraised-watches" element={<UnappraisedWatches />} />
          <Route path="/appraise-watch/:id" element={<AppraiseWatch />} />
        </Route>
        <Route element={<RequireAuth roles={["USER", "APPRAISER"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
      </Route>
    </Routes>
  );
};
export default App;
