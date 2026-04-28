import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import { useLocation, useNavigate } from "react-router-dom";
import { hasAllowedAdminSession } from "../utils/adminAccess";
import { getRecommendationImage, setRecommendationFallback } from "../utils/recommendationImages";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    cost: "",
    gain: "",
    description: "",
    image: null,
    image2: null,
    image3: null
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const [userEdits, setUserEdits] = useState({});
  const [tab, setTab] = useState("overview");

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };
  const handleFile2Change = (e) => {
    setForm({ ...form, image2: e.target.files[0] });
  };
  const handleFile3Change = (e) => {
    setForm({ ...form, image3: e.target.files[0] });
  };

  const loadRecs = async () => {
    const res = await api.get("/api/recommendations");
    setList(Array.isArray(res.data) ? res.data : []);
  };

  const loadUsers = async () => {
    const res = await api.get("/api/admin/users");
    setUsers(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    if (!hasAllowedAdminSession()) {
      localStorage.removeItem("admin");
      navigate("/admin");
      return;
    }
    loadRecs().catch(() => {});
    loadUsers().catch(() => {});
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    if (t === "users" || t === "recs" || t === "add" || t === "overview") {
      setTab(t);
    }
  }, [location.search]);

  const addRecommendation = async () => {
    if (!form.name.trim() || !form.cost.trim() || !form.gain.trim() || !form.description.trim()) {
      alert("Please fill all fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("cost", form.cost);
    formData.append("gain", form.gain);
    formData.append("description", form.description);
    if (form.image) {
      formData.append("image", form.image);
    }
    if (form.image2) {
      formData.append("image2", form.image2);
    }
    if (form.image3) {
      formData.append("image3", form.image3);
    }

    try {
      const res = await api.post("/api/admin/recommendations", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert(res.data);
      setForm({ name: "", cost: "", gain: "", description: "", image: null, image2: null, image3: null });
      await loadRecs();
    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    }
  };

  const del = async (id) => {
    try {
      const res = await api.delete(`/api/admin/recommendations/${id}`);
      alert(res.data);
      await loadRecs();
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const deleteUser = async (u) => {
    const ok = window.confirm(`Delete user "${u.email}"?`);
    if (!ok) return;
    try {
      const res = await api.delete(`/api/admin/users/${u.id}`);
      alert(res.data);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const updateUserField = (id, key, value) => {
    setUserEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value }
    }));
  };

  const saveUser = async (id) => {
    const patch = userEdits[id] || {};
    if (!patch.email && !patch.role && !patch.password) {
      alert("No changes");
      return;
    }
    try {
      const res = await api.put(`/api/admin/users/${id}`, patch);
      if (!res.data) {
        alert("User not found");
        return;
      }
      alert("User updated");
      const newUsers = users.map((u) => (u.id === id ? res.data : u));
      setUsers(newUsers);
      setUserEdits((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const totalUsers = users.length;
  const totalAdmins = useMemo(() => users.filter((u) => u.role === "ADMIN").length, [users]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h1>Admin Dashboard</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ui-btn" onClick={() => { localStorage.removeItem("admin"); navigate("/admin"); }}>
              Logout
            </button>
          </div>
        </div>

        <div className="ui-card" style={{ marginTop: 14 }}>
          <div className="ui-cardBody" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className={`ui-btn ${tab === "overview" ? "ui-btnPrimary" : ""}`} onClick={() => setTab("overview")}>
              Overview
            </button>
            <button className={`ui-btn ${tab === "users" ? "ui-btnPrimary" : ""}`} onClick={() => setTab("users")}>
              Users
            </button>
            <button className={`ui-btn ${tab === "recs" ? "ui-btnPrimary" : ""}`} onClick={() => setTab("recs")}>
              Recommendations
            </button>
            <button className={`ui-btn ${tab === "add" ? "ui-btnPrimary" : ""}`} onClick={() => setTab("add")}>
              Add Recommendation
            </button>
          </div>
        </div>

        {tab === "overview" && (
          <div className="cards" style={{ marginTop: 16 }}>
            <div className="card">
              <h3>Total users</h3>
              <p>All registered accounts.</p>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{totalUsers}</div>
            </div>
            <div className="card">
              <h3>Admins</h3>
              <p>Accounts with admin role.</p>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{totalAdmins}</div>
            </div>
            <div className="card">
              <h3>Recommendations</h3>
              <p>Total improvement ideas.</p>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{list.length}</div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="ui-card" style={{ marginTop: 16 }}>
            <div className="ui-cardBody">
              <h3 style={{ margin: 0 }}>Users</h3>
              <p style={{ margin: "6px 0 12px", color: "rgba(255,255,255,0.72)" }}>
                Edit email / role, optionally reset password.
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                {users.map((u) => {
                  const draft = userEdits[u.id] || {};
                  return (
                    <div key={u.id} className="ui-card">
                      <div className="ui-cardBody">
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{u.email}</div>
                            <div className="ui-label" style={{ marginTop: 6 }}>Role: {u.role || "—"}</div>
                          </div>
                          <div className="ui-actions" style={{ marginTop: 0 }}>
                            <button className="ui-btn" onClick={() => deleteUser(u)}>
                              Delete user
                            </button>
                            <button className="ui-btn ui-btnPrimary" onClick={() => saveUser(u.id)}>
                              Save user
                            </button>
                          </div>
                        </div>

                        <div className="ui-formGrid">
                          <div className="ui-field" style={{ gridColumn: "span 12" }}>
                            <label className="ui-label">Email</label>
                            <input
                              className="ui-input"
                              placeholder={u.email}
                              value={draft.email ?? ""}
                              onChange={(e) => updateUserField(u.id, "email", e.target.value)}
                            />
                          </div>

                          <div className="ui-field">
                            <label className="ui-label">Role</label>
                            <input
                              className="ui-input"
                              placeholder={u.role || "USER"}
                              value={draft.role ?? ""}
                              onChange={(e) => updateUserField(u.id, "role", e.target.value)}
                            />
                          </div>

                          <div className="ui-field">
                            <label className="ui-label">Reset password (optional)</label>
                            <input
                              className="ui-input"
                              type="password"
                              value={draft.password ?? ""}
                              onChange={(e) => updateUserField(u.id, "password", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "add" && (
          <div className="ui-card" style={{ marginTop: 16 }}>
            <div className="ui-cardBody">
              <h3 style={{ margin: 0 }}>Add recommendation</h3>
              <div className="ui-formGrid">
                <div className="ui-field">
                  <label className="ui-label">Name</label>
                  <input className="ui-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="ui-field">
                  <label className="ui-label">Cost</label>
                  <input className="ui-input" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                </div>
                <div className="ui-field">
                  <label className="ui-label">Gain</label>
                  <input className="ui-input" value={form.gain} onChange={(e) => setForm({ ...form, gain: e.target.value })} />
                </div>
                <div className="ui-field" style={{ gridColumn: "span 12" }}>
                  <label className="ui-label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{
                      width: "100%",
                      minHeight: 120,
                      resize: "vertical",
                      padding: "12px 12px",
                      margin: 0,
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: 12,
                      background: "rgba(0,0,0,0.20)",
                      color: "rgba(255,255,255,0.92)",
                      outline: "none"
                    }}
                    placeholder="Explain the improvement and expected benefit"
                  />
                </div>
                <div className="ui-field" style={{ gridColumn: "span 12" }}>
                  <label className="ui-label">Image 1 (optional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="ui-field" style={{ gridColumn: "span 12" }}>
                  <label className="ui-label">Image 2 (optional)</label>
                  <input type="file" accept="image/*" onChange={handleFile2Change} />
                </div>
                <div className="ui-field" style={{ gridColumn: "span 12" }}>
                  <label className="ui-label">Image 3 (optional)</label>
                  <input type="file" accept="image/*" onChange={handleFile3Change} />
                </div>
              </div>
              <div className="ui-actions">
                <button className="ui-btn ui-btnPrimary" onClick={addRecommendation}>
                  Add recommendation
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "recs" && (
          <div className="ui-card" style={{ marginTop: 16 }}>
            <div className="ui-cardBody">
              <h3 style={{ margin: 0 }}>Recommendations</h3>
              <p style={{ margin: "6px 0 12px", color: "rgba(255,255,255,0.72)" }}>
                Manage all recommendations (edit/delete).
              </p>
              {list.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.72)" }}>No recommendations yet.</p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {list.map((item) => (
                    <div
                      key={item.id || item.name}
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 14,
                        padding: 12,
                        display: "grid",
                        gridTemplateColumns: "280px 1fr",
                        gap: 14,
                        alignItems: "center"
                      }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <img
                          src={getRecommendationImage(item, 1)}
                          alt={`${item.name} 1`}
                          onError={(e) => setRecommendationFallback(e, item?.name, 1, 280, 78)}
                          style={{ width: "100%", height: 78, objectFit: "cover", borderRadius: 12 }}
                        />
                        <img
                          src={getRecommendationImage(item, 2)}
                          alt={`${item.name} 2`}
                          onError={(e) => setRecommendationFallback(e, item?.name, 2, 280, 78)}
                          style={{ width: "100%", height: 78, objectFit: "cover", borderRadius: 12 }}
                        />
                        <img
                          src={getRecommendationImage(item, 3)}
                          alt={`${item.name} 3`}
                          onError={(e) => setRecommendationFallback(e, item?.name, 3, 280, 78)}
                          style={{ width: "100%", height: 78, objectFit: "cover", borderRadius: 12 }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{item.name}</div>
                          <div style={{ marginTop: 4, color: "rgba(255,255,255,0.72)" }}>
                            Cost: {item.cost} • Gain: {item.gain}
                          </div>
                        </div>
                        {item.id && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="ui-btn" onClick={() => navigate(`/recommendation/${item.id}/edit`)}>
                              Edit
                            </button>
                            <button className="ui-btn" onClick={() => del(item.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;