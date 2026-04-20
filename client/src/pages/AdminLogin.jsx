import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://feedback-system-backend-5yb1.onrender.com";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    setLoading(true);

    const token = btoa(`${username}:${password}`);

    try {
      const response = await fetch(`${API_BASE}/admin/feedbacks`, {
        headers: {
          Authorization: `Basic ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("admin_token", token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>Only authorized users can access feedback.</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    padding: "16px"
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#fff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },
  title: {
    textAlign: "center",
    marginBottom: "6px"
  },
  subtitle: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "18px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#6366f1",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default AdminLogin;