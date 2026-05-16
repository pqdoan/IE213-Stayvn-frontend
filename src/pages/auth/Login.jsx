/* ==============================================
   LOGIN PAGE
============================================== */

import "../../styles/Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Star,
  Clock3,
  CreditCard,
} from "lucide-react";

import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Vui lòng nhập email";
    }

    if (!formData.password.trim()) {
      return "Vui lòng nhập mật khẩu";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      setError("");

      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.login(payload);

      localStorage.setItem("token", response.data?.data?.token);

      // localStorage.setItem("user", JSON.stringify(response.data?.data));
      localStorage.setItem("user", JSON.stringify(response.data?.data?.user));

      navigate("/");
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-banner">
          <div className="login-banner-overlay"></div>

          {/* BADGE */}
          <div className="login-banner-badge">👋 Welcome Back</div>

          {/* TITLE */}
          <h1 className="login-banner-title">
            Tiếp tục hành trình
            <span> nghỉ dưỡng </span>
            của bạn
          </h1>

          <p className="login-banner-desc">
            Quản lý booking, khám phá ưu đãi và trải nghiệm hàng nghìn khách sạn
            cao cấp trên khắp Việt Nam.
          </p>

          {/* BOOKING CARD */}
          <div className="login-booking-card">
            <div className="login-booking-top">
              <div>
                <h3>Fusion Resort Phú Quốc</h3>

                <p>
                  <MapPin size={15} />
                  Phú Quốc, Kiên Giang
                </p>
              </div>

              <div className="login-booking-rating">
                <Star size={15} fill="#FFD54A" />
                4.9
              </div>
            </div>

            <div className="login-booking-info">
              <div className="login-booking-item">
                <CalendarDays size={16} />

                <div>
                  <span>Check-in</span>
                  <strong>20/06/2026</strong>
                </div>
              </div>

              <div className="login-booking-item">
                <Clock3 size={16} />

                <div>
                  <span>Thời gian</span>
                  <strong>3 đêm</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="login-feature-list">
            <div className="login-feature-box">
              <ShieldCheck size={18} />
              <span>Bảo mật tuyệt đối</span>
            </div>

            <div className="login-feature-box">
              <CreditCard size={18} />
              <span>Thanh toán an toàn</span>
            </div>

            <div className="login-feature-box">
              <Star size={18} />
              <span>Ưu đãi thành viên</span>
            </div>
          </div>

          {/* REVIEW */}
          <div className="login-review-box">
            <div className="login-review-stars">⭐ ⭐ ⭐ ⭐ ⭐</div>

            <p>
              “StayVN giúp tôi đặt phòng cực kỳ nhanh chóng và chuyên nghiệp.”
            </p>

            <span>— Minh Anh, TP.HCM</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-card">
            {/* LOGO */}
            <div className="login-logo">
              <Building2 size={34} />
              <h1>StayVN</h1>
            </div>

            {/* TITLE */}
            <h2>Đăng nhập</h2>

            <p className="login-subtitle">
              Đăng nhập để tiếp tục sử dụng hệ thống đặt phòng cao cấp, đạt
              chuẩn quốc tế.
            </p>

            {/* ERROR */}
            {error && <div className="login-error">{error}</div>}

            {/* FORM */}
            <form onSubmit={handleSubmit} autoComplete="on">
              {/* EMAIL */}
              <div className="login-form-group">
                <label>Email</label>

                <div className="login-input-wrapper">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Nhập email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="login-form-group">
                <label>Mật khẩu</label>

                <div className="login-input-wrapper">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />

                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="login-options">
                <label className="login-remember-me">
                  <input type="checkbox" />

                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <Link to="/forgot-password" className="login-forgot-link">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* BUTTON */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* FOOTER */}
            <div className="login-footer">
              Chưa có tài khoản?
              <Link to="/register"> Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
