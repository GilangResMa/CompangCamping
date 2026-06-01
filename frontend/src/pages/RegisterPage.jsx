import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
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
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;