import { useState } from 'react';

function ResumeUploader() {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!resume || !job) {
      alert("Please upload both resume and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resumeFile", resume);
    formData.append("jobFile", job);

    try {
      const res = await fetch("http://localhost:5237/UploadResume/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Upload failed. Please check the server.");
    } finally {
      setLoading(false);
      setResume(null);
      setJob(null);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "420px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Resume Analyzer</h2>

      <label style={{ width: "100%", marginBottom: "1rem" }}>
        <strong>Upload Resume (.pdf or .docx)</strong>
        <input
          type="file"
          onChange={e => setResume(e.target.files[0])}
          style={{ width: "100%", marginTop: "0.3rem" }}
        />
      </label>

      <label style={{ width: "100%", marginBottom: "1rem" }}>
        <strong>Upload Job Description</strong>
        <input
          type="file"
          onChange={e => setJob(e.target.files[0])}
          style={{ width: "100%", marginTop: "0.3rem" }}
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.7rem",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseEnter={(e) => {
          if (!loading) e.target.style.backgroundColor = "#0056b3";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.target.style.backgroundColor = "#007bff";
        }}
      >
        {loading ? "Uploading..." : "Upload & Analyze"}
      </button>

      {/* 进度条（仅上传时显示） */}
      {loading && (
        <div style={{
          width: "100%",
          marginTop: "1rem",
          height: "6px",
          backgroundColor: "#e0e0e0",
          borderRadius: "3px",
          overflow: "hidden"
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #007bff, #00c6ff)",
            animation: "progress 1.5s infinite"
          }}></div>
        </div>
      )}

      {/* 结果区域 */}
      {result && (
        <div style={{
          marginTop: "2rem",
          width: "100%",
          textAlign: "left",
          backgroundColor: "#f9f9f9",
          padding: "1rem",
          borderRadius: "6px",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)"
        }}>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Summary:</strong> {result.summary}</p>
        </div>
      )}

      {/* 动画样式 */}
      <style>
        {`
        @keyframes progress {
          0% { transform: translateX(-100%) }
          50% { transform: translateX(0%) }
          100% { transform: translateX(100%) }
        }
        `}
      </style>
    </div>
  );
}

export default ResumeUploader;
