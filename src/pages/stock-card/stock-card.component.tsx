import {
  Button,
  Card,
  Col,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Progress,
  Row,
  Statistic,
} from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { LineChartOutlined } from "@ant-design/icons";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
import TechIndexChart from "../../components/tech-index-chart.component";
import Indicator from "../indicator/indicator.component";
import moment from "moment";
import StarTwoTone from "@ant-design/icons/lib/icons/StarTwoTone";
import BoxPlotTwoTone from "@ant-design/icons/lib/icons/BoxPlotTwoTone";
import TechIndicator from "../../components/tech-indicator.component";
import { mobileCheck } from "../../helpers/util";
import { AppContext } from "../../providers/app.provider";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

const StockCard = ({ data, onfetch, descriptions, topLeftControls }: any) => {
  // const [data, setData] = useState(dataFromProps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTechIndexVisible, setIsTechIndexVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { orginalDetails } = useContext(AppContext);

  const { techIndex } = data;
  const techColor = `rgba(${techIndex > 50 ? 115 : 255}, ${
    techIndex > 50 ? 209 : 77
  }, ${techIndex > 50 ? 60 : 79}, ${
    techIndex > 50 ? techIndex / 100 : (100 - techIndex) / 100
  })`;

  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        setLoading(true);
        const portfolio = await onfetch();
        if (portfolio.data && portfolio.data.length) {
          // setData(portfolio.data[0]);
        }
        setLoading(false);
      })();
    }
  }, [isModalVisible]);
  const [totalPnl, setTotalPnl] = useState(0);
  useEffect(() => {
    if (
      orginalDetails &&
      orginalDetails.dayPnlList &&
      orginalDetails.dayPnlList.length
    ) {
      const original_day_change_Stock = orginalDetails.dayPnlList.find(
        (x: any) => x.symbol === data.symbol
      );
      if (original_day_change_Stock) {
        const diff = data.day_change - original_day_change_Stock.day_change;
        setTotalPnl(data.pnl + diff);
      } else {
        setTotalPnl(data.pnl);
      }
    }
  }, [data]);
  const isMobile = mobileCheck();

  let progress = 0;
  const currentPrice = data.last_price || data.lastPrice;

  if (!data.pnl) {
    data["pnl"] = data.buyPrice - data.lastPrice;
    console.log('data["pnl"] ', data["pnl"]);
  }
  const buyPrice = data.buy_price || data.buyPrice;
  if (data["pnl"] > 0) {
    progress = ((currentPrice - buyPrice) * 100) / (data.target - buyPrice);
  } else {
    progress =
      -((buyPrice - currentPrice) * 100) /
      (buyPrice - (data.trail_stop_loss || data.stopLoss));
  }
  console.log("progress", progress);
  return (
    <>
      <Card
        headStyle={{ padding: 0, minHeight: 0 }}
        bodyStyle={{ padding: "0px 10px" }}
        title={
          <span style={{ margin: 0 }}>
            <Row justify="space-between" style={{ padding: 2 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <TechIndicator
                  symbol={data.symbol}
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  onClick={() => setIsModalVisible(true)}
                  loading={loading}
                  buttonText={techIndex}
                  techColor={techColor}
                />
                {"   "}
                <Modal
                  title="Tech Index Journey"
                  visible={isTechIndexVisible}
                  onCancel={() => setIsTechIndexVisible(false)}
                  bodyStyle={{ padding: 0 }}
                >
                  <TechIndexChart
                    data={data.indexProgress}
                    isMobile={isMobile}
                  />
                </Modal>

                <Popover
                  overlayInnerStyle={{ display: isMobile ? "none" : "block" }}
                  popupVisible={!isMobile}
                  // visible={true}
                  content={
                    <TechIndexChart
                      data={data.indexProgress}
                      isMobile={isMobile}
                    />
                  }
                  title="Tech Index Journey"
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (isMobile) setIsTechIndexVisible(true);
                    }}
                  >
                    &nbsp;{data.symbol}
                    {"  "}
                    {data.isInPositions && (
                      <StarTwoTone
                        twoToneColor="#ecd620  "
                        style={{ fontSize: "24px" }}
                      />
                    )}
                    {data.t1_quantity > 0 && (
                      <BoxPlotTwoTone
                        twoToneColor="#ecd620  "
                        style={{ fontSize: "24px" }}
                      />
                    )}
                  </span>
                </Popover>
              </span>

              <span>
                {data.day_change && (
                  <span
                    style={{
                      fontSize: 11,
                      color: data.day_change > 0 ? "#73d13d" : "#ff4d4f",
                    }}
                  >
                    {data.day_change.toFixed(2)}
                    <small>{` (${data.day_change_percentage.toFixed(
                      2
                    )}%)`}</small>
                  </span>
                )}
                <Button
                  type="text"
                  size="small"
                  target="_blank"
                  href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
                >
                  <LineChartOutlined />
                </Button>
                {totalPnl && data.change_percentage && (
                  <span style={{ color: totalPnl > 0 ? "#73d13d" : "#ff4d4f" }}>
                    {totalPnl.toFixed(2)}
                    <small>{` (${data.change_percentage.toFixed(2)}%)`}</small>
                  </span>
                )}

                {topLeftControls}
              </span>
            </Row>
          </span>
        }
        bordered={false}
        size="small"
        style={{
          marginBottom: 10,
          backgroundColor:
            progress > 0
              ? `rgba(0, 58, 45, ${+Math.abs(progress) / 100})`
              : `rgba(122, 40, 40, ${+Math.abs(progress) / 100})`,
          borderRadius: 10,
          zoom: -4,
        }}
      >
        <Row justify="space-around">
          <Col lg={17} xs={17} sm={17} md={17}>
            {progress > 0 ? (
              <Progress
                size="small"
                percent={+progress.toFixed(1)}
                status="active"
                strokeColor="#73d13d"
              />
            ) : (
              <Progress
                size="small"
                percent={+Math.abs(progress).toFixed(1)}
                status="active"
                strokeColor="#ff4d4f"
              />
            )}
          </Col>
          <Col lg={5}>
            <Progress
              // type="circle"
              percent={data.timePer}
              steps={10}
              size="small"
              status={
                data["pnl"] < 0 && data.timePer >= 100
                  ? "exception"
                  : data.timePer > 100
                  ? "success"
                  : "active"
              }
              strokeColor={data["pnl"] > 0 ? "#73d13d" : "#ff4d4f"}
            />
          </Col>
        </Row>
        {descriptions}
        <Row>
          <Col lg={24} xs={24} sm={24} xl={24}>
            <Indicator
              data={{
                symbol: data.symbol,
                trailStopLossPer: data.trail_stop_loss_per,
                trailStopLoss: data.trail_stop_loss,
                high_moment: data.high_moment,
                low_moment: data.low_moment,
                stoplossPer: data.stopLossPer,
                targetPer: data.targetPer,

                buyPrice,
                target: data.target,
                stoploss: data.stopLoss,
                currentPrice,
              }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default StockCard;
