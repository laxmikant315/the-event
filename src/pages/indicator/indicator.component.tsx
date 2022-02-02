import { Col, Row } from "antd";

import { useEffect, useState } from "react";

const LineIndicator = ({ data, type }: any) => {
  const [state, setState] = useState<any>({});
  useEffect(() => {
    let left: any = 0,
      right: any = 0,
      backgroundColor = "",
      value = 0;
    const diff = data.currentPrice - data.buyPrice;
    const total = data.buyPrice - data.stoploss;
    const per = (diff * 100) / total;
    let top = 20;
    let height = 120;
    if (type === "target") {
      left = "auto";
      right = 0;
      backgroundColor = "#30ec30";
      value = data.target && data.target.toFixed(2);
    } else if (type === "stoploss") {
      left = 0;
      right = "auto";
      backgroundColor = "#d94b4b";
      value = data.stoploss && data.stoploss.toFixed(2);
    } else if (type === "buy") {
      left = 0;
      right = "auto";
      backgroundColor = "white";
      value = data.buyPrice && data.buyPrice.toFixed(2);
    } else if (type === "current") {
      left = (per < -100 ? -101 : per > 100 ? 101 : per) + "%";
      right = "auto";
      backgroundColor = "#ffe549";
      value = data.currentPrice && data.currentPrice.toFixed(2);
      top = 35;
    }
    setState({ left, right, backgroundColor, value, top, height });
  }, []);
  return (
    <>
      <span
        style={{
          position: "absolute",
          top: state.top,
          left: state.left,
          right: state.right,
          color: state.backgroundColor,
        }}
      >
        {state.value}
      </span>
      <span
        style={{
          position: "absolute",
          left: state.left,
          right: state.right,
          height: state.height + "%",
          width: "3px",
          backgroundColor: state.backgroundColor,
        }}
      ></span>
    </>
  );
};

const Indicator = ({ data }: any) => {
  // const data = [
  //   {
  //     stoplossPer: 10.73,
  //     targetPer: 13.62,
  //     xPer: 0,
  //     yPer: 0,
  //     buyPrice: 100,
  //     target: 150,
  //     stoploss: 50,
  //     currentPrice: 145,
  //   },
  //   {
  //     stoplossPer: 10.73,
  //     targetPer: 10.62,
  //     xPer: 0,
  //     yPer: 0,
  //     buyPrice: 500,
  //     target: 600,
  //     stoploss: 400,
  //     currentPrice: 450,
  //   },
  //   {
  //     stoplossPer: 10.73,
  //     targetPer: 10.62,
  //     xPer: 0,
  //     yPer: 0,
  //     buyPrice: 1450,
  //     target: 1600,
  //     stoploss: 1300,
  //     currentPrice: 1601,
  //   },
  // ];
  // data.forEach((x: any) => {
  let stoplossIsLarge = false;
  if (+data.stoplossPer > +data.targetPer) {
    stoplossIsLarge = true;
  }
  let maxLength = 0;
  if (stoplossIsLarge) {
    maxLength = 100 / data.stoplossPer;
  } else {
    maxLength = 100 / data.targetPer;
  }
  data.xPer = (data.stoplossPer * maxLength) / 2;
  data.yPer = (data.targetPer * maxLength) / 2;
  data.stoplossIsLarge = stoplossIsLarge;
  // });
  if (data.targetPer === "9.91") {
    console.log({
      stoplossPer: data.stoplossPer,
      targetPer: data.targetPer,
      stoplossIsLarge,
      maxLength,
      xPer: data.xPer,
      yPer: data.yPer,
    });
  }
  return (
    <div>
      <Row
        style={{ margin: "0px 10px 60px 10px" }}
        justify={data.stoplossIsLarge ? "start" : "end"}
      >
        <Col
          style={{
            backgroundColor: "#FF9A8B",

            backgroundImage:
              "linear-gradient(90deg, #c01f2b 0%, #FF6A88 55%, #FF99AC 100%)",

            height: 15,
            width: data.xPer + "%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#444", fontWeight: "bold" }}>
            {data.stoplossPer}%
          </span>
          <LineIndicator data={data} type="stoploss" />
        </Col>
        <Col
          style={{
            backgroundColor: "#85FFBD",
            backgroundImage: "linear-gradient(45deg, #85FFBD 0%, #39e62e 100%)",
            height: 15,
            width: data.yPer + "%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#444", fontWeight: "bold" }}>
            {data.targetPer}%
          </span>
          {/* <span style={{ position: "absolute", top: "100px", left: -15 }}>
                {data.buyPrice}
              </span> */}
          <LineIndicator data={data} type="buy" />
          <LineIndicator data={data} type="current" />
          <LineIndicator data={data} type="target" />
        </Col>
      </Row>
    </div>
  );
};
export default Indicator;
