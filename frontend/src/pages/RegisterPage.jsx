import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Tent, User, Mail, Lock, Phone, AlertCircle, CheckCircle } from "lucide-react";
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b

const API_URL = process.env.REACT_APP_API_URL;

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setLoading(true);
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b

    try {
      setError("");
      setSuccess("");

      await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: "renter",
      });

<<<<<<< HEAD
      setSuccess("✓ Registrasi berhasil! Mengalihkan ke login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registrasi gagal"
      );
    } finally {
      setLoading(false);
=======
      setSuccess("Registrasi berhasil. Silakan login.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registrasi gagal"
      );
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              <Tent className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Daftar
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Jadilah bagian dari komunitas kami</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-slide-in-right">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3 animate-slide-in-right">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Nama Anda"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-blue-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="contoh@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-blue-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-blue-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor HP</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                placeholder="08xxxxxxxxxx"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-blue-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sedang Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">sudah punya akun?</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          <button
            onClick={() => navigate("/")}
            className="font-bold text-blue-600 hover:text-blue-700 transition underline decoration-2 decoration-blue-200 hover:decoration-blue-400"
          >
            Kembali ke Login
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-3xl font-bold text-center mb-8">
          Register Penyewa
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap"
            className="w-full p-3 border rounded-lg mb-4"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Nomor HP"
            className="w-full p-3 border rounded-lg mb-6"
            value={form.phone}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Daftar
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-green-600 font-semibold"
          >
            Login
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;