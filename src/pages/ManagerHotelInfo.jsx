import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";

import hotelService from "../services/hotelService";
import reviewService from "../services/reviewService";
import locationService from "../services/locationService";

import { HOTEL_STATUS_TEXT } from "../constants/hotelStatus";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

import avatar from "../assets/avatar.jpg";

export default function ManagerHotelInfo() {
  const { hotelId } = useParams();
  const location = useLocation();

  /* =========================================================
      STATE
  ========================================================= */

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState({codeName: "", name: ""});
  const [selectedWard, setSelectedWard] = useState({codeName: "", name: ""});
  const [isDirty, setIsDirty] = useState(false);

  /* =========================================================
      FORM DATA
  ========================================================= */

  const [formData, setFormData] = useState({
    name: "",
    street: "",
    description: "",
    amenities: "",
    checkInTime: "",
    checkOutTime: "",
  });

  /* =========================================================
      FETCH HOTEL
  ========================================================= */

  useEffect(() => {
    let mounted = true;
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const myHotel = await hotelService.getMyHotels();
            if (mounted && myHotel && (!hotelId || String(myHotel._id) === String(hotelId))) 
            {
              setHotel(myHotel);
              return;
            }
          } catch (e) {}
        }
        const hotelData = await hotelService.getHotelById(hotelId);
        if (mounted) {
          setHotel(hotelData);
        }
      } catch (error) {
        if (mounted) {
          setHotel(null);
        }
      }
    };

    fetchHotel();

    return () => {
      mounted = false;
    };
  }, [hotelId]);

  /* =========================================================
      SET FORM DATA WHEN HOTEL CHANGES
  ========================================================= */

  useEffect(() => {
    if (!hotel) return;

    setFormData({
      name: hotel.name || "",
      street: hotel.address?.street || "",
      description: hotel.description || "",
      amenities: hotel.amenities?.join(", ") || "",
      checkInTime: hotel.checkInTime || "",
      checkOutTime: hotel.checkOutTime || "",
    });
  }, [hotel]);

  /* =========================================================
      FETCH CITIES
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchCities = async () => {
      try {
        const cityData = await locationService.getCities();
        if (mounted) {
          setCities(cityData || []);
        }
      } catch (e) {}
    };

    fetchCities();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
      FETCH REVIEWS
  ========================================================= */

  useEffect(() => {
    if (!hotelId) return;

    let mounted = true;
    const fetchReviews = async (showLoading = false) => {
      try {
        if (showLoading) {
          setReviewsLoading(true);
        }
        const data = await reviewService.getHotelReviews(hotelId, 1, 100);
        if (!mounted) return;
        setReviews(data?.reviews || []);
        const updatedHotel = await hotelService.getHotelById(hotelId);
        if (mounted) {
          setHotel(updatedHotel);
        }
      } catch (e) {
        if (mounted) {
          setReviews([]);
        }
      } finally {
        if (mounted && showLoading) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews(true);

    const intervalId = setInterval(() => {
      fetchReviews(false);
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [hotelId]);

  /* =========================================================
      HANDLERS
  ========================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  };

  const handleCityChange = async (e) => {
    const codeName = e.target.value;
    const cityObj = cities.find(
      (city) => city.codeName === codeName
    );

    if (!cityObj) return;

    setSelectedCity({codeName: cityObj.codeName, name: cityObj.name});
    setSelectedWard({codeName: "", name: ""});
    setWards([]);

    try {
      const wardData = await locationService.getWards(cityObj.codeName);
      setWards(wardData || []);
    } catch (e) {
      setWards([]);
    }

    setIsDirty(true);
  };

  const handleWardChange = (e) => {
    const codeName = e.target.value;
    const wardObj = wards.find((ward) => ward.codeName === codeName);

    if (!wardObj) return;

    setSelectedWard({codeName: wardObj.codeName, name: wardObj.name});
    setIsDirty(true);
  };

  const handleDeleteHotel = () => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${
        hotel?.name || "khách sạn"
      }? Hành động này không thể hoàn tác.`
    );

    if (confirmed) {
      hotelService.DeleteHotel(hotel._id);
    }
  };

  /* =========================================================
      SUBMIT UPDATE
  ========================================================= */

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {};

      if (formData.name?.trim()) {
        submitData.name = formData.name;
      }

      const address = {};
      if (formData.street?.trim()) {
        address.street = formData.street;
      }
      if (selectedCity.name?.trim()) {
        address.city = selectedCity.name;
      }
      if (selectedWard.name?.trim()) {
        address.ward = selectedWard.name;
      }
      if (Object.keys(address).length > 0) {
        submitData.address = address;
      }

      const amenitiesArray = formData.amenities
        ?.split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      if (amenitiesArray?.length > 0) {
        submitData.amenities = amenitiesArray;
      }

      const token = localStorage.getItem("token");
      const updatedHotel = await hotelService.updateHotel(submitData, token);
      alert("Cập nhật thành công");

      setHotel(updatedHotel.data);
      setSelectedCity({codeName: "", name: ""});
      setSelectedWard({codeName: "", name: ""});
      setIsDirty(false);
    } catch (error) {
      alert(
        "Cập nhật thất bại: " +
          (error?.response?.data?.message ||
            error.message)
      );
    }
  };

  /* =========================================================
      RENDER
  ========================================================= */

  return (
    <div className="manager-dashboard">
      {/* =====================================================
            HEADER
      ===================================================== */}
      <section className="manager-page-header" style={{ display: "flex" }}>
        <div>
          <p className="eyebrow">Thông tin khách sạn</p>
          <h1>Hồ sơ {hotel ? hotel.name : "..."}</h1>
          <p>Cập nhật thông tin, hình ảnh và tiện ích hiển thị cho khách hàng.</p>
        </div>

        <div className="gm-review-stars">
          {Array.from({ length: 5 }).map((_, i) => {
            const rating = hotel?.avgRating || 0;
            let className = "gm-big-star";

            if (i + 1 <= rating) {
              className += " filled";
            } else if (i + 0.5 <= rating) {
              className += " half";
            }

            return (
              <span key={i} className={className}>★</span>
            );
          })}
        </div>
      </section>

      {/* =====================================================
            MAIN GRID
      ===================================================== */}

      <div className="manager-grid">

        {/* =================================================
              HOTEL PROFILE
        ================================================= */}

        <Card className="hotel-profile">
          <div
            className="hotel-cover"
            style={{
              backgroundImage: `url(${hotel?.image?.[0]?.url || "https://via.placeholder.com/600x300"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="hotel-cover-overlay">
              {hotel?.name || "..."}
            </div>
          </div>

          <div className="profile-list">
            <div>
              <span>Tên khách sạn</span>
              <strong>{hotel?.name || "-"}</strong>
            </div>

            <div>
              <span>Đánh giá trung bình</span>
              <strong>
                {hotel?.avgRating !== null ? `${hotel?.avgRating} / 5` : "-"}
                <span className="gm-star filled">{" "}★</span>
              </strong>
            </div>

            <div>
              <span>Địa chỉ</span>
              <strong>
                {hotel?.address ? `${hotel.address.street}, ${hotel.address.ward}, ${hotel.address.city}` : "-"}
              </strong>
            </div>

            <div>
              <span>Trạng thái</span>
              <strong className="status-pill approved">
                {hotel ? HOTEL_STATUS_TEXT[hotel.status] : "-"}
              </strong>
            </div>

            <div>
              <span>Mô tả</span>
              <strong>{hotel?.description || "-"}</strong>
            </div>

            <div>
              <span>Tiện ích</span>
              <strong>{hotel?.amenities?.join(", ") || "-"}</strong>
            </div>

            <div>
              <span>Check-in</span>
              <strong>{hotel?.checkInTime || "-"}</strong>
            </div>

            <div>
              <span>Check-out</span>
              <strong>{hotel?.checkOutTime || "-"}</strong>
            </div>

            <div>
              <span>Giá cao nhất</span>
              <strong>{hotel ? formatCurrency(hotel.maxPrice) : "-"}</strong>
            </div>

            <div>
              <span>Giá thấp nhất</span>
              <strong>{hotel ? formatCurrency(hotel.minPrice) : "-"}</strong>
            </div>
          </div>
        </Card>

        {/* =================================================
              UPDATE FORM
        ================================================= */}

        <Card className="management-card">
          <div className="section-title">
            <div>
              <p className="eyebrow">Cập nhật hồ sơ</p>
              <h2>Thông tin hiển thị</h2>
            </div>
          </div>

          <form className="manager-form" onSubmit={handleUpdateSubmit}>
            <label>
              Tên khách sạn
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Địa chỉ
              <input
                name="street"
                value={formData.street}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Tỉnh / Thành phố
              <select
                value={selectedCity.codeName}
                onChange={handleCityChange}
              >
                <option value="">
                  {hotel?.address?.city || "Chọn tỉnh/thành"}
                </option>

                {cities.map((city) => (
                  <option
                    key={city.codeName}
                    value={city.codeName}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Phường / Xã
              <select
                value={selectedWard.codeName}
                onChange={handleWardChange}
              >
                <option value="">
                  {hotel?.address?.ward || "Chọn phường/xã"}
                </option>

                {wards.map((ward) => (
                  <option
                    key={ward.codeName}
                    value={ward.codeName}
                  >
                    {ward.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Mô tả
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Tiện ích
              <input
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Thời gian check-in
              <input
                type="text"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Thời gian check-out
              <input
                type="text"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleInputChange}
              />
            </label>

            <Button type="submit" disabled={!isDirty}>Lưu cập nhật</Button>
          </form>
        </Card>
      </div>

      {/* =====================================================
            REVIEWS
      ===================================================== */}

      <Card className="management-card" id="reviews">
        <div className="section-title">
          <div>
            <p className="eyebrow">Đánh giá</p>
            <h2>Danh sách đánh giá khách hàng</h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{fontSize: 18, fontWeight: 700}}>
              {hotel?.avgRating !== null ? `${hotel?.avgRating} / 5` : "-"}
              <span className="gm-star filled">{" "}★</span>
            </div>

            <small>
              {hotel?.totalReviews || 0} đánh giá
            </small>
          </div>
        </div>

        <div className="gm-review-list">
          {reviewsLoading ? (<p>Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (<p>Chưa có đánh giá</p>
          ) : (
            reviews.map((review) => (
              <article key={review._id || review.id} className="gm-review-item">
                <img className="gm-review-avatar" src={avatar} alt="Avatar"/>

                <div className="gm-review-body">
                  <div className="gm-review-header">
                    <div className="gm-review-meta">
                      <span className="gm-review-name">
                        {`${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim()}
                      </span>

                      <span className="gm-review-date">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="gm-review-stars">
                      {Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <span key={i} className={i < Math.round(review.rating || 0) ? "gm-star filled" : "gm-star"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="gm-review-text">
                    {review.comment}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </Card>

      {/* =====================================================
            DANGER ZONE
      ===================================================== */}

      <Card className="danger-zone">
        <div>
          <p className="eyebrow">Khu vực nguy hiểm</p>
          <h2>Xóa khách sạn</h2>
          <p>Xóa dữ liệu khách sạn sẽ không thể khôi phục lại.</p>
        </div>

        <div className="danger-actions">
          <Button variant="danger" onClick={handleDeleteHotel}>
            Xóa khách sạn
          </Button>
        </div>
      </Card>
    </div>
  );
}