import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminItemsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    description: "",
    price_per_day: "",
    stock: "",
    item_condition: "baik",
  });

  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    const res = await axios.get(`${API_URL}/api/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCategories(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category_id: "",
      description: "",
      price_per_day: "",
      stock: "",
      item_condition: "baik",
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_id) {
      alert("Kategori wajib dipilih");
      return;
    }

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price_per_day: Number(form.price_per_day),
      stock: Number(form.stock),
    };

    if (editId) {
      await axios.put(`${API_URL}/api/items/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${API_URL}/api/items`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    resetForm();
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      name: item.name,
      category_id: item.category_id || "",
      description: item.description || "",
      price_per_day: item.price_per_day,
      stock: item.stock,
      item_condition: item.item_condition || "baik",
    });
  };

const handleDelete = async (id) => {
  if (!window.confirm("Hapus barang ini?")) return;

  try {
    await axios.delete(`${API_URL}/api/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchItems();
  } catch (err) {
    alert(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal menghapus barang"
    );
  }
};

const getConditionLabel = (condition) => {
  switch (condition) {
    case "baik":
      return "✨ Sempurna";
    case "rusak_ringan":
      return "⚠️ Ada Lecet";
    case "rusak_berat":
      return "🔴 Rusak Parah";
    case "hilang":
      return "❌ Hilang";
    default:
      return "Tidak Diketahui";
  }
};

const getConditionStyle = (condition) => {
  switch (condition) {
    case "baik":
      return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-300";
    case "rusak_ringan":
      return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300";
    case "rusak_berat":
      return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300";
    case "hilang":
      return "bg-gradient-to-r from-gray-200 to-slate-200 text-gray-700 border border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-green-600" />
            Kelola Barang
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-5 lg:col-span-1"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Barang" : "Tambah Barang"}
          </h2>

          <input
            name="name"
            placeholder="Nama barang"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3"
            required
          />

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3"
            required
          >
            <option value="">Pilih Kategori</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3"
          />

          <input
            name="price_per_day"
            type="number"
            placeholder="Harga per hari"
            value={form.price_per_day}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3"
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-3"
            required
          />

          <select
            name="item_condition"
            value={form.item_condition}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="baik">✨ Sempurna</option>
            <option value="rusak_ringan">⚠️ Ada Lecet</option>
            <option value="rusak_berat">🔴 Rusak Parah</option>
            <option value="hilang">❌ Hilang</option>
          </select>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
            {editId ? "Update Barang" : "Tambah Barang"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-3 bg-gray-200 py-3 rounded-lg"
            >
              Batal Edit
            </button>
          )}
        </form>

        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>

                  <p className="text-sm text-gray-500">
                    Kategori: {item.category_name || "-"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Total Unit: {item.total_units || 0}
                  </p>

                  <p className="text-sm text-gray-500">
                    Available: {item.available_stock || 0} |
                    Rented: {item.rented_stock || 0}
                  </p>

                  <p className="text-sm text-gray-500">
                    Maintenance: {item.maintenance_stock || 0} |
                    Lost: {item.lost_stock || 0}
                  </p>
                  <p className="font-semibold text-green-600 mt-2">
                    Rp {Number(item.price_per_day).toLocaleString()}/hari
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${getConditionStyle(item.item_condition)}`}>
                      {getConditionLabel(item.item_condition)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/item-units", {
                        state: { item },
                      })
                    }
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Kelola Unit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminItemsPage;