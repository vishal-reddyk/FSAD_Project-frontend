import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import "../styles/landing.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <TopNav />
      <main className="landingMain">
        <section className="hero">
          <div className="heroCopy">
            <h1>Know your home’s value. Improve it smartly.</h1>
            <p>
              Submit your property details, understand value & gain, and get improvement recommendations with clear
              cost/benefit.
            </p>
            <div className="heroActions">
              <button className="heroBtn heroBtnPrimary" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="heroBtn" onClick={() => navigate("/register")}>
                Create account
              </button>
            </div>
          </div>

          <div className="heroCard">
            <div className="stat">
              <div className="statLabel">Estimated Value</div>
              <div className="statValue">₹85L</div>
            </div>
            <div className="stat">
              <div className="statLabel">Potential Gain</div>
              <div className="statValue">₹10.2L</div>
            </div>
            <div className="stat">
              <div className="statLabel">Quick improvements</div>
              <div className="statValue">3 ideas</div>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>What you can do</h2>
          <div className="featureGrid">
            <div className="feature">
              <div className="featureTitle">Dashboard</div>
              <div className="featureText">Understand value, gain, and your latest submitted property at a glance.</div>
            </div>
            <div className="feature">
              <div className="featureTitle">Submit Property</div>
              <div className="featureText">Add your city/area/address/pincode and track it in your profile.</div>
            </div>
            <div className="feature">
              <div className="featureTitle">Recommendations</div>
              <div className="featureText">See improvement ideas with images, cost, gain and details.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

