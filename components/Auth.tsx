
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đủ thông tin!');
      return;
    }

    const usersStr = localStorage.getItem('quizziz_users') || '[]';
    const users = JSON.parse(usersStr);

    if (isLogin) {
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) {
        onLogin({ id: user.id, username: user.username, avatar: '👤' });
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu!');
      }
    } else {
      const exists = users.find((u: any) => u.username === username);
      if (exists) {
        setError('Tên đăng nhập đã tồn tại!');
      } else {
        const newUser = { id: `user-${Date.now()}`, username, password };
        users.push(newUser);
        localStorage.setItem('quizziz_users', JSON.stringify(users));
        onLogin({ id: newUser.id, username: newUser.username, avatar: '👤' });
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-[#0c0216]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="gaming-card relative z-10 w-full max-w-md p-12 rounded-[4rem] border-t-[12px] border-fuchsia-600 shadow-[0_0_100px_rgba(217,70,239,0.2)]">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bungee text-white mb-2 tracking-tighter text-neon">
            {isLogin ? 'LOGIN' : 'SIGN UP'}
          </h1>
          <p className="text-indigo-300 font-bold uppercase tracking-[0.3em] text-xs opacity-60">
            {isLogin ? 'Welcome back to the arena' : 'Join the ultimate learning arena'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-glass w-full p-6 rounded-[2rem] font-bold text-xl text-white outline-none"
              placeholder="Gamer name..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass w-full p-6 rounded-[2rem] font-bold text-xl text-white outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-rose-500 text-center font-bold text-sm animate-shake">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-125 text-white p-7 rounded-[2.5rem] font-bungee text-2xl transition-all shadow-xl active:scale-95"
          >
            {isLogin ? 'ENTER' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-300/60 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already a member? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
