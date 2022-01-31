import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const TechIndexChart = ({ data }: any) => (
  <LineChart
    width={400}
    height={200}
    data={
      data &&
      data.split(",").map((x: any, i: number) => ({
        name: i + 1,
        value: x,
      }))
    }
  >
    <Line type="linear" dataKey="value" stroke="#8884d8" strokeWidth={2} />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="name" />
    <YAxis domain={[0, 100]} />
  </LineChart>
);

export default TechIndexChart;
