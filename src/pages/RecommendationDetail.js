import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { hasAllowedAdminSession } from "../utils/adminAccess";
import { getRecommendationImage, setRecommendationFallback } from "../utils/recommendationImages";

function RecommendationDetail() {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const navigate = useNavigate();
  const isAdmin = hasAllowedAdminSession();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/api/recommendations")
      .then(res => {
        const rec = res.data.find(item => item.id?.toString() === id);
        if (rec) {
          setRecommendation(rec);
        } else {
          alert("Recommendation not found");
          navigate("/recommendations");
        }
      })
      .catch(() => alert("Error loading recommendation"));
  }, [id, navigate]);

  if (!recommendation) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button className="ui-btn" onClick={() => navigate("/recommendations")}>
            ← Back
          </button>
          <h1 style={{ margin: 0 }}>{recommendation.name}</h1>
        </div>

        <div className="ui-card">
          <div className="ui-cardBody">
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 14, alignItems: "start" }}>
              <div>
                <img
                  src={getRecommendationImage(recommendation, 1)}
                  alt={recommendation.name}
                  onError={(e) => setRecommendationFallback(e, recommendation.name, 1, 900, 600)}
                  style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 14 }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                  <img
                    src={getRecommendationImage(recommendation, 2)}
                    alt={`${recommendation.name} extra 1`}
                    onError={(e) => setRecommendationFallback(e, recommendation.name, 2, 800, 600)}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 14 }}
                  />
                  <img
                    src={getRecommendationImage(recommendation, 3)}
                    alt={`${recommendation.name} extra 2`}
                    onError={(e) => setRecommendationFallback(e, recommendation.name, 3, 800, 600)}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 14 }}
                  />
                </div>
              </div>

              <div>
                <div className="ui-card" style={{ marginBottom: 12 }}>
                  <div className="ui-cardBody">
                    <div className="ui-label">Estimated cost</div>
                    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{recommendation.cost || "—"}</div>
                  </div>
                </div>
                <div className="ui-card" style={{ marginBottom: 12 }}>
                  <div className="ui-cardBody">
                    <div className="ui-label">Expected gain</div>
                    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{recommendation.gain || "—"}</div>
                  </div>
                </div>

                <div className="ui-card">
                  <div className="ui-cardBody">
                    <div className="ui-label">What you get</div>
                    <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.78)" }}>
                      {recommendation.description || "—"}
                    </p>
                  </div>
                </div>

                <div className="ui-actions">
                  {isAdmin && (
                    <button className="ui-btn" onClick={() => navigate(`/recommendation/${id}/edit`)}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendationDetail;