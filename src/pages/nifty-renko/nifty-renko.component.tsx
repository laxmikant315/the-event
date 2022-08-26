import {
  Button,
  Card,
  Col,
  Modal,
  Popover,
  Radio,
  Row,
  Statistic,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

import { LineChartOutlined } from "@ant-design/icons";

import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import TechIndicator from "../../components/tech-indicator.component";
import { getTechColor } from "../alerts/alerts-stock-card.component";
import TechIndexChart from "../../components/tech-index-chart.component";
import { mobileCheck } from "../../helpers/util";

const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (payload && payload.length) {
    payload = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{ background: "#141414bf", padding: 10, borderRadius: 10 }}
      >
        {/* {JSON.stringify(payload)} */}
        <p className="label">{`Date : ${label}`}</p>
        <p className="label">{`RENKO : ${payload.value}`}</p>
        {/* <p className="intro">{getIntroOfPage(label)}</p> */}
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }
  return <></>;
};
const NiftyRenko = () => {
  const [allData, setAllData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [off, setOff] = useState();
  const [latestRenko, setLatestRenko] = useState(0);
  const [techIndex, setTechIndex] = useState("");

  useEffect(() => {
    (async () => {
      // setLoading(true);
      const alerts = await axios.get(`${serverUrl}/scan`);
      const rawData = alerts.data.nifty_renko;
      const allData: any = Object.keys(rawData).map((x) => ({
        name: moment.unix(+x / 1000).format("DD/MM/YYYY"),
        value: rawData[x],
      }));
      console.log("data", data);
      setTechIndex(alerts.data.nifty_tech_index);
      setAllData(allData);
      // setLoading(false);
    })();
  }, []);

  const [selectedValue, setSelectedValue] = useState("60");
  useEffect(() => {
    if (selectedValue === "max") {
      setData(allData);
    } else {
      setData(allData.slice(-+selectedValue));
    }
  }, [selectedValue, allData]);

  const gradientOffset = (data: any) => {
    const dataMax = Math.max(...data.map((i: any) => i.value));
    const dataMin = Math.min(...data.map((i: any) => i.value));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  useEffect(() => {
    if (data.length) {
      const off: any = gradientOffset(data);
      console.log("off", off);
      setOff(off);
      const latestRenko = data[data.length - 1].value;
      setLatestRenko(latestRenko);
    }
  }, [data]);
  const [visible, setVisible] = useState(false);
  const options = [
    { label: "30 days", value: "30" },
    { label: "60 days", value: "60" },
    { label: "90 days", value: "90" },
    { label: "365 days", value: "365" },
    { label: "Max", value: "max" },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const latestTechIndex =
    (techIndex && techIndex.split(",").slice(-1)[0]) || "";
  console.log("techIndex", techIndex);
  const techColor = (techIndex && getTechColor(+latestTechIndex)) || "";

  const [isTechIndexVisible, setIsTechIndexVisible] = useState(false);
  const isMobile = mobileCheck();
  return techIndex ? (
    <>
      <Modal
        title="Tech Index Journey"
        visible={isTechIndexVisible}
        onCancel={() => setIsTechIndexVisible(false)}
        bodyStyle={{ padding: 0 }}
      >
        <TechIndexChart data={techIndex} isMobile={isMobile} />
      </Modal>

      <Button
        type="text"
        size="small"
        target="_blank"
        href={`https://in.tradingview.com/chart/i6VwIssE/?symbol=NSE%3A${"NIFTY"}`}
      >
        <LineChartOutlined />
      </Button>

      {/* <Card size="small"> */}
      <span
        onClick={() => setVisible(true)}
        style={{ cursor: "pointer", marginRight: 5 }}
      >
        <Button
          type="text"
          shape="round"
          icon={
            <>
              R{latestRenko > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </>
          }
          size={"small"}
          style={{ backgroundColor: latestRenko > 0 ? "#3f8600" : "#cf1322" }}
        >
          {latestRenko}
        </Button>
      </span>
      {/* </Card> */}
      <TechIndicator
        symbol={"NIFTY 500"}
        buttonText={latestTechIndex}
        techColor={techColor}
        category="INDICES"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onClick={() => setIsModalVisible(true)}
      />
      <Popover
        overlayInnerStyle={{ display: isMobile ? "none" : "block" }}
        popupVisible={!isMobile}
        // visible={true}
        content={<TechIndexChart data={techIndex} isMobile={isMobile} />}
        title="Tech Index Journey"
      >
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (isMobile) setIsTechIndexVisible(true);
          }}
        >
          &nbsp;
          <AreaChartOutlined />
        </span>
      </Popover>
      <Modal
        title={
          <>
            Nifty Renko{" "}
            <Button
              type="ghost"
              size="small"
              target="_blank"
              style={{ margin: "0 10px" }}
              href={`https://trademachine.herokuapp.com/api/v1/main/scanNifty`}
            >
              Scan
            </Button>
            <Radio.Group
              options={options}
              onChange={(e) => setSelectedValue(e.target.value)}
              value={selectedValue}
              optionType="button"
            />
          </>
        }
        centered
        footer={false}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1} />
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000"
                fill="url(#splitColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </>
  ) : null;
};
export default NiftyRenko;
