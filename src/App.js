import React from "react";
import "./App.css";
import MainPage from "./Component/MainPage";
import RequireAuth from "./Component/RequireAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./Component/Productdetail";
import ProductFilter from "./Component/ProductFilter";
import Register from "./Component/Register";
import RegisterPost from "./Component/RegisterPost";
import LoginPage from "./Component/Login";
import Profile from "./Component/Profile";
import EditProfile from "./Component/EditProfile";
import LayoutCom from "./Component/Layout";
import Cart from "./Component/Cart";
import MyPost from "./Component/MyPost";
import UserDetail from "./Component/UserProfile";
import UnappraisedWatches from "./Component/UnappraisedWatches";
import AppraiseWatch from "./Component/AppraiseWatch";
import PaymentReturn from "./Component/PaymentReturn";
import MyOrders from "./Component/MyOrders";
import OrderDetail from "./Component/OrderDetail";
import Chat from "./Component/Chat";
import UserManagement from "./Component/UserManagement";
import CreateFeedback from "./Component/FeedbackPage";
import Revenue from "./Component/Revenue";
import VoucherApproval from "./Component/VoucherApproval";
import VoucherForm from "./Component/VoucherForm";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/filter" element={<ProductFilter />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth role={["USER"]}></RequireAuth>}>
          <Route path="/upload" element={<RegisterPost />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/My-Post" element={<MyPost />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route
            path="/feedback/:productId/:orderItemId"
            element={<CreateFeedback />}
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth roles={["STAFF"]} />}>
          <Route path="/unappraised-watches" element={<UnappraisedWatches />} />
          <Route path="/appraise-watch/:id" element={<AppraiseWatch />} />
          <Route path="/create-voucher" element={<VoucherForm />} />
        </Route>
        <Route element={<RequireAuth roles={["USER", "STAFF"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route element={<RequireAuth roles={["ADMIN"]} />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="voucher-approve" element={<VoucherApproval />} />
        </Route>
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
      </Route>
    </Routes>
  );
};
export default App;
