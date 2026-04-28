import TopNav from "../components/TopNav";
import "../styles/landing.css";

function Features() {
  return (
    <div className="landing">
      <TopNav />
      <main className="landingMain">
        <section className="pageCard">
          <h1>Features</h1>
          <ul className="featureList">
            <li>
              <strong>User dashboard:</strong> value, gain, submitted properties count, improvements and latest property.
            </li>
            <li>
              <strong>Submit property:</strong> validation to prevent blank submissions.
            </li>
            <li>
              <strong>Recommendations:</strong> cards + detail view with gallery and back navigation.
            </li>
            <li>
              <strong>Admin:</strong> add/edit recommendations with images.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Features;

