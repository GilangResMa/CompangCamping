import { useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      e.preventDefault();
      try {
        setError("");
        const loggedInUser =
          await login(
            email,
            password
          );
        if (
          loggedInUser.role ===
          "owner"
        ) {
          navigate(
            "/dashboard"
          );
        } else if (
          loggedInUser.role ===
          "renter"
        ) {
          navigate(
            "/catalog"
          );
        } else {
          setError(
            "Role tidak dikenali"
          );
        }
      } catch (err) {
        setError(
          "Login gagal. Periksa email/password"
        );

      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-3xl font-bold text-center mb-8">Camping Rental</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-600 font-semibold"
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;