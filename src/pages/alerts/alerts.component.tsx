import {
  Badge,
  Button,
  Card,
  Col,
  InputNumber,
  Modal,
  notification,
  Popover,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Descriptions } from "antd";
import Title from "antd/lib/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import LineChartOutlined from "@ant-design/icons/lib/icons/LineChartOutlined";
import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import TechIndexChart from "../../components/tech-index-chart.component";
import Indicator from "../indicator/indicator.component";
import StockCard from "../stock-card/stock-card.component";
import AlertStockCard from "./alerts-stock-card.component";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

// const StockCard1 = ({
//   data: dataFromProps,
//   index,
//   refresh,
//   setRefresh,
// }: any) => {
//   const [data, setData] = useState(dataFromProps);
//   const { progress, last_price, techIndex } = JSON.parse(
//     data.additionalInfo || "{}"
//   );
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const techColor = `rgba(${techIndex > 50 ? 115 : 255}, ${
//     techIndex > 50 ? 209 : 77
//   }, ${techIndex > 50 ? 60 : 79}, ${
//     techIndex > 50 ? techIndex / 100 : (100 - techIndex) / 100
//   })`;
//   const [refreshCard, setRefreshCard] = useState(0);

//   useEffect(() => {
//     if (refreshCard || isModalVisible) {
//       (async () => {
//         setLoading(true);
//         const alerts = await axios.get(
//           `${serverUrl}/alerts/${index}/True/${data.id}`
//         );
//         if (alerts.data && alerts.data.length) {
//           setData(alerts.data[0]);
//         }
//         setLoading(false);
//       })();
//     }
//   }, [refreshCard, isModalVisible]);

//   const [loading, setLoading] = useState(false);

//   return (
//     <>
//       <Modal
//         title="Technical"
//         footer=""
//         width={800}
//         bodyStyle={{ height: 400 }}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//       >
//         <iframe
//           src={`https://mo.streak.tech/?utm_source=context-menu&utm_medium=kite&stock=NSE:${data.symbol}&theme=dark`}
//           style={{ height: "100%", width: "100%", border: 0 }}
//         />
//       </Modal>
//       <Col xs={24} sm={12} md={12} lg={8} xl={6} span={8}>
//         <Card
//           title={
//             <Row justify="space-between">
//               <span>
//                 <Button
//                   type="text"
//                   size="small"
//                   loading={loading}
//                   onClick={() => setIsModalVisible(true)}
//                   style={{
//                     background: techColor,
//                   }}
//                 >
//                   <BarChartOutlined /> {techIndex}
//                 </Button>

//                 <Popover
//                   content={<TechIndexChart data={data.indexProgress} />}
//                   title="Tech Index Journey"
//                 >
//                   <span style={{ cursor: "pointer" }}> {data.symbol}</span>
//                 </Popover>
//               </span>
//               <span>
//                 <Button
//                   type="text"
//                   icon={<ReloadOutlined />}
//                   loading={loading}
//                   onClick={() => setRefreshCard(refreshCard + 1)}
//                 />
//                 <Button
//                   type="text"
//                   size="small"
//                   target="_blank"
//                   href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${data.symbol}`}
//                 >
//                   <LineChartOutlined />
//                 </Button>
//               </span>
//             </Row>
//           }
//           bordered={false}
//           size="small"
//           style={{ marginBottom: 20 }}
//         >
//           <Row justify="space-around">
//             <Col lg={17} xs={17} sm={17} md={17}>
//               {progress > 0 && (
//                 <Progress
//                   percent={+progress.toFixed(1)}
//                   status="active"
//                   strokeColor="#73d13d"
//                 />
//               )}
//               {progress < 0 && (
//                 <Progress
//                   percent={+Math.abs(progress).toFixed(1)}
//                   status="active"
//                   strokeColor="#ff4d4f"
//                 />
//               )}
//             </Col>
//             <Col lg={5}>
//               <Progress
//                 // type="circle"
//                 percent={data.timePer}
//                 steps={10}
//                 size="small"
//                 status={
//                   data["pnl"] < 0 && data.timePer >= 100
//                     ? "exception"
//                     : data.timePer > 100
//                     ? "success"
//                     : "active"
//                 }
//                 strokeColor={data["pnl"] > 0 ? "#73d13d" : "#ff4d4f"}
//               />
//             </Col>
//           </Row>

//           <Row>
//             <Col lg={24} xs={24} sm={24} xl={24}>
//               <Indicator
//                 data={{
//                   stoplossPer: data.stopLossPer,
//                   targetPer: data.targetPer,

//                   buyPrice: data.buyPrice,
//                   target: data.target,
//                   stoploss: data.stopLoss,
//                   currentPrice: last_price,
//                 }}
//               />
//             </Col>
//           </Row>
//         </Card>
//       </Col>
//     </>
//   );
// };

const Alerts = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const alerts = await axios.get(
        `${serverUrl}/alerts/${index}/${isUpdate ? "True" : "False"}`,
        { timeout: 100000 }
      );
      const datesSet: any = new Set(
        alerts.data.map((x: any) => x["date_created"].slice(0, 10))
      );
      setDates([...datesSet]);
      setData(alerts.data);
      setLoading(false);
    })();
  }, [index, isUpdate, refresh]);
  return (
    <div
      className="site-card-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ marginLeft: 20 }}>
            Watchlist
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => setRefresh(refresh + 1)}
            />
            <Switch
              checkedChildren="Sync On"
              unCheckedChildren="Sync Off"
              defaultChecked={isUpdate}
              loading={loading}
              onClick={() => setIsUpdate(!isUpdate)}
            />

            <Button onClick={() => setIndex(index - 1)} disabled={index <= 0}>
              Prev
            </Button>
            <Button onClick={() => setIndex(index + 1)}>Next</Button>
          </Space>
        </Col>
      </Row>
      <Row
        justify="center"
        gutter={20}
        style={{ overflow: "auto", height: "100%" }}
      >
        <Col lg={24}>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              {dates &&
                dates.map((date: string) => {
                  const filtered = data.filter(
                    (x: any) => x["date_created"].slice(0, 10) === date
                  );
                  return (
                    <Row
                      justify="center"
                      style={{
                        margin: 20,
                        background: "#00000047",
                        borderRadius: 10,
                      }}
                    >
                      <Col>
                        <Title level={5}>
                          {" "}
                          {moment(date).format("DD MMM YYYY")}
                        </Title>
                      </Col>
                      <Col lg={24} xs={24} sm={24} xl={24}>
                        <Row
                          gutter={16}
                          justify="center"
                          style={{ overflow: "auto", height: "100%" }}
                        >
                          {filtered.map(
                            (item: any) => (
                              <Col
                                xs={24}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={6}
                                span={8}
                              >
                                <AlertStockCard
                                  item={item}
                                  index={index}
                                  setRefresh={setRefresh}
                                  refresh={refresh}
                                />
                              </Col>
                            )
                            // <StockCard
                            //   index={index}
                            //   data={item}
                            //   setRefresh={setRefresh}
                            //   refresh={refresh}
                            // />
                          )}
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Alerts;
