import ResumeUploader from './ResumeUploader';

function MainApp({ user }) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome {user}!</h1>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

      {/* ✅ 加入你的简历上传功能 */}
      <ResumeUploader />
    </div>
  );
}

export default MainApp;
