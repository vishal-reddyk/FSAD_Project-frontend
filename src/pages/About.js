import TopNav from "../components/TopNav";
import "../styles/landing.css";

function About() {
  return (
    <div className="landing">
      <TopNav />
      <main className="landingMain">
        <section className="pageCard">
          <h1>About</h1>
          <p>
            GharValue helps users understand their home value and make better improvement decisions. Submit a property,
            see a dashboard summary, and explore recommendations with cost vs gain.
          </p>
        </section>
      </main>
    </div>
  );
}

export default About;

