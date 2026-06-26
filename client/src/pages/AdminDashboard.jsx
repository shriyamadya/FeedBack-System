import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://feedback-system-backend-5yb1.onrender.com";

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  const fetchFeedbacks = async () => {
    if (!token) {
      alert("Please login first.");
      navigate("/admin");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/feedbacks`, {
        headers: {
          Authorization: `Basic ${token}`
        }
      });

      if (!response.ok) {
        localStorage.removeItem("admin_token");
        alert("Session expired or invalid login. Please login again.");
        navigate("/admin");
        return;
      }

      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      alert("Could not load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    const confirmDelete = window.confirm("Delete this feedback?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/admin/feedbacks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete feedback.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const downloadCSV = () => {
    if (feedbacks.length === 0) {
      alert("No data to download.");
      return;
    }

    const headers = [
      "Instructor",
      "Subject",
      "Rating",
      "What went well",
      "Improvement",
      "Time"
    ];

    const rows = feedbacks.map((item) => [
      item.instructor,
      item.subject,
      item.rating,
      item.liked,
      item.improve,
      item.created_at
    ]);

    const csvContent =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          row.map((field) => `"${String(field || "").replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feedbacks.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.instructor?.toLowerCase().includes(search) ||
        item.subject?.toLowerCase().includes(search) ||
        item.liked?.toLowerCase().includes(search) ||
        item.improve?.toLowerCase().includes(search);

      const matchesRating =
        ratingFilter === "All" ? true : item.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, searchTerm, ratingFilter]);

  const averageLabel = useMemo(() => {
    if (feedbacks.length === 0) return "-";

    const scoreMap = {
      "Excellent": 4,
      "Good": 3,
      "Okay": 2,
      "Needs Improvement": 1
    };

    const total = feedbacks.reduce((sum, item) => sum + (scoreMap[item.rating] || 0), 0);
    const avg = total / feedbacks.length;

    if (avg >= 3.5) return "Excellent";
    if (avg >= 2.5) return "Good";
    if (avg >= 1.5) return "Okay";
    return "Needs Improvement";
  }, [feedbacks]);

  const getRatingStyle = (rating) => {
    if (rating === "Excellent") {
      return { background: "#dcfce7", color: "#166534" };
    }
    if (rating === "Good") {
      return { background: "#dbeafe", color: "#1d4ed8" };
    }
    if (rating === "Okay") {
      return { background: "#fef3c7", color: "#b45309" };
    }
    return { background: "#fee2e2", color: "#b91c1c" };
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading feedback...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageBadge}>Admin Panel</div>
          <h1 style={styles.pageTitle}>Feedback Dashboard</h1>
          <p style={styles.pageSubtitle}>
            Review, filter, export, and manage all feedback in one place.
          </p>
        </div>

        <div style={styles.actionRow}>
          <button onClick={downloadCSV} style={styles.downloadButton}>
            Download CSV
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Feedback</div>
          <div style={styles.statValue}>{feedbacks.length}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Filtered Results</div>
          <div style={styles.statValue}>{filteredFeedbacks.length}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Average Rating</div>
          <div style={styles.statValue}>{averageLabel}</div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by instructor, subject, or feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          style={styles.select}
        >
          <option value="All">All Ratings</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Okay">Okay</option>
          <option value="Needs Improvement">Needs Improvement</option>
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={styles.emptyCard}>No feedback matches the current filters.</div>
      ) : (
        <div style={styles.cardList}>
          {filteredFeedbacks.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>{item.instructor || "Unknown Instructor"}</div>
                  <div style={styles.cardMetaRow}>
                    <span style={styles.subjectText}>{item.subject || "No subject"}</span>
                    <span style={styles.dot}>•</span>
                    <span style={styles.timeText}>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div style={{ ...styles.ratingBadge, ...getRatingStyle(item.rating) }}>
                  {item.rating}
                </div>
              </div>

              <div style={styles.contentGrid}>
                <div style={styles.infoBlock}>
                  <div style={styles.blockTitle}>What went well</div>
                  <div style={styles.blockText}>{item.liked || "-"}</div>
                </div>

                <div style={styles.infoBlock}>
                  <div style={styles.blockTitle}>Improvement suggestions</div>
                  <div style={styles.blockText}>{item.improve || "-"}</div>
                </div>
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => deleteFeedback(item.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "24px 28px"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "18px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  pageBadge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "10px"
  },
  pageTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a"
  },
  pageSubtitle: {
    marginTop: "6px",
    color: "#64748b",
    fontSize: "14px",
    maxWidth: "620px",
    lineHeight: "1.5"
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "16px"
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)"
  },
  statLabel: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "8px"
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a"
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  searchInput: {
    flex: "1",
    minWidth: "280px",
    padding: "13px 15px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none"
  },
  select: {
    minWidth: "180px",
    padding: "13px 15px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none"
  },
  emptyCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    color: "#475569"
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    border: "1px solid #eef2f7"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "16px"
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a"
  },
  cardMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
    flexWrap: "wrap"
  },
  subjectText: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500"
  },
  dot: {
    color: "#94a3b8"
  },
  timeText: {
    fontSize: "13px",
    color: "#64748b"
  },
  ratingBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px"
  },
  infoBlock: {
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "16px"
  },
  blockTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "8px"
  },
  blockText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#1e293b"
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px"
  },
  deleteButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "12px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },
  logoutButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "12px",
    background: "#111827",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },
  downloadButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "12px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default AdminDashboard;