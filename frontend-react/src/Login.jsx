import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const res = await fetch('http://localhost:5237/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      onLogin(username);
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        style={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      <button
        onClick={submit}
        style={{
          padding: '0.5rem',
          fontWeight: 'bold',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Log In
      </button>

      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
    </div>
  );
}

export default Login;
