import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";
import { Tent, Package, LogOut, Clock, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionStyle = (condition) => {
    switch (condition) {
      case "baik":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-300";
      case "rusak_ringan":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300";
      default:
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300";
    }
  };

  const getConditionLabel = (condition) => {
    switch (condition) {
      case "baik":
        return "✨ Sempurna";
      case "rusak_ringan":
        return "⚠️ Ada Lecet";
      default:
        return "🔴 Rusak Parah";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2.5 rounded-lg">
              <Tent className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Camping Rental
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/user")}
              className="px-5 py-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition transform hover:scale-105"
            >
              📋 Riwayat
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition transform hover:scale-105 active:scale-95"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-5xl font-bold mb-3 text-gray-900">
            Jelajahi Koleksi Kami
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Temukan peralatan camping terbaik untuk petualangan Anda
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari peralatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-emerald-50/50 text-gray-800 placeholder-gray-400 font-medium transition"
            />
            <Package className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-xl text-gray-500 font-medium">
              Tidak ada peralatan yang tersedia
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Total Peralatan</p>
                    <p className="text-4xl font-bold text-emerald-600">{filteredItems.length}</p>
                  </div>
                  <Package className="text-emerald-200" size={48} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Tersedia Disewa</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {filteredItems.filter(i => (i.available_stock || 0) > 0).length}
                    </p>
                  </div>
                  <Clock className="text-blue-200" size={48} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Kualitas Terjamin</p>
                    <p className="text-4xl font-bold text-purple-600">100%</p>
                  </div>
                  <Shield className="text-purple-200" size={48} />
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 animate-fade-in-up transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-2xl text-white mb-2">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-300 fill-yellow-300" size={18} />
                        <span className="text-white font-semibold">4.8/5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Price */}
                    <div>
                      <p className="text-gray-500 text-sm font-semibold mb-1">Harga Sewa</p>
                      <p className="text-4xl font-bold text-emerald-600">
                        Rp {Number(item.price_per_day).toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">/hari</p>
                    </div>

                    {/* Condition Badge */}
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getConditionStyle(item.item_condition)}`}>
                      {getConditionLabel(item.item_condition)}
                    </div>

                    {/* Stock Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600 text-xs font-semibold mb-1">KETERSEDIAAN</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-900">{item.available_stock || 0}</p>
                        <p className="text-gray-500 text-sm">Unit Tersedia</p>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((item.available_stock || 0) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      disabled={(item.available_stock || 0) <= 0}
                      onClick={() =>
                        navigate("/rental", {
                          state: { selectedItem: item },
                        })
                      }
                      className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                        (item.available_stock || 0) <= 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                          : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:scale-95"
                      }`}
                    >
                      {(item.available_stock || 0) <= 0 ? "❌ Tidak Tersedia" : "✨ Sewa Sekarang"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;