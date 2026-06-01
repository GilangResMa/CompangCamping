import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, AlertTriangle } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function UserPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const currentUser = user || JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [rentals, setRentals] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    const res = await axios.get(`${API_URL}/api/rentals/user/${currentUser.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRentals(res.data);
  };

  const fetchFines = async () => {
    const res = await axios.get(`${API_URL}/api/fines/user/${currentUser.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFines(res.data);
  };

  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        await Promise.all([fetchRentals(), fetchFines()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Silakan login ulang.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const statusClass = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "returned") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Kembali ke Katalog
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="text-green-600" />
            Riwayat Saya
          </h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Riwayat Sewa</h2>

          {loading ? (
            <p>Loading...</p>
          ) : rentals.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              Belum ada riwayat sewa.
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.map((rental, index) => (
                <div
                  key={`${rental.id}-${index}`}
                  className="bg-white rounded-xl shadow p-5 border border-gray-100"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-xl">
                        {rental.name || "Barang Camping"}
                      </h3>

                      <p className="text-sm text-gray-600 mt-2">
                        Tanggal sewa: {rental.rental_date}
                      </p>

                      <p className="text-sm text-gray-600">
                        Tanggal kembali: {rental.return_date}
                      </p>

                      <p className="text-sm text-gray-600">
                        Jumlah: {rental.quantity}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-sm font-medium ${statusClass(
                        rental.status
                      )}`}
                    >
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            Denda Saya
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : fines.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              Tidak ada denda.
            </div>
          ) : (
            <div className="space-y-4">
              {fines.map((fine) => (
                <div
                  key={fine.id}
                  className="bg-white rounded-xl shadow p-5 border border-gray-100"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-xl">
                        Rental #{fine.rental_id}
                      </h3>

                      <p className="text-sm text-gray-600 mt-2">
                        Alasan: {fine.reason}
                      </p>

                      <p className="text-lg font-bold text-red-600 mt-2">
                        Rp {Number(fine.amount).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-sm font-medium ${
                        fine.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fine.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserPage;