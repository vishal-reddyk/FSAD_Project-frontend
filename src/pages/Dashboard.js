import { useEffect, useMemo, useState } from "react";
import api from "../api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [data, setData] = useState({});
  const [propertyCount, setPropertyCount] = useState(0);
  const [latestProperty, setLatestProperty] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ city: "", area: "", address: "", pincode: "" });

  const userDisplayName = useMemo(() => {
    const email = localStorage.getItem("user") || "";
    if (!email) return "";
    const name = email.split("@")[0] || email;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, []);

  useEffect(() => {
    api.get("/api/dashboard")
      .then(res => setData(res.data))
      .catch(() => alert("Error loading dashboard"));

    api.get("/api/property")
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setPropertyCount(list.length);
        if (list.length > 0) {
          const latest = list[list.length - 1];
          setLatestProperty(latest);
          setEditForm({
            city: latest.city || "",
            area: latest.area || "",
            address: latest.address || "",
            pincode: latest.pincode || ""
          });
        }
      })
      .catch(() => {
        setPropertyCount(0);
      });
  }, []);

  const refreshProperties = async () => {
    const res = await api.get("/api/property");
    const list = Array.isArray(res.data) ? res.data : [];
    setPropertyCount(list.length);
    const latest = list.length ? list[list.length - 1] : null;
    setLatestProperty(latest);
    if (latest) {
      setEditForm({
        city: latest.city || "",
        area: latest.area || "",
        address: latest.address || "",
        pincode: latest.pincode || ""
      });
    }
  };

  const deleteLatest = async () => {
    if (!latestProperty?.id) {
      alert("No property to delete");
      return;
    }
    const ok = window.confirm("Delete your latest submitted property?");
    if (!ok) return;
    try {
      await api.delete(`/api/property/${latestProperty.id}`);
      alert("Property deleted");
      setEditing(false);
      await refreshProperties();
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const saveLatest = async () => {
    if (!latestProperty?.id) {
      alert("No property to update");
      return;
    }
    try {
      await api.put(`/api/property/${latestProperty.id}`, editForm);
      alert("Property updated");
      setEditing(false);
      await refreshProperties();
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h1>User Dashboard</h1>
          {userDisplayName && (
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              Logged in as <strong style={{ color: "rgba(255,255,255,0.95)" }}>{userDisplayName}</strong>
            </div>
          )}
        </div>

        <div className="cards">
          <div className="card">
            <h3>Estimated Value</h3>
            <p>Your current estimated home value.</p>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{data.value || "—"}</div>
          </div>
          <div className="card">
            <h3>Potential Gain</h3>
            <p>What you may gain after improvements.</p>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{data.gain || "—"}</div>
          </div>
          <div className="card">
            <h3>Submitted Properties</h3>
            <p>Total properties you submitted.</p>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{propertyCount}</div>
          </div>
          <div className="card">
            <h3>Improvements</h3>
            <p>Progress on recommended improvements.</p>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{data.improvements || "—"}</div>
          </div>
        </div>

        {latestProperty && (
          <div className="ui-card" style={{ marginTop: 18 }}>
            <div className="ui-cardBody">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Latest Submitted Property</h3>
                  <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.72)" }}>
                    Review and update your latest submission.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="ui-btn" onClick={() => setEditing((v) => !v)}>
                    {editing ? "Cancel" : "Edit"}
                  </button>
                  <button className="ui-btn" onClick={deleteLatest}>
                    Delete
                  </button>
                </div>
              </div>

              {editing ? (
                <>
                  <div className="ui-formGrid">
                    <div className="ui-field">
                      <label className="ui-label">City</label>
                      <input
                        className="ui-input"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      />
                    </div>
                    <div className="ui-field">
                      <label className="ui-label">Area</label>
                      <input
                        className="ui-input"
                        value={editForm.area}
                        onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                      />
                    </div>
                    <div className="ui-field" style={{ gridColumn: "span 12" }}>
                      <label className="ui-label">Address</label>
                      <input
                        className="ui-input"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                    <div className="ui-field">
                      <label className="ui-label">Pincode</label>
                      <input
                        className="ui-input"
                        inputMode="numeric"
                        value={editForm.pincode}
                        onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="ui-actions">
                    <button className="ui-btn ui-btnPrimary" onClick={saveLatest}>
                      Save changes
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div className="ui-label">City</div>
                    <div>{latestProperty.city}</div>
                  </div>
                  <div>
                    <div className="ui-label">Area</div>
                    <div>{latestProperty.area}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div className="ui-label">Address</div>
                    <div>{latestProperty.address}</div>
                  </div>
                  <div>
                    <div className="ui-label">Pincode</div>
                    <div>{latestProperty.pincode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;