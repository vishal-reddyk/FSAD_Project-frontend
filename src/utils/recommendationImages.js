import api from "../api";

const DEFAULT_RECOMMENDATION_IMAGES = {
  kitchen: [
    "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  bathroom: [
    "https://images.pexels.com/photos/6585761/pexels-photo-6585761.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5998138/pexels-photo-5998138.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  livingroom: [
    "https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6957083/pexels-photo-6957083.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/7534226/pexels-photo-7534226.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  exterior: [
    "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  lighting: [
    "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6585607/pexels-photo-6585607.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  balcony: [
    "https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6489117/pexels-photo-6489117.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6758774/pexels-photo-6758774.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ],
  fallback: [
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200"
  ]
};

function getCategoryKey(name = "") {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes("kitchen")) return "kitchen";
  if (normalized.includes("bathroom")) return "bathroom";
  if (normalized.includes("living")) return "livingroom";
  if (normalized.includes("floor")) return "livingroom";
  if (normalized.includes("exterior")) return "exterior";
  if (normalized.includes("paint")) return "exterior";
  if (normalized.includes("lighting")) return "lighting";
  if (normalized.includes("light")) return "lighting";
  if (normalized.includes("balcony")) return "balcony";

  return "fallback";
}

export function getDefaultRecommendationImage(name, index = 1) {
  const categoryKey = getCategoryKey(name);
  const images = DEFAULT_RECOMMENDATION_IMAGES[categoryKey] || DEFAULT_RECOMMENDATION_IMAGES.fallback;
  return images[Math.max(0, Math.min(index - 1, images.length - 1))];
}

export function toAbsoluteImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = api.defaults.baseURL || "http://localhost:8080";
  return `${base}${url}`;
}

export function getRecommendationImage(item, index = 1) {
  const key = index === 1 ? "imageUrl" : index === 2 ? "imageUrl2" : "imageUrl3";
  return toAbsoluteImageUrl(item?.[key]) || getDefaultRecommendationImage(item?.name, index);
}

export function setRecommendationFallback(event, name, index, width, height) {
  const img = event.currentTarget;
  if (img.dataset.fallback === "true") {
    img.onerror = null;
    return;
  }

  img.onerror = null;
  img.src = getDefaultRecommendationImage(name, index);
  img.dataset.fallback = "true";

  if (!img.src) {
    const text = encodeURIComponent("No Image");
    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='%23fff' font-family='Arial,Helvetica,sans-serif' font-size='24' text-anchor='middle' dominant-baseline='central'%3E${text}%3C/text%3E%3C/svg%3E`;
  }
}
