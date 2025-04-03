import { useState, useEffect } from 'react';
import Login from './Login';
import MainApp from './MainApp';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //  新增：初始化标志位

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false); //  设置完后表示初始化完成
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 防止刚进页面啥都不渲染
  }

  if (!user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f2f2f2'
      }}>
        <Login onLogin={(username) => {
          localStorage.setItem('user', username);
          setUser(username);
        }} />
      </div>
    );
  }

  return <MainApp user={user} />;
}

export default App;
