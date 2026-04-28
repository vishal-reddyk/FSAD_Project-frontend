import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { hasAllowedAdminSession } from "../utils/adminAccess";
import { getRecommendationImage, setRecommendationFallback } from "../utils/recommendationImages";

function Recommendations() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const isAdmin = hasAllowedAdminSession();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/api/recommendations")
      .then(res => setList(res.data))
      .catch(() => alert("Error loading recommendations"));

  }, [navigate]);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Recommendations</h1>
        <p style={{ marginTop: -6, color: "rgba(255,255,255,0.72)" }}>
          Pick an improvement to see full details, extra photos, and expected gain.
        </p>
        <div className="cards">
          {list.map((item, index) => (
            <div className="card" key={index} style={{ position: 'relative' }}>
              <div onClick={() => item.id && navigate(`/recommendation/${item.id}`)} style={{ cursor: item.id ? 'pointer' : 'default' }}>
                <img
                  src={getRecommendationImage(item, 1)}
                  alt={item.name}
                  onError={(e) => setRecommendationFallback(e, item?.name, 1, 900, 600)}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <img
                    src={getRecommendationImage(item, 2)}
                    alt={`${item.name} preview 2`}
                    onError={(e) => setRecommendationFallback(e, item?.name, 2, 800, 600)}
                    style={{ width: "100%", height: 84, objectFit: "cover", borderRadius: 12, opacity: 0.95 }}
                  />
                  <img
                    src={getRecommendationImage(item, 3)}
                    alt={`${item.name} preview 3`}
                    onError={(e) => setRecommendationFallback(e, item?.name, 3, 800, 600)}
                    style={{ width: "100%", height: 84, objectFit: "cover", borderRadius: 12, opacity: 0.95 }}
                  />
                </div>
                <h3>{item.name}</h3>
                <p>Cost: {item.cost}</p>
                <p>Gain: {item.gain}</p>
              </div>
              {isAdmin && item.id && (
                <button
                  className="ui-btn"
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recommendation/${item.id}/edit`);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;