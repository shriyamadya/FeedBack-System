import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://feedback-system-backend-5yb1.onrender.com";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
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
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(
      "Password reset is currently handled by the system owner. Please contact the administrator to reset the login credentials."
    );
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.badge}>Admin Access</div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>
          Log in to view, manage, delete, and export feedback.
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <label style={styles.label}>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passwordWrap}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          style={styles.forgotButton}
        >
          Forgot password?
        </button>

        <p style={styles.note}>
          Student feedback remains anonymous. Admin access is restricted.
        </p>
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
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
    padding: "16px"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
    border: "1px solid #eef2f7"
  },
  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "14px"
  },
  title: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a"
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    marginTop: "8px",
    marginBottom: "22px"
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "7px"
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none"
  },
  passwordWrap: {
    display: "flex",
    border: "1px solid #dbe2ea",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "16px"
  },
  passwordInput: {
    flex: 1,
    padding: "13px 14px",
    border: "none",
    fontSize: "14px",
    outline: "none"
  },
  showButton: {
    border: "none",
    background: "#f8fafc",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#4338ca"
  },
  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.22)"
  },
  forgotButton: {
    width: "100%",
    marginTop: "12px",
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontWeight: "700",
    cursor: "pointer"
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "13px",
    marginBottom: "14px"
  },
  note: {
    textAlign: "center",
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "18px",
    marginBottom: 0
  }
};

export default AdminLogin;