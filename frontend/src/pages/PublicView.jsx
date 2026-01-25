import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function PublicView() {
  const [tournamentId, setTournamentId] = useState("");
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("publicViewData");
      if (saved) {
        const data = JSON.parse(saved);

        setTournamentId(data.tournamentId || "");
        setTournament(data.tournament || null);

        if (Array.isArray(data.matches)) setMatches(data.matches);
        else setMatches([]);
      }
    } catch (err) {
      console.log("LocalStorage parse error:", err);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const data = { tournamentId, tournament, matches };
    localStorage.setItem("publicViewData", JSON.stringify(data));
  }, [tournamentId, tournament, matches, isLoaded]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!tournamentId.trim()) {
        alert("Please enter Tournament ID");
        return;
      }

      const tourRes = await api.get(`/tournaments/${tournamentId}`);
      setTournament(tourRes.data);

      const matchRes = await api.get(`/tournaments/${tournamentId}/matches`);
      setMatches(matchRes.data);

      if (matchRes.data.length === 0) {
        alert("No matches found for this Tournament ID");
      }
    } catch (err) {
      alert("Invalid Tournament ID or server error");
      console.log(err);
      setTournament(null);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setTournamentId("");
    setTournament(null);
    setMatches([]);
    localStorage.removeItem("publicViewData");
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h1 className="title" style={{ margin: 0 }}>
          Tournament Schedule
        </h1>

        <button
          className="btn btnLight"
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Back
        </button>
      </div>

      <p className="subtitle">
        Public View • Enter Tournament ID to see tournament details & schedule
      </p>

      <div className="card">
        <h2 style={{ margin: 0 }}>Find Your Tournament</h2>
        <p className="smallText">
          Ask Admin for the Tournament ID and paste it below.
        </p>

        <div className="formGrid">
          <div>
            <div className="label">Tournament ID</div>
            <input
              className="input"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder="e.g. 69734cd72d54774a4fafa229"
            />
          </div>

          <div className="btnRow">
            <button
              className="btn btnPrimary"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "Loading..." : "View Tournament"}
            </button>

            <button className="btn btnLight" onClick={clearData}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Tournament Details */}
      {tournament && (
        <div className="card">
          <h2 style={{ margin: 0 }}>🏆 Tournament Details</h2>

          <div style={{ marginTop: "12px", lineHeight: "28px" }}>
            <p>
              <b>Name:</b> {tournament.name}
            </p>
            <p>
              <b>Type:</b>{" "}
              {tournament.type === "ROUND_ROBIN" ? "Round Robin" : "Knockout"}
            </p>
            <p>
              <b>Created At:</b>{" "}
              {tournament.createdAt
                ? new Date(tournament.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ margin: 0 }}>Match Schedule</h2>
        <p className="smallText">Full match schedule will appear here.</p>

        {matches.length === 0 ? (
          <p className="smallText">No schedule loaded yet.</p>
        ) : (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Round</th>
                  <th>Team A</th>
                  <th>Team B</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, idx) => (
                  <tr key={idx}>
                    <td>#{m.matchNumber}</td>
                    <td>{m.roundNumber}</td>
                    <td>{m.teamA}</td>
                    <td>{m.teamB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="smallText" style={{ textAlign: "center", marginTop: "18px" }}>
        Tournament Scheduler • Built using React + Spring Boot + MongoDB
      </p>
    </div>
  );
}
