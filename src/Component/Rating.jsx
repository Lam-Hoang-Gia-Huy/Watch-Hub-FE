import React from "react";
import { Rate } from "antd";

const Rating = ({ score }) => <Rate disabled allowHalf defaultValue={score} />;

export default Rating;
