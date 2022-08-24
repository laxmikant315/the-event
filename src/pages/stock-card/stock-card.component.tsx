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
import { useEffect, useState } from "react";

import { LineChartOutlined } from "@ant-design/icons";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
import TechIndexChart from "../../components/tech-index-chart.component";
import Indicator from "../indicator/indicator.component";
import moment from "moment";
import StarTwoTone from "@ant-design/icons/lib/icons/StarTwoTone";
import BoxPlotTwoTone from "@ant-design/icons/lib/icons/BoxPlotTwoTone";
import TechIndicator from "../../components/tech-indicator.component";
import { mobileCheck } from "../../helpers/util";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

const StockCard = ({
  data: dataFromProps,
  onfetch,
  descriptions,
  topLeftControls,
}: any) => {
  const [data, setData] = useState(dataFromProps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTechIndexVisible, setIsTechIndexVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
          setData(portfolio.data[0]);
        }
        setLoading(false);
      })();
    }
  }, [isModalVisible]);
  const isMobile = mobileCheck();
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
                {data.pnl && (
                  <span
                    style={{ color: data["pnl"] > 0 ? "#73d13d" : "#ff4d4f" }}
                  >
                    {data.pnl.toFixed(2)}
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
            data["progress"] > 0
              ? `rgba(0, 58, 45, ${+Math.abs(data["progress"]) / 100})`
              : `rgba(122, 40, 40, ${+Math.abs(data["progress"]) / 100})`,
          borderRadius: 10,
          zoom: -4,
        }}
      >
        <Row justify="space-around">
          <Col lg={17} xs={17} sm={17} md={17}>
            {data["pnl"] > 0 ? (
              <Progress
                size="small"
                percent={+data["progress"].toFixed(1)}
                status="active"
                strokeColor="#73d13d"
              />
            ) : (
              <Progress
                percent={+Math.abs(data["progress"]).toFixed(1)}
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
                trailStopLossPer: data.trail_stop_loss_per,
                trailStopLoss: data.trail_stop_loss,
                high_moment: data.high_moment,
                low_moment: data.low_moment,
                stoplossPer: data.stopLossPer,
                targetPer: data.targetPer,

                buyPrice: data.buy_price ? data.buy_price : data.buyPrice,
                target: data.target,
                stoploss: data.stopLoss,
                currentPrice: data.last_price
                  ? data.last_price
                  : data.lastPrice,
              }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default StockCard;
