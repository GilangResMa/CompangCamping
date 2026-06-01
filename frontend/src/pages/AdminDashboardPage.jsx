import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../components/context/AuthContext";

import {
  Package,
  ClipboardList,
  AlertTriangle,
  LogOut,
  Folder,
  Box,
  Clock3,
  CheckCircle,
  Wallet,
<<<<<<< HEAD
  TrendingUp,
  Users,
  Settings,
=======
>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
} from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboardPage() {

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [summary, setSummary] = useState({
    total_items: 0,
    pending_rentals: 0,
    active_rentals: 0,
    unpaid_fines: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
<<<<<<< HEAD
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
=======

    fetchSummary();

  }, []);

  const fetchSummary = async () => {

    try {

>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
      const res = await axios.get(
        `${API_URL}/api/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
<<<<<<< HEAD
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 ${bgColor} animate-fade-in-up transform hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-semibold mb-2">{label}</p>
          <h3 className={`text-4xl font-bold ${color}`}>{value}</h3>
          {trend && <p className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1"><TrendingUp size={14} /> {trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} opacity-20`}>
          <Icon className={`${color}`} size={32} />
        </div>
      </div>
    </div>
  );

  const MenuCard = ({ icon: Icon, title, description, color, onClick }) => (
    <button
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-7 text-left border-t-4 ${color} hover:border-t-8 transform hover:-translate-y-2 animate-fade-in-up`}
    >
      <div className={`${color.replace('border-', 'bg-').replace('-600', '-100')} p-4 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`${color.replace('border-', 'text-')}`} size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 text-xs font-semibold text-gray-400 group-hover:text-gray-600 transition">
        Buka →
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-lg">
              <Settings className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">Camping Rental Management</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition transform hover:scale-105 active:scale-95"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-gray-900 mb-2">
            Selamat Datang Kembali 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Kelola bisnis rental camping Anda dengan mudah
          </p>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Box}
            label="Total Peralatan"
            value={summary.total_items}
            color="text-emerald-600"
            bgColor="border-emerald-600"
            trend="+12% minggu ini"
          />
          <StatCard
            icon={Clock3}
            label="Rental Tertunda"
            value={summary.pending_rentals}
            color="text-amber-600"
            bgColor="border-amber-600"
            trend={summary.pending_rentals > 0 ? "⚠️ Perlu tindakan" : "✓ Kosong"}
          />
          <StatCard
            icon={CheckCircle}
            label="Rental Aktif"
            value={summary.active_rentals}
            color="text-blue-600"
            bgColor="border-blue-600"
            trend={`${summary.active_rentals} berlangsung`}
          />
          <StatCard
            icon={Wallet}
            label="Denda Belum Bayar"
            value={summary.unpaid_fines}
            color="text-red-600"
            bgColor="border-red-600"
            trend={summary.unpaid_fines > 0 ? "⚠️ Tagih sekarang" : "✓ Bersih"}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings size={28} className="text-purple-600" />
            Menu Manajemen
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MenuCard
              icon={Package}
              title="Kelola Peralatan"
              description="Tambah, edit, atau hapus peralatan rental"
              color="border-emerald-600"
              onClick={() => navigate("/admin/items")}
            />
            <MenuCard
              icon={Folder}
              title="Kelola Kategori"
              description="Atur kategori peralatan seperti tenda, carrier, dll"
              color="border-blue-600"
              onClick={() => navigate("/admin/categories")}
            />
            <MenuCard
              icon={ClipboardList}
              title="Kelola Rental"
              description="Approve, monitor, dan proses return rental"
              color="border-amber-600"
              onClick={() => navigate("/admin/rentals")}
            />
            <MenuCard
              icon={Wallet}
              title="Kelola Denda"
              description="Catat dan kelola denda keterlambatan"
              color="border-red-600"
              onClick={() => navigate("/admin/fines")}
            />
            <MenuCard
              icon={Box}
              title="Unit Peralatan"
              description="Kelola unit individual dan tracking kondisi"
              color="border-purple-600"
              onClick={() => navigate("/admin/item-units")}
            />
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 rounded-2xl p-8 border-l-4 border-purple-600">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-purple-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-purple-900 mb-2">💡 Tips Manajemen</h4>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>✓ Periksa rental tertunda secara berkala untuk approval cepat</li>
                <li>✓ Monitor kondisi peralatan untuk menjaga kualitas</li>
                <li>✓ Lacak denda yang belum dibayar secara rutin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
=======

      setSummary(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  const handleLogout = () => {

    logout();
    navigate("/");

  };

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow p-4">

        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Admin Camping Rental
          </h1>

          <button
            onClick={handleLogout}
            className="
            flex
            items-center
            gap-2
            px-4
            py-2
            text-red-600
            hover:bg-red-50
            rounded-lg
            "
          >
            <LogOut size={18}/>
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-6xl mx-auto p-6">

        <h2 className="text-3xl font-bold mb-8">
          Dashboard Owner
        </h2>

        {/* SUMMARY */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
        mb-10
        ">

          <div className="
          bg-white
          shadow
          rounded-xl
          p-5
          ">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  Total Barang
                </p>

                <h3 className="
                text-3xl
                font-bold
                mt-2
                ">
                  {summary.total_items}
                </h3>

              </div>

              <Box
              className="
              text-green-600
              "
              />

            </div>

          </div>

          <div className="
          bg-white
          shadow
          rounded-xl
          p-5
          ">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  Rental Pending
                </p>

                <h3 className="
                text-3xl
                font-bold
                text-yellow-600
                mt-2
                ">
                  {summary.pending_rentals}
                </h3>

              </div>

              <Clock3
              className="
              text-yellow-600
              "
              />

            </div>

          </div>

          <div className="
          bg-white
          shadow
          rounded-xl
          p-5
          ">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  Rental Aktif
                </p>

                <h3 className="
                text-3xl
                font-bold
                text-green-600
                mt-2
                ">
                  {summary.active_rentals}
                </h3>

              </div>

              <CheckCircle
              className="
              text-green-600
              "
              />

            </div>

          </div>

          <div className="
          bg-white
          shadow
          rounded-xl
          p-5
          ">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  Denda Belum Dibayar
                </p>

                <h3 className="
                text-3xl
                font-bold
                text-red-600
                mt-2
                ">
                  {summary.unpaid_fines}
                </h3>

              </div>

              <Wallet
              className="
              text-red-600
              "
              />

            </div>

          </div>

        </div>

        {/* MENU */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        ">

          <button
            onClick={() =>
              navigate("/admin/items")
            }
            className="
            bg-white
            p-6
            rounded-xl
            shadow
            hover:shadow-lg
            text-left
            "
          >

            <Package
            className="
            text-green-600
            mb-4
            "
            size={36}
            />

            <h3 className="
            text-xl
            font-semibold
            ">
              Kelola Barang
            </h3>

            <p className="
            text-gray-500
            mt-2
            ">
              Tambah barang, stok, kondisi.
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/admin/categories")
            }
            className="
            bg-white
            p-6
            rounded-xl
            shadow
            hover:shadow-lg
            text-left
            "
          >

            <Folder
            className="
            text-blue-600
            mb-4
            "
            size={36}
            />

            <h3 className="
            text-xl
            font-semibold
            ">
              Kelola Kategori
            </h3>

            <p className="
            text-gray-500
            mt-2
            ">
              Carrier, tenda, alat masak.
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/admin/rentals")
            }
            className="
            bg-white
            p-6
            rounded-xl
            shadow
            hover:shadow-lg
            text-left
            "
          >

            <ClipboardList
            className="
            text-yellow-600
            mb-4
            "
            size={36}
            />

            <h3 className="
            text-xl
            font-semibold
            ">
              Kelola Rental
            </h3>

            <p className="
            text-gray-500
            mt-2
            ">
              Approve dan return.
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/admin/fines")
            }
            className="
            bg-white
            p-6
            rounded-xl
            shadow
            hover:shadow-lg
            text-left
            "
          >

            <AlertTriangle
            className="
            text-red-600
            mb-4
            "
            size={36}
            />

            <h3 className="
            text-xl
            font-semibold
            ">
              Kelola Denda
            </h3>

            <p className="
            text-gray-500
            mt-2
            ">
              Kerusakan dan keterlambatan.
            </p>

          </button>

        </div>

      </div>

    </div>
  );

>>>>>>> ae722efe13e4ba0e72a28b65adc51e8dfbdbb72b
}

export default AdminDashboardPage;