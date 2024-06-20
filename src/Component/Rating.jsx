import React from "react";
import { Rate } from "antd";

const Rating = ({ score }) => <Rate disabled defaultValue={score} />;

export default Rating;
