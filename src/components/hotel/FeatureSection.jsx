/* ============================================== */
/*  FEATURE SECTION */
/* ============================================== */

import "./FeatureSection.css";
import {
  ShieldCheck,
  Headphones,
  BadgeDollarSign,
  Hotel,
  Star,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: <BadgeDollarSign size={40} />,
    title: "Giá tốt nhất",
    description:
      "So sánh hàng nghìn khách sạn để mang đến mức giá tối ưu cho bạn.",
  },
  {
    icon: <Headphones size={40} />,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Thanh toán an toàn",
    description: "Bảo mật thông tin với hệ thống thanh toán chuẩn quốc tế.",
  },
  {
    icon: <Hotel size={40} />,
    title: "Hàng nghìn khách sạn",
    description: "Khám phá khách sạn, resort và homestay trên toàn Việt Nam.",
  },
  {
    icon: <Star size={40} />,
    title: "Đánh giá uy tín",
    description:
      "Hệ thống review minh bạch từ khách hàng đã trải nghiệm thực tế.",
  },
  {
    icon: <CreditCard size={40} />,
    title: "Đặt phòng nhanh chóng",
    description: "Chỉ vài bước đơn giản để hoàn tất đặt phòng trực tuyến.",
  },
];

const FeatureSection = () => {
  return (
    <section className="features-section">
      <div className="features-header">
        <span className="features-badge">STAYVN TRUSTED</span>

        <h2>
          Tại sao hàng nghìn khách hàng chọn
          <span> StayVN?</span>
        </h2>

        <p>
          Nền tảng đặt khách sạn hiện đại, an toàn và đáng tin cậy cho mọi
          chuyến đi của bạn.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-bottom">
        <div className="bottom-card">
          <h3>10K+</h3>
          <p>Khách sạn toàn quốc</p>
        </div>

        <div className="bottom-card">
          <h3>50K+</h3>
          <p>Khách hàng hài lòng</p>
        </div>

        <div className="bottom-card">
          <h3>99%</h3>
          <p>Tỷ lệ đặt phòng thành công</p>
        </div>

        <div className="bottom-card">
          <h3>24/7</h3>
          <p>Hỗ trợ khách hàng</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
