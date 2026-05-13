/* ==============================================
   REGISTER PAGE
============================================== */

import "../../styles/Register.css";

import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import authService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  /* ==========================================
      STATES
  ========================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ==========================================
      HANDLE CHANGE
  ========================================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ==========================================
      PASSWORD STRENGTH
  ========================================== */

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) return "";

    let score = 0;

    if (password.length >= 6) score++;

    if (password.match(/[A-Z]/)) score++;

    if (password.match(/[0-9]/)) score++;

    if (password.match(/[^A-Za-z0-9]/)) score++;

    if (score <= 1) return "weak";

    if (score <= 3) return "medium";

    return "strong";
  }, [formData.password]);

  /* ==========================================
      VALIDATE
  ========================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      return "Vui lòng nhập email";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      return "Vui lòng nhập số điện thoại";
    }

    if (!formData.password) {
      return "Vui lòng nhập mật khẩu";
    }

    if (formData.password.length < 6) {
      return "Mật khẩu tối thiểu 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }

    return "";
  };

  /* ==========================================
      SUBMIT
  ========================================== */

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

      const fullName = formData.name.trim();

      const nameParts = fullName.split(" ");

      const firstName = nameParts.pop();

      const lastName = nameParts.join(" ");

      const payload = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      const response = await authService.register(payload);

      console.log(response.data);

      navigate("/login");
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* ======================================
            LEFT SIDE
        ====================================== */}

        <div className="register-banner">
          <div className="banner-gradient"></div>

          <div className="floating-card card-1">
            <Star size={18} />

            <span>Được đánh giá cao</span>
          </div>

          <div className="floating-card card-2">
            <ShieldCheck size={18} />

            <span>Bảo mật tuyệt đối</span>
          </div>

          <div className="floating-card card-3">
            <Sparkles size={18} />

            <span>Luxury Experience</span>
          </div>

          <div className="banner-content">
            <div className="banner-badge">✨ Nền tảng đặt phòng cao cấp</div>

            <h1>
              Khám phá những
              <span> khách sạn tuyệt vời </span>
              trên khắp Việt Nam
            </h1>

            <p>
              Đặt phòng nhanh chóng, trải nghiệm nghỉ dưỡng đẳng cấp với hàng
              nghìn khách sạn, resort và homestay cao cấp.
            </p>

            {/* STATS */}

            <div className="banner-stats">
              <div className="banner-stat">
                <h3>10K+</h3>

                <span>Khách sạn</span>
              </div>

              <div className="banner-stat">
                <h3>50K+</h3>

                <span>Khách hàng</span>
              </div>

              <div className="banner-stat">
                <h3>24/7</h3>

                <span>Hỗ trợ</span>
              </div>
            </div>

            {/* FEATURES */}

            <div className="banner-features">
              <div className="feature-item">
                <CheckCircle2 size={18} />

                <span>🏨 Resort & khách sạn cao cấp</span>
              </div>

              <div className="feature-item">
                <CheckCircle2 size={18} />

                <span>💎 Giá tốt & nhiều ưu đãi</span>
              </div>

              <div className="feature-item">
                <CheckCircle2 size={18} />

                <span>⚡ Đặt phòng cực nhanh</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <div className="register-right">
          <div className="register-card">
            {/* LOGO */}

            <div className="register-logo">
              <Building2 size={34} />

              <h1>StayVN</h1>
            </div>

            {/* TITLE */}

            <h2>Tạo tài khoản mới</h2>

            <p className="register-subtitle">
              Đăng ký để bắt đầu hành trình du lịch của bạn
            </p>

            {/* ERROR */}

            {error && <div className="register-error">{error}</div>}

            {/* FORM */}

            <form onSubmit={handleSubmit} autoComplete="on">
              {/* NAME */}

              <div className="form-group">
                <label>Họ và tên</label>

                <div className="input-wrapper">
                  <User size={18} />

                  <input
                    type="text"
                    placeholder="Nhập họ tên"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label>Email</label>

                <div className="input-wrapper">
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

              {/* PHONE */}

              <div className="form-group">
                <label>Số điện thoại</label>

                <div className="input-wrapper">
                  <Phone size={18} />

                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label>Mật khẩu</label>

                <div className="input-wrapper">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}

                {formData.password && (
                  <div className="password-strength">
                    <div className={`strength-bar ${passwordStrength}`}></div>

                    <span className={passwordStrength}>
                      {passwordStrength === "weak" && "Mật khẩu yếu"}

                      {passwordStrength === "medium" && "Mật khẩu trung bình"}

                      {passwordStrength === "strong" && "Mật khẩu mạnh"}
                    </span>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="form-group">
                <label>Xác nhận mật khẩu</label>

                <div className="input-wrapper">
                  <Lock size={18} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* FOOTER */}

            <div className="register-footer">
              Đã có tài khoản?
              <Link to="/login"> Đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
