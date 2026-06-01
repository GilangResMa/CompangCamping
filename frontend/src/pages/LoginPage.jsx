import { useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Tent, Mail, Lock, AlertCircle } from 'lucide-react';
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
<<<<<<< HEAD
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "owner") {
        navigate("/dashboard");
      } else if (loggedInUser.role === "renter") {
        navigate("/catalog");
      } else {
        setError("Role tidak dikenali");
      }
    } catch (err) {
      setError("Login gagal. Periksa email/password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-400 to-blue-500 p-3 rounded-full">
              <Tent className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Camping Rental
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Petualangan dimulai di sini</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-slide-in-right">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="contoh@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:bg-emerald-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:bg-emerald-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sedang Login...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">atau</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-600">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-bold text-emerald-600 hover:text-emerald-700 transition underline decoration-2 decoration-emerald-200 hover:decoration-emerald-400"
          >
            Daftar sekarang
          </button>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Admin:</p>
          <p className="text-xs text-blue-800"><strong>Email:</strong> admin@gmail.com</p>
          <p className="text-xs text-blue-800"><strong>Password:</strong> admin123</p>
        </div>
=======
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
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
      </div>
    </div>
  );
}

export default LoginPage;