import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";

function Submit() {
  const [form, setForm] = useState({
    city: "",
    area: "",
    address: "",
    pincode: ""
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const validate = () => {
    const next = {};
    if (!form.city.trim()) next.city = "City is required";
    if (!form.area.trim()) next.area = "Area is required";
    if (!form.address.trim()) next.address = "Address is required";
    if (!form.pincode.trim()) next.pincode = "Pincode is required";
    if (form.pincode.trim() && !/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Pincode must be 6 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }
    try {
      const res = await api.post("/api/property", form);
      alert(res.data);
      setForm({ city: "", area: "", address: "", pincode: "" });
      setErrors({});
    } catch {
      alert("Error saving property");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Submit Property</h1>

        <div className="ui-card">
          <div className="ui-cardBody">
            <div className="ui-formGrid">
              <div className="ui-field">
                <label className="ui-label">City</label>
                <input
                  className="ui-input"
                  placeholder="e.g. Mumbai"
                  value={form.city}
                  onChange={(e) => {
                    setForm({ ...form, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: "" });
                  }}
                />
                {!!errors.city && <div className="ui-label" style={{ color: "rgba(255,120,120,0.95)" }}>{errors.city}</div>}
              </div>

              <div className="ui-field">
                <label className="ui-label">Area</label>
                <input
                  className="ui-input"
                  placeholder="e.g. Andheri West"
                  value={form.area}
                  onChange={(e) => {
                    setForm({ ...form, area: e.target.value });
                    if (errors.area) setErrors({ ...errors, area: "" });
                  }}
                />
                {!!errors.area && <div className="ui-label" style={{ color: "rgba(255,120,120,0.95)" }}>{errors.area}</div>}
              </div>

              <div className="ui-field" style={{ gridColumn: "span 12" }}>
                <label className="ui-label">Address</label>
                <input
                  className="ui-input"
                  placeholder="Street / Landmark"
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                />
                {!!errors.address && (
                  <div className="ui-label" style={{ color: "rgba(255,120,120,0.95)" }}>{errors.address}</div>
                )}
              </div>

              <div className="ui-field">
                <label className="ui-label">Pincode</label>
                <input
                  className="ui-input"
                  inputMode="numeric"
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={(e) => {
                    setForm({ ...form, pincode: e.target.value });
                    if (errors.pincode) setErrors({ ...errors, pincode: "" });
                  }}
                />
                {!!errors.pincode && (
                  <div className="ui-label" style={{ color: "rgba(255,120,120,0.95)" }}>{errors.pincode}</div>
                )}
              </div>
            </div>

            <div className="ui-actions">
              <button className="ui-btn ui-btnPrimary" onClick={submit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;