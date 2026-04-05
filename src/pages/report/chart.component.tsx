import moment from "moment";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const gradientOffset = (data: any) => {
	const dataMax = Math.max(...data.map((i: any) => i.pl));
	const dataMin = Math.min(...data.map((i: any) => i.pl));

	if (dataMax <= 0) {
		return 0;
	}
	if (dataMin >= 0) {
		return 1;
	}

	return dataMax / (dataMax - dataMin);
};

const CustomTooltip = ({ payload, label }: any) => {
	if (payload?.length) {
		payload = payload[0].payload;
		return (
			<div
				className="custom-tooltip"
				style={{ background: "#141414bf", padding: 10, borderRadius: 10 }}
			>
				{/* {JSON.stringify(payload)} */}
				<p className="label">{`${label}`}</p>
				<p className="label">{`Profit Loss : ${payload.pl}`}</p>
				{/* <p className="intro">{getIntroOfPage(label)}</p> */}
				{/* <p className="desc">Anything you want can be displayed here.</p> */}
			</div>
		);
	}
	return null;
};

export default ({ data, selected }: any) => {
	const finalData =
		(data?.length &&
			data.map((x: any) => {
				const name =
					selected === "month"
						? moment(x[0]).format("MMM YYYY")
						: selected === "year"
							? moment(x[0]).format("YYYY")
							: moment(x[0]).format("DD MMM YYYY");
				return { name, pl: x[1] };
			})) ||
		[];

	const off = gradientOffset(finalData);
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				width={500}
				height={400}
				data={finalData.reverse()}
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
				{/* <Tooltip /> */}
				<Tooltip content={<CustomTooltip />} />
				<defs>
					<linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
						<stop offset={off} stopColor="green" stopOpacity={1} />
						<stop offset={off} stopColor="red" stopOpacity={1} />
					</linearGradient>
				</defs>
				<Area
					type="monotone"
					dataKey="pl"
					stroke="#000"
					fill="url(#splitColor)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};
