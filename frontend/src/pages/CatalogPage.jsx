import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";
import { Tent, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tent className="text-green-600" />
            Camping Rental
          </h1>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/user")}
              className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg"
            >
              Riwayat Sewa
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-8">Katalog Peralatan</h2>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>Data alat camping belum tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xl">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Stok: {item.available_stock}</p>
                  </div>

                  <Package className="text-green-600" />
                </div>

                <p className="mt-3 text-2xl font-bold text-green-600">
                  Rp {Number(item.price_per_day).toLocaleString()}/hari
                </p>

                <div
                  className={`mt-4 inline-block px-3 py-1 rounded-full text-sm ${
                    item.item_condition === "baik"
                      ? "bg-green-100 text-green-700"
                      : item.item_condition === "rusak_ringan"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.item_condition}
                </div>

                <p className="text-gray-500 text-sm">
                  Tersedia: {item.available_stock || 0} unit
                </p>

                <button
                  type="button"
                  disabled={(item.available_stock || 0) <= 0}
                  onClick={() =>
                    navigate("/rental", {
                      state: { selectedItem: item },
                    })
                  }
                  className={`mt-6 w-full py-3 rounded-lg font-medium ${
                    (item.available_stock || 0) <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {(item.available_stock || 0) <= 0 ? "Tidak Tersedia" : "Sewa Sekarang"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;