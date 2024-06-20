import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import HeaderBar from "./Header";
import Layout from "antd/es/layout/layout";
const LayoutCom = () => {
  return (
    <main>
      <Layout style={{ minHeight: "100vh" }}>
        <HeaderBar />
        <Outlet></Outlet>
        <Footer />
      </Layout>
    </main>
  );
};
export default LayoutCom;
