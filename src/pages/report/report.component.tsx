import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Popconfirm,
  Popover,
  Radio,
  Row,
  Skeleton,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { ReloadOutlined, NotificationOutlined } from "@ant-design/icons";
import moment from "moment";
import StockCard from "../stock-card/stock-card.component";
import AlertStockCard from "../alerts/alerts-stock-card.component";
import type { RadioChangeEvent } from "antd";
import Chart from "./chart.component";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/main";
const Report = () => {
  const [data, setData] = useState<any>({});
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<any>([]);
  const getData = () => async () => {
    setLoading(true);
    const ds = await axios.get(`${serverUrl}/report`, {
      timeout: 100000,
    });
    setData(ds.data);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData()();
    })();
  }, [index, refresh]);
  const [selected, setSelected] = useState("day");
  const onChange = async ({ target: { value } }: RadioChangeEvent) => {
    setSelected(value);
  };
  const options = [
    { label: "Daily", value: "day" },
    { label: "Weekly", value: "week" },
    { label: "Monthly", value: "month" },
    { label: "Yearly", value: "year" },
  ];

  const options2 = [
    { label: "Today", value: "day" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];
  return (
    <div
      className="site-card-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ marginLeft: 20 }}>
            Report
          </Title>
        </Col>
        <Col>
          <Space></Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ overflow: "auto", height: "100%" }}>
        <Col lg={24} xs={24} sm={24} xl={24}>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <Radio.Group
                      options={options}
                      onChange={onChange}
                      value={selected}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Table
                      size="small"
                      pagination={{ pageSize: 15 }}
                      dataSource={
                        data[selected] &&
                        data[selected].map((x: any) => ({
                          date:
                            selected === "month"
                              ? moment(x[0]).format("MMM YYYY")
                              : selected === "year"
                              ? moment(x[0]).format("YYYY")
                              : moment(x[0]).format("DD MMM YYYY"),
                          pl: "₹ " + x[1],
                        }))
                      }
                      columns={[
                        {
                          title: "Date",
                          dataIndex: "date",
                          key: "date",
                        },
                        {
                          title: "Profit Loss (₹)",
                          dataIndex: "pl",
                          key: "pl",
                          render: (text) => {
                            let color =
                              +text.split(" ")[1] > 0 ? "green" : "red";
                            return (
                              <Tag color={color} key={text}>
                                {text}
                              </Tag>
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexDirection: "column",
                  }}
                >
                  {options2.map((x) => {
                    const text =
                      data && x.value in data
                        ? data[x.value][0][1].toString()
                        : " ";

                    let color = +text.split(" ")[0] > 0 ? "green" : "red";
                    return (
                      <Card style={{}}>
                        <Statistic
                          title={x.label}
                          valueRender={() => {
                            return (
                              <Tag
                                color={color}
                                key={text}
                                style={{ fontSize: 25, padding: 10 }}
                              >
                                {"₹ " + text}
                              </Tag>
                            );
                          }}
                          precision={2}
                        />
                      </Card>
                    );
                  })}

                  {/* <Card>
                    <Statistic
                      title="This Week"
                      value={"₹ " + data["week"][0][1]}
                      precision={2}
                    />
                  </Card>{" "}
                  <Card>
                    <Statistic
                      title="This Month"
                      value={"₹ " + data["month"][0][1]}
                      precision={2}
                    />
                  </Card>{" "}
                  <Card>
                    <Statistic
                      title="This Year"
                      value={"₹ " + data["year"][0][1]}
                      precision={2}
                    />
                  </Card>{" "} */}
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <Chart
                    data={data[selected]}
                    selected={selected}
                    style={{ height: 100 }}
                  />
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default Report;
