import React from "react";
import { Alert, Flex, Spin } from "antd";

const Loading = () => {
  return (
    <Flex gap="middle" vertical>
      <Spin
        size="large"
        style={{ margin: "100px 0 0 0" }}
        tip="Loading..."
      ></Spin>
      <Alert
        style={{ width: "40%", margin: "0 auto" }}
        description="Please be patient..."
      />
    </Flex>
  );
};

export default Loading;
