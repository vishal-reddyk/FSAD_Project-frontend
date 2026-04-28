import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import { hasAllowedAdminSession } from "../utils/adminAccess";

function Sidebar() {
  const isAdmin = hasAllowedAdminSession();
  const isUser = !!localStorage.getItem("user");
  const isRealAdminSession = isAdmin && !isUser;

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
  };

  return (
    <div className="sidebar">
      <h2>GharValue</h2>

      {isUser && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/submit">Submit Property</Link>
          <Link to="/recommendations">Recommendations</Link>
        </>
      )}

      {isRealAdminSession && (
        <>
          <Link to="/admin-dashboard">Admin Dashboard</Link>
          <Link to="/admin-dashboard?tab=users">Manage Users</Link>
          <Link to="/admin-dashboard?tab=recs">Manage Recommendations</Link>
        </>
      )}

      <Link to="/login" onClick={logout}>
        Logout
      </Link>
    </div>
  );
}

export default Sidebar;