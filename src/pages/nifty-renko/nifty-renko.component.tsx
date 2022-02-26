import { Button, Card, Col, Modal, Row, Statistic } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
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

const serverUrl = process.env.REACT_APP_SERVER_URL;

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
  const [data, setData] = useState<any>([]);
  const [off, setOff] = useState();
  const [latestRenko, setLatestRenko] = useState(0);

  useEffect(() => {
    (async () => {
      // setLoading(true);
      const alerts = await axios.get(`${serverUrl}/scan`);
      const rawData = alerts.data;
      const data: any = Object.keys(rawData).map((x) => ({
        name: moment.unix(+x / 1000).format("DD/MM/YYYY"),
        value: rawData[x],
      }));
      console.log("data", data);
      setData(data);
      // setLoading(false);
    })();
  }, []);

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
  return (
    <>
      {/* <Card size="small"> */}
      <span onClick={() => setVisible(true)} style={{ cursor: "pointer" }}>
        <Button
          type="text"
          shape="round"
          icon={latestRenko > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          size={"large"}
          style={{ backgroundColor: latestRenko > 0 ? "#3f8600" : "#cf1322" }}
        >
          {latestRenko}
        </Button>
      </span>
      {/* </Card> */}

      <Modal
        title="Nifty Renko"
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
  );
};
export default NiftyRenko;
