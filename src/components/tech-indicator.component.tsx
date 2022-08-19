import { Button, Modal } from "antd";

import BarChartOutlined from "@ant-design/icons/lib/icons/BarChartOutlined";
const TechIndicator = ({
  symbol,
  visible,
  onCancel,
  onClick,
  category = "NSE",
  techColor,
  buttonText,
  loading,
}: {
  symbol: string;
  visible: boolean;
  onCancel: any;
  onClick: any;
  category?: "NSE" | "INDICES";
  techColor?: string;
  buttonText?: string;
  loading?: boolean;
}) => (
  <>
    <Button
      loading={loading}
      type="text"
      size="small"
      onClick={onClick}
      style={{
        background: techColor,
      }}
    >
      <BarChartOutlined /> {buttonText}
    </Button>
    <Modal
      title="Technical"
      footer=""
      width={800}
      bodyStyle={{ height: 400 }}
      visible={visible}
      onCancel={onCancel}
    >
      <iframe
        src={`https://mo.streak.tech/?utm_source=context-menu&utm_medium=kite&stock=${category}:${encodeURIComponent(
          symbol
        )}&theme=dark`}
        style={{ height: "100%", width: "100%", border: 0 }}
      />
    </Modal>
  </>
);

export default TechIndicator;
