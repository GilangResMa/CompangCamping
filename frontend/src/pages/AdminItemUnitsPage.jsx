import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Boxes } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminItemUnitsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const item = location.state?.item;

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [newUnitCode, setNewUnitCode] = useState("");
  const [generateAmount, setGenerateAmount] = useState("");

  const [form, setForm] = useState({
    condition_after: "baik",
    photo_url: "",
    notes: "",
  });

  const fetchUnits = async () => {
    if (!item?.id) return;

    const res = await axios.get(`${API_URL}/api/item-units/item/${item.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUnits(res.data);
  };
  const addUnit = async () => {
  if (!newUnitCode) {
    alert("Kode unit wajib diisi");
    return;
  }

  try {
    await axios.post(
      `${API_URL}/api/item-units`,
      {
        item_id: item.id,
        unit_code: newUnitCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNewUnitCode("");
    fetchUnits();
      } 
    catch (err) {
    alert(err.response?.data?.error || "Gagal tambah unit");
      }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const openUpdate = (unit) => {
    setSelectedUnit(unit);

    setForm({
      condition_after: unit.condition_status || "baik",
      photo_url: "",
      notes: unit.notes || "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateCondition = async (e) => {
    e.preventDefault();

    await axios.put(
      `${API_URL}/api/item-units/${selectedUnit.id}/condition`,
      {
        condition_after: form.condition_after,
        photo_url: form.photo_url || null,
        notes: form.notes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedUnit(null);
    fetchUnits();
  };

  const generateUnits = async () => {
  if (!generateAmount || Number(generateAmount) <= 0) {
    alert("Jumlah unit wajib lebih dari 0");
    return;
  }

  try {
    await axios.post(
      `${API_URL}/api/item-units/generate`,
      {
        item_id: item.id,
        total_unit: Number(generateAmount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGenerateAmount("");
    fetchUnits();
  } catch (err) {
    alert(err.response?.data?.message || err.response?.data?.error || "Gagal generate unit");
  }
};

const deleteUnit = async (unitId) => {
  if (!window.confirm("Hapus unit ini?")) return;

  try {
    await axios.delete(`${API_URL}/api/item-units/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUnits();
  } catch (err) {
    alert(err.response?.data?.message || err.response?.data?.error || "Gagal hapus unit");
  }
};

  if (!item) {
    return (
      <div className="p-8">
        <p>Data barang tidak ditemukan.</p>
        <button
          onClick={() => navigate("/admin/items")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  const badgeClass = (status) => {
    if (status === "available") return "bg-green-100 text-green-700";
    if (status === "rented") return "bg-blue-100 text-blue-700";
    if (status === "maintenance") return "bg-yellow-100 text-yellow-700";
    if (status === "lost") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const conditionClass = (condition) => {
    if (condition === "baik") return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-300";
    if (condition === "rusak_ringan") return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300";
    if (condition === "rusak_berat") return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300";
    if (condition === "hilang") return "bg-gradient-to-r from-gray-200 to-slate-200 text-gray-700 border border-gray-300";
    return "bg-gray-100 text-gray-700 border border-gray-300";
  };

  const conditionLabel = (condition) => {
    if (condition === "baik") return "✨ Sempurna";
    if (condition === "rusak_ringan") return "⚠️ Ada Lecet";
    if (condition === "rusak_berat") return "🔴 Rusak Parah";
    if (condition === "hilang") return "❌ Hilang";
    return "Tidak Diketahui";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/admin/items")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Boxes className="text-green-600" />
            Unit Barang
          </h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p className="text-gray-500">
            Total unit: {units.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
            <h3 className="font-bold mb-3">Generate Unit Baru</h3>

            <div className="flex gap-3">
              <input
                type="number"
                value={generateAmount}
                onChange={(e) => setGenerateAmount(e.target.value)}
                placeholder="Jumlah unit, contoh: 5"
                className="flex-1 border rounded-lg p-3"
              />

              <button
                type="button"
                onClick={generateUnits}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700"
              >
                Generate
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Kode unit otomatis dari nama barang, contoh: {item.name.replace(/\s+/g, "-").toUpperCase()}-001
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-xl shadow p-5 border border-gray-100"
            >
              <h3 className="font-bold text-lg">{unit.unit_code}</h3>

              <div className="flex gap-2 mt-3 flex-wrap">
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${conditionClass(
                    unit.condition_status
                  )}`}
                >
                  {conditionLabel(unit.condition_status)}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${badgeClass(
                    unit.availability_status
                  )}`}
                >
                  {unit.availability_status}
                </span>
              </div>

              {unit.notes && (
                <p className="text-sm text-gray-600 mt-3">
                  Catatan: {unit.notes}
                </p>
              )}

              <button
                onClick={() => openUpdate(unit)}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Update Kondisi
              </button>

              <button
                onClick={() => deleteUnit(unit.id)}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Hapus Unit
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <form
            onSubmit={updateCondition}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              Update {selectedUnit.unit_code}
            </h2>

            <label className="block text-sm text-gray-600 mb-1">
              Kondisi Baru
            </label>

            <select
              name="condition_after"
              value={form.condition_after}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="baik">✨ Sempurna</option>
              <option value="rusak_ringan">⚠️ Ada Lecet</option>
              <option value="rusak_berat">🔴 Rusak Parah</option>
              <option value="hilang">❌ Hilang</option>
            </select>

            <label className="block text-sm text-gray-600 mb-1">
              URL Foto Kondisi
            </label>

            <input
              name="photo_url"
              value={form.photo_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-3 border rounded-lg mb-4"
            />

            <label className="block text-sm text-gray-600 mb-1">
              Catatan
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Contoh: sobek kecil di bagian pintu"
              className="w-full p-3 border rounded-lg mb-4"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-lg"
              >
                Simpan
              </button>

              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminItemUnitsPage;