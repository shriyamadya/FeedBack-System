import { useState } from "react";

const API_BASE = "https://feedback-system-backend-5yb1.onrender.com";

function FeedbackPage() {
  const [form, setForm] = useState({
    instructor: "",
    subject: "",
    rating: "",
    liked: "",
    improve: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ratingOptions = [
    { label: "Excellent", emoji: "🌟" },
    { label: "Good", emoji: "🙂" },
    { label: "Okay", emoji: "😐" },
    { label: "Needs Improvement", emoji: "📝" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.instructor.trim() || !form.subject.trim() || !form.rating.trim()) {
      alert("Please fill instructor, subject, and rating.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
         body: JSON.stringify({
              instructor: instructor,
              subject: subject,
              rating: rating,
              liked: liked,
              improve: improve,
             }
            ),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch (error) {
      alert("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>💛</div>
          <h1 style={styles.successTitle}>Feedback Submitted</h1>
          <p style={styles.successText}>
            Thank you for taking the time to share your thoughts.
          </p>

          <button
            style={styles.secondaryButton}
            onClick={() => {
              setForm({
                instructor: "",
                subject: "",
                rating: "",
                liked: "",
                improve: ""
              });
              setSubmitted(false);
            }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.badge}>Anonymous & Quick</div>
          <h1 style={styles.mainTitle}>Session Feedback</h1>
          <p style={styles.mainText}>
            Share honest feedback in a simple, respectful, and anonymous way.
          </p>

          <div style={styles.infoCard}>
            <div style={styles.infoItem}>
              <span style={styles.infoDot}></span>
              No name or email is collected
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoDot}></span>
              Takes less than a minute
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoDot}></span>
              Helps improve future sessions
            </div>
          </div>
        </div>

        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Share Your Experience</h2>
          <p style={styles.formSubtitle}>
            Your response will remain anonymous.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.section}>
              <label style={styles.label}>Instructor Name</label>
              <input
                type="text"
                placeholder="Enter instructor name"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>Subject / Session</label>
              <input
                type="text"
                placeholder="Enter subject or session"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>How was the session?</label>
              <div style={styles.ratingGrid}>
                {ratingOptions.map((item) => {
                  const selected = form.rating === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setForm({ ...form, rating: item.label })}
                      style={{
                        ...styles.ratingCard,
                        ...(selected ? styles.ratingCardSelected : {})
                      }}
                    >
                      <div style={styles.ratingEmoji}>{item.emoji}</div>
                      <div style={styles.ratingText}>{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.label}>What went well?</label>
              <textarea
                placeholder="Mention what you appreciated"
                value={form.liked}
                onChange={(e) => setForm({ ...form, liked: e.target.value })}
                style={styles.textarea}
              />
            </div>

            <div style={styles.section}>
              <label style={styles.label}>What can be improved?</label>
              <textarea
                placeholder="Share suggestions for improvement"
                value={form.improve}
                onChange={(e) => setForm({ ...form, improve: e.target.value })}
                style={styles.textarea}
              />
            </div>

            <button type="submit" style={styles.submitButton} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
    padding: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    gap: "24px",
    alignItems: "stretch"
  },
  leftPanel: {
    background: "linear-gradient(180deg, #4338ca 0%, #6366f1 100%)",
    color: "#ffffff",
    borderRadius: "28px",
    padding: "36px",
    boxShadow: "0 20px 45px rgba(67, 56, 202, 0.18)"
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.16)",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "18px"
  },
  mainTitle: {
    margin: 0,
    fontSize: "40px",
    lineHeight: "1.1",
    marginBottom: "14px"
  },
  mainText: {
    margin: 0,
    fontSize: "16px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.88)",
    maxWidth: "420px"
  },
  infoCard: {
    marginTop: "28px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "20px",
    padding: "18px"
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.92)"
  },
  infoDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#ffffff",
    flexShrink: 0
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)"
  },
  formTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a"
  },
  formSubtitle: {
    marginTop: "8px",
    marginBottom: "24px",
    color: "#64748b",
    fontSize: "14px"
  },
  section: {
    marginBottom: "18px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e293b"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff"
  },
  ratingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  ratingCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px 12px",
    background: "#ffffff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },
  ratingCardSelected: {
    background: "#eef2ff",
    border: "2px solid #4f46e5"
  },
  ratingEmoji: {
    fontSize: "22px"
  },
  ratingText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center"
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "96px",
    padding: "14px 15px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },
  submitButton: {
    width: "100%",
    marginTop: "8px",
    border: "none",
    borderRadius: "16px",
    padding: "15px 16px",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.22)"
  },
  successCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "36px",
    textAlign: "center",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)"
  },
  successIcon: {
    fontSize: "44px",
    marginBottom: "12px"
  },
  successTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a"
  },
  successText: {
    marginTop: "10px",
    marginBottom: "24px",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.6"
  },
  secondaryButton: {
    border: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer"
  }
};

export default FeedbackPage;