import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Admin() {
  const [name, setName] = useState("");
  const [type, setType] = useState("ROUND_ROBIN");
  const [teams, setTeams] = useState(["", "", "", ""]);
  const [tournamentId, setTournamentId] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adminFormData");
      if (saved) {
        const data = JSON.parse(saved);
        setName(data.name || "");
        setType(data.type || "ROUND_ROBIN");
        setTeams(data.teams || ["", "", "", ""]);
        setTournamentId(data.tournamentId || "");
      }

      const savedMatches = localStorage.getItem("adminMatches");
      if (savedMatches) {
        const parsedMatches = JSON.parse(savedMatches);
        if (Array.isArray(parsedMatches)) setMatches(parsedMatches);
      }
    } catch (err) {
      console.log("LocalStorage parse error:", err);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const data = { name, type, teams, tournamentId };
    localStorage.setItem("adminFormData", JSON.stringify(data));
  }, [name, type, teams, tournamentId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("adminMatches", JSON.stringify(matches));
  }, [matches, isLoaded]);

  const updateTeam = (index, value) => {
    const copy = [...teams];
    copy[index] = value;
    setTeams(copy);
  };

  const addTeam = () => {
    if (teams.some((t) => t.trim() === "")) {
      alert("Fill all team fields before adding a new team.");
      return;
    }
    setTeams([...teams, ""]);
  };

  const removeTeam = (index) => {
    if (teams.length <= 4) {
      alert("Minimum 4 teams required!");
      return;
    }
    const copy = teams.filter((_, i) => i !== index);
    setTeams(copy);
  };

  const createTournament = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        type,
        teams: teams.filter((t) => t.trim() !== ""),
      };

      if (!payload.name.trim()) return alert("Enter tournament name");
      if (payload.teams.length < 4) return alert("Minimum 4 teams required");

      const res = await api.post("/tournaments", payload);

      setTournamentId(res.data.id);

      alert("Tournament Created ID: " + res.data.id);
    } catch (err) {
      console.log("Create Tournament Error:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Error creating tournament"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    try {
      setLoading(true);
      if (!tournamentId.trim()) return alert("Enter Tournament ID first");

      const res = await api.post(`/tournaments/${tournamentId}/generate`);
      setMatches(res.data);

      localStorage.setItem("adminMatches", JSON.stringify(res.data));

      alert("Schedule Generated");
    } catch (err) {
      alert(err.response?.data?.message || "Error generating schedule");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      if (!tournamentId.trim()) return alert("Enter Tournament ID first");

      const res = await api.get(`/tournaments/${tournamentId}/matches`);
      setMatches(res.data);

      localStorage.setItem("adminMatches", JSON.stringify(res.data));
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching matches ");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const copyId = async () => {
    if (!tournamentId) return;
    await navigator.clipboard.writeText(tournamentId);
    alert("Tournament ID Copied ");
  };

  const resetForm = () => {
    const existing = localStorage.getItem("adminFormData");
    const oldData = existing ? JSON.parse(existing) : {};

    const newData = {
      ...oldData,
      name: "",
      type: "ROUND_ROBIN",
      teams: ["", "", "", ""],
    };

    localStorage.setItem("adminFormData", JSON.stringify(newData));

    setName("");
    setType("ROUND_ROBIN");
    setTeams(["", "", "", ""]);

    alert("Form cleared");
  };

  const clearSchedule = () => {
    localStorage.removeItem("adminMatches");
    setMatches([]);
  };

  const canCreate =
    name.trim() !== "" && teams.filter((t) => t.trim() !== "").length >= 4;

  const canAddMoreTeams =
    teams.length >= 4 && teams.slice(0, 4).every((t) => t.trim() !== "");

  return (
    <div className="page">
      <h1 className="title">🏆 Tournament Scheduler</h1>
      <p className="subtitle">
        Admin Panel • Create tournament, generate schedule & view matches
      </p>

      <div className="card">
        <h2 style={{ margin: 0 }}>Create Tournament</h2>

        <div className="formGrid">
          <div>
            <div className="label">Tournament Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MIT League"
            />
          </div>

          <div>
            <div className="label">Tournament Type</div>
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ROUND_ROBIN">Round Robin</option>
              <option value="KNOCKOUT">Knockout</option>
            </select>
          </div>

          <div>
            <div className="label">Teams (minimum 4)</div>

            {teams.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  margin: "6px 0",
                }}
              >
                <input
                  value={t}
                  onChange={(e) => updateTeam(i, e.target.value)}
                  placeholder={`Team ${i + 1}`}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />

                {teams.length > 4 && (
                  <button
                    type="button"
                    onClick={() => removeTeam(i)}
                    style={{
                      padding: "10px 14px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </button>
                )}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "18px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={addTeam}
                disabled={!canAddMoreTeams}
                style={{
                  padding: "14px 18px",
                  background: !canAddMoreTeams ? "gray" : "#222",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: !canAddMoreTeams ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                + Add More Teams
              </button>

              <button
                type="button"
                onClick={createTournament}
                disabled={!canCreate || loading}
                style={{
                  padding: "14px 18px",
                  background: !canCreate || loading ? "gray" : "black",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: !canCreate || loading ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                {loading ? "Creating..." : "Create Tournament"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "14px 18px",
                  background: "#eee",
                  color: "#111",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: 0 }}>Generate / View Matches</h2>

        <div className="formGrid">
          <div>
            <div className="label">Tournament ID</div>
            <input
              className="input"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder="Paste tournament id here..."
            />
          </div>

          <div className="btnRow">
            <button className="btn btnLight" onClick={copyId}>
              Copy ID
            </button>

            <button
              className="btn btnGreen"
              onClick={generateSchedule}
              disabled={loading}
            >
              Generate Schedule
            </button>

            <button
              className="btn btnBlue"
              onClick={fetchMatches}
              disabled={loading}
            >
              Fetch Matches
            </button>

            <button className="btn btnLight" onClick={clearSchedule}>
              Clear Schedule
            </button>
          </div>
        </div>

        <div style={{ marginTop: "14px" }}>
          <h3 style={{ marginBottom: "8px" }}>Matches</h3>

          {matches.length === 0 ? (
            <p className="smallText">No matches yet.</p>
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
                      <td>{m.matchNumber}</td>
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
      </div>
    </div>
  );
}
