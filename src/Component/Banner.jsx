import React from "react";
import { Carousel } from "antd";
import bannerimage1 from "../Image/bannerimage1.png";
import bannerimage2 from "../Image/bannerimage2.jpg";
import bannerimage3 from "../Image/bannerimage3.jpg";
import bannerimage4 from "../Image/bannerimage4.jpg";

import Image from "antd";
const contentStyle = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  width: "100%",
  objectFit: "cover",
};
const Banner = () => {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    <Carousel afterChange={onChange} autoplay adaptiveHeight>
      <div>
        <img src={bannerimage1} alt="Banner 1" style={contentStyle} />
      </div>
      <div>
        <img src={bannerimage2} alt="Banner 2" style={contentStyle} />
      </div>
      <div>
        <img src={bannerimage3} alt="Banner 3" style={contentStyle} />
      </div>
      <div>
        <img src={bannerimage4} alt="Banner 4" style={contentStyle} />
      </div>
    </Carousel>
  );
};
export default Banner;
