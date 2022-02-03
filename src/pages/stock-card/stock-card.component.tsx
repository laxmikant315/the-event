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
const serverUrl = process.env.REACT_APP_SERVER_URL;

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

  const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;
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

  return (
    <>
      <Modal
        title="Technical"
        footer=""
        width={800}
        bodyStyle={{ height: 400 }}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <iframe
          src={`https://mo.streak.tech/?utm_source=context-menu&utm_medium=kite&stock=NSE:${data.symbol}&theme=dark`}
          style={{ height: "100%", width: "100%", border: 0 }}
        />
      </Modal>
      <Col xs={24} sm={12} md={12} lg={12} xl={6} span={8}>
        <Card
          headStyle={{ padding: 0 }}
          title={
            <span style={{ margin: 0 }}>
              <Row justify="space-between">
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    loading={loading}
                    type="text"
                    size="small"
                    onClick={() => setIsModalVisible(true)}
                    style={{
                      background: techColor,
                    }}
                  >
                    <BarChartOutlined /> {techIndex}
                  </Button>

                  {"   "}
                  <Modal
                    title="Tech Index Journey"
                    visible={isTechIndexVisible}
                    onCancel={() => setIsTechIndexVisible(false)}
                  >
                    <TechIndexChart data={data.indexProgress} />
                  </Modal>
                  <Popover
                    popupVisible={!isMobile}
                    content={<TechIndexChart data={data.indexProgress} />}
                    title="Tech Index Journey"
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (isMobile) setIsTechIndexVisible(true);
                      }}
                    >
                      &nbsp;{data.symbol}{" "}
                      {data.isInPositions && (
                        <StarTwoTone
                          twoToneColor="#ecd620  "
                          style={{ fontSize: "24px" }}
                        />
                      )}
                    </span>
                  </Popover>
                </span>
                <span
                  style={{ color: data["pnl"] > 0 ? "#73d13d" : "#ff4d4f" }}
                >
                  <Button
                    type="text"
                    size="large"
                    target="_blank"
                    href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
                  >
                    <LineChartOutlined />
                  </Button>
                  {data.pnl && data.pnl.toFixed(2)}

                  {topLeftControls}
                </span>
              </Row>
            </span>
          }
          bordered={false}
          size="small"
          style={{ marginBottom: 10 }}
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
      </Col>
    </>
  );
};
export default StockCard;
