import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { hasAllowedAdminSession } from "../utils/adminAccess";

function EditRecommendation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    cost: "", 
    gain: "", 
    description: "", 
    image: null, 
    image2: null, 
    image3: null,
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: ""
  });
  const [previews, setPreviews] = useState({});
  const [showImageHelp, setShowImageHelp] = useState(false);

  const epicImageSources = [
    { name: "Unsplash", url: "https://unsplash.com", desc: "Free high-quality photos" },
    { name: "Pexels", url: "https://www.pexels.com", desc: "Free stock photos" },
    { name: "Pixabay", url: "https://pixabay.com", desc: "Free images & videos" },
    { name: "Picsum Photos", url: "https://picsum.photos", desc: "Random placeholder images (direct URLs)" },
    { name: "Lorem Picsum", url: "https://loremflickr.com", desc: "Random images by category" }
  ];

  useEffect(() => {
    if (!hasAllowedAdminSession()) {
      localStorage.removeItem("admin");
      navigate("/admin");
      return;
    }

    api.get("/api/recommendations")
      .then(res => {
        const rec = res.data.find(item => item.id?.toString() === id);
        if (rec) {
          setRecommendation(rec);
          setForm({
            name: rec.name || "",
            cost: rec.cost || "",
            gain: rec.gain || "",
            description: rec.description || "",
            image: null,
            image2: null,
            image3: null,
            imageUrl: rec.imageUrl || "",
            imageUrl2: rec.imageUrl2 || "",
            imageUrl3: rec.imageUrl3 || ""
          });
        } else {
          alert("Recommendation not found");
          navigate("/recommendations");
        }
      })
      .catch(() => alert("Error loading recommendation"));
  }, [id, navigate]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setForm({ ...form, [field]: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e, field) => {
    const url = e.target.value;
    setForm({ ...form, [field]: url });
    if (url) {
      setPreviews({ ...previews, [field]: url });
    }
  };

  const getImagePreview = (field) => {
    if (form[field] && form[field] instanceof File) {
      return previews[field];
    }
    if (form[field + "Url"] || form[field]) {
      return form[field + "Url"] || form[field];
    }
    return null;
  };

  const updateRecommendation = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("cost", form.cost);
    formData.append("gain", form.gain);
    formData.append("description", form.description);
    
    // Handle files
    if (form.image instanceof File) {
      formData.append("image", form.image);
    } else if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }
    
    if (form.image2 instanceof File) {
      formData.append("image2", form.image2);
    } else if (form.imageUrl2) {
      formData.append("imageUrl2", form.imageUrl2);
    }
    
    if (form.image3 instanceof File) {
      formData.append("image3", form.image3);
    } else if (form.imageUrl3) {
      formData.append("imageUrl3", form.imageUrl3);
    }

    try {
      const res = await api.put(`/api/admin/recommendations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert(res.data);
      navigate(`/recommendation/${id}`);
    } catch (err) {
      alert(err.response?.data || "Error updating recommendation");
    }
  };

  if (!recommendation) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content">
          <p>Loading recommendation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1>Edit Recommendation</h1>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <input
          placeholder="Cost"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <input
          placeholder="Gain"
          value={form.gain}
          onChange={(e) => setForm({ ...form, gain: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ marginBottom: 10 }}
        />

        {/* Image Help Button */}
        <button 
          onClick={() => setShowImageHelp(!showImageHelp)}
          style={{ 
            background: "#0066ff", 
            color: "white", 
            border: "none", 
            padding: "8px 16px", 
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 15,
            fontSize: 14,
            fontWeight: "bold"
          }}
        >
          {showImageHelp ? "✓ Hide Image Resources" : "📸 Get Epic Image Links"}
        </button>

        {/* Image Resources Panel */}
        {showImageHelp && (
          <div style={{
            background: "rgba(0, 102, 255, 0.08)",
            border: "2px solid #0066ff",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20
          }}>
            <h3 style={{ marginTop: 0, color: "#0066ff" }}>📸 Free Epic Image Resources</h3>
            <p style={{ fontSize: 13, color: "#888", marginTop: 5 }}>
              Click on any of these links to download free, high-quality images. Then copy the image URL and paste it below.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {epicImageSources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    background: "rgba(0, 102, 255, 0.1)",
                    border: "1px solid #0066ff",
                    borderRadius: 6,
                    color: "#0066ff",
                    textDecoration: "none",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "rgba(0, 102, 255, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "rgba(0, 102, 255, 0.1)";
                  }}
                >
                  <div>
                    <strong>{source.name}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>{source.desc}</div>
                  </div>
                  <div style={{ fontSize: 16 }}>→</div>
                </a>
              ))}
            </div>
            <div style={{ 
              background: "rgba(255, 193, 7, 0.1)", 
              border: "1px solid #ffc107", 
              padding: 10, 
              borderRadius: 6, 
              marginTop: 12,
              fontSize: 12,
              color: "#666"
            }}>
              <strong style={{ color: "#ff6b00" }}>💡 Pro Tip:</strong> You can use direct image URLs or download images and upload them directly. Either method works!
            </div>
          </div>
        )}

        {/* Image 1 */}
        <div style={{ marginBottom: 20, borderTop: "1px solid #333", paddingTop: 15 }}>
          <h4 style={{ marginTop: 0 }}>📷 Image 1 (Main)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Upload File</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, "image")}
                style={{ marginBottom: 10 }}
              />
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Or Paste Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => handleUrlChange(e, "image")}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
            <div>
              {getImagePreview("image") && (
                <img 
                  src={getImagePreview("image")} 
                  alt="Preview" 
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Image 2 */}
        <div style={{ marginBottom: 20, borderTop: "1px solid #333", paddingTop: 15 }}>
          <h4 style={{ marginTop: 0 }}>📷 Image 2 (Extra)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Upload File</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, "image2")}
                style={{ marginBottom: 10 }}
              />
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Or Paste Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl2}
                onChange={(e) => handleUrlChange(e, "image2")}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
            <div>
              {getImagePreview("image2") && (
                <img 
                  src={getImagePreview("image2")} 
                  alt="Preview" 
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Image 3 */}
        <div style={{ marginBottom: 20, borderTop: "1px solid #333", paddingTop: 15 }}>
          <h4 style={{ marginTop: 0 }}>📷 Image 3 (Extra)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Upload File</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, "image3")}
                style={{ marginBottom: 10 }}
              />
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#aaa" }}>Or Paste Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl3}
                onChange={(e) => handleUrlChange(e, "image3")}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
            <div>
              {getImagePreview("image3") && (
                <img 
                  src={getImagePreview("image3")} 
                  alt="Preview" 
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, borderTop: "1px solid #333", paddingTop: 15 }}>
          <button onClick={updateRecommendation} style={{ marginRight: 10 }}>
            ✅ Save Changes
          </button>
          <button 
            onClick={() => navigate(`/recommendation/${id}`)}
            style={{ background: "#666" }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRecommendation;
