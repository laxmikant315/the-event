import { Col, Row, Tooltip } from "antd";
import "./indicator.css";
import { useEffect, useState } from "react";

const LineIndicator = ({ data, type }: any) => {
  const [state, setState] = useState<any>({});

  const getValues = (diff: any, per: any, currentPrice: any, buyPrice: any) => {
    let left: any = 0,
      right: any = 0;
    if (diff < 0) {
      left = "auto";
      right = per < -100 ? 101 : per > 100 ? -101 : -per;
    } else {
      left = per < -100 ? -101 : per > 100 ? 101 : per;
      right = "auto";
    }

    if (diff > 0) {
      per = Math.abs(100 - (currentPrice * 100) / buyPrice);
    } else {
      per = -(100 - (currentPrice * 100) / buyPrice);
    }
    return { left, right, per };
  };

  useEffect(() => {
    let left: any = 0,
      right: any = 0,
      zIndex: any = 0,
      width: any = "1px",
      backgroundColor = "",
      className = "",
      borderColor = "",
      fontColor = "",
      border = "",
      value = 0,
      currentPer = 0,
      marginLeft = 0,
      marginRight = 0;

    let top = 20;
    let height = 120;
    if (type === "target") {
      left = "auto";
      right = 0;
      backgroundColor = "#6fca3b";
      value = data.target && data.target.toFixed(2);
    } else if (type === "stoploss") {
      left = 0;
      right = "auto";
      backgroundColor = "#f46d6f";
      value = data.stoploss && data.stoploss.toFixed(2);
    } else if (type === "trail_stoploss") {
      const diff = data.trailStopLoss - data.stoploss;

      const total = data.buyPrice - data.stoploss;
      const per = (diff * 100) / total;

      const values = getValues(diff, per, data.trailStopLoss, data.stoploss);
      console.log("ccc", diff, total, per, values);
      left = values.left;
      right = values.right;
      currentPer = values.per;

      backgroundColor = "#f1494b";
      value = data.trailStopLoss && data.trailStopLoss.toFixed(2);
      top = 32;
      width = "2px";
      height = 160;
    } else if (type === "buy") {
      left = 0;
      right = "auto";
      backgroundColor = "#dadacc";
      value = data.buyPrice && data.buyPrice.toFixed(2);
    } else if (type === "current") {
      const diff = data.currentPrice - data.buyPrice;
      const total =
        diff > 0 ? data.target - data.buyPrice : data.buyPrice - data.stoploss;
      const per = (diff * 100) / total;
      const values = getValues(diff, per, data.currentPrice, data.buyPrice);
      left = values.left;
      right = values.right;
      currentPer = values.per;
      fontColor = "#ffe549c7";
      value = data.currentPrice && data.currentPrice.toFixed(2);
      top = -22;
      className =
        "in_progress " +
        (diff > 0 ? "in_progress_positive" : "in_progress_negative");
      if (diff > 0) {
        left = 0;
        width = values.left + "%";
        backgroundColor = "#73d13d";
      } else {
        right = 0;
        width = values.right + "%";
        backgroundColor = "#f1494b";
      }
      height = 140;
    } else if (type === "high_moment") {
      const diff = data.high_moment - data.buyPrice;
      const total = data.target - data.buyPrice;
      const per = (diff * 100) / total;
      const values = getValues(diff, per, data.high_moment, data.buyPrice);
      left = 0;
      right = values.right;
      width = values.left + "%";
      currentPer = values.per;
      fontColor = "#73d13da3";
      backgroundColor = "#73d13da3";
      borderColor = "#73d13da3";
      zIndex = -1;
      value = data.high_moment && data.high_moment.toFixed(2);
      top = -34;
      // border = "5px solid";
      height = 170;
      marginLeft = 10;
    } else if (type === "low_moment") {
      const diff = data.low_moment - data.buyPrice;
      const total = data.buyPrice - data.stoploss;
      const per = (diff * 100) / total;
      const values = getValues(diff, per, data.buyPrice, data.low_moment);
      left = values.left;
      right = 0;
      width = values.right + "%";
      currentPer = values.per;
      borderColor = "#ff4d4f6b";
      fontColor = "#ff4d4f6b";
      backgroundColor = "#ff4d4f6b";
      zIndex = -1;
      value = data.low_moment && data.low_moment.toFixed(2);
      top = -34;
      // border = "5px solid";
      height = 170;
      marginRight = 10;
    }
    setState({
      left,
      right,
      backgroundColor,
      value,
      top,
      height,
      currentPer,
      width,
      zIndex,
      borderColor,
      fontColor,
      border,
      className,
      marginLeft,
      marginRight,
    });
  }, []);
  return (
    <>
      <Tooltip placement="topLeft" title={state.value}>
        <span
          className="value"
          style={{
            top: state.top,
            // backgroundColor: "#181818",
            borderRadius: 5,
            marginLeft: state.marginLeft,
            marginRight: state.marginRight,
            left:
              (type === "current"
                ? data.currentPer < 0
                  ? state.left
                  : state.left > 53
                  ? 53
                  : state.left - 15
                : state.left) + "%",
            right:
              (type === "current"
                ? data.currentPer > 0
                  ? state.right
                  : state.right > 29
                  ? 29
                  : state.right - 25
                : state.right) + "%",
            color: state.fontColor || state.backgroundColor,
          }}
        >
          {state.value}
          {type === "current" && state.currentPer && (
            <span
              style={{ color: state.currentPer > 0 ? "#83e44c" : "#ff6163" }}
            >
              {" (" + state.currentPer.toFixed(2) + "%)"}
            </span>
          )}
        </span>
      </Tooltip>
      <span
        className={`line ${state.className}`}
        style={{
          left: state.left + "%",
          right: state.right + "%",
          height: state.height + "%",
          width: state.width,
          backgroundColor: state.backgroundColor,
          border: state.border,
          borderColor: state.borderColor,
          borderRadius: 0,
          zIndex: state.zIndex,
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
  const isInProfit = data.currentPrice > data.buyPrice;
  // console.log({ isInProfit, data });
  data.xPer = (data.stoplossPer * maxLength) / 2;
  data.yPer = (data.targetPer * maxLength) / 2;
  data.stoplossIsLarge = stoplossIsLarge;
  // });

  return (
    <div>
      <Row
        style={{ margin: "0px 10px 30px 10px" }}
        justify={data.stoplossIsLarge ? "start" : "end"}
      >
        <Col
          className="block stoploss"
          style={{
            width: data.xPer + "%",
          }}
        >
          <span className="percent stoploss">{data.stoplossPer}%</span>
          <LineIndicator data={data} type="stoploss" />
          <LineIndicator data={data} type="trail_stoploss" />
          <LineIndicator data={data} type="low_moment" />
          {!isInProfit && <LineIndicator data={data} type="current" />}
        </Col>
        <Col className="block target" style={{ width: data.yPer + "%" }}>
          <span className="percent target">{data.targetPer}%</span>
          {/* <span style={{ position: "absolute", top: "100px", left: -15 }}>
                {data.buyPrice}
              </span> */}
          <LineIndicator data={data} type="high_moment" />
          <LineIndicator data={data} type="buy" />

          <LineIndicator data={data} type="target" />
          {isInProfit && <LineIndicator data={data} type="current" />}
        </Col>
      </Row>
    </div>
  );
};
export default Indicator;
