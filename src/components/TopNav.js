import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/topnav.css";

function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="brand">
          GharValue
        </Link>

        <nav className="links">
          <Link className={isActive("/")} to="/">
            Home
          </Link>
          <Link className={isActive("/about")} to="/about">
            About
          </Link>
          <Link className={isActive("/features")} to="/features">
            Features
          </Link>
        </nav>

        <div className="actions">
          {user || admin ? (
            <>
              {user && (
                <button className="navBtn" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
              )}
              {admin && (
                <button className="navBtn" onClick={() => navigate("/admin-dashboard")}>
                  Admin
                </button>
              )}
              <button className="navBtn navBtnPrimary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="navBtn navBtnPrimary" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
