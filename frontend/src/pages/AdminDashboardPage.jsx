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

    fetchSummary();

  }, []);

  const fetchSummary = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

}

export default AdminDashboardPage;