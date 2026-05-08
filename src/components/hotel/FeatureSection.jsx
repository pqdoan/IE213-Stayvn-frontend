import "./FeatureSection.css";
import { FaMoneyBillWave, FaHeadset, FaLock, FaHotel } from "react-icons/fa";

const FeatureSection = () => {
  const features = [
    {
      icon: <FaMoneyBillWave />,
      title: "Giá tốt nhất",
      description: "Luôn mang đến mức giá cạnh tranh và ưu đãi hấp dẫn.",
    },
    {
      icon: <FaHeadset />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc.",
    },
    {
      icon: <FaLock />,
      title: "Thanh toán an toàn",
      description: "Bảo mật tuyệt đối thông tin và giao dịch của bạn.",
    },
    {
      icon: <FaHotel />,
      title: "Hàng nghìn khách sạn",
      description: "Lựa chọn phong phú từ khắp Việt Nam và quốc tế.",
    },
  ];

  return (
    <section className="features">
      <h2>Tại sao chọn StayVN?</h2>
      <div className="feature-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
