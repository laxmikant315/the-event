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

  const mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
      //@ts-ignore
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

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
