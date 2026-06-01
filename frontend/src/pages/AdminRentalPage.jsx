import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminRentalsPage() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRental, setSelectedRental] = useState(null);
  const [rentalUnits, setRentalUnits] = useState([]);

  const [conditionForm, setConditionForm] = useState({
    unit_id: "",
    condition_after: "baik",
    notes: "",
    photo_url: "",
    fine_amount: "",
    fine_reason: "",
  });

  const token = localStorage.getItem("token");

  const fetchRentals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/rentals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    setRentals(
      res.data.sort((a, b) => b.id - a.id)
    );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentalUnits = async (rental) => {
    try {
      const res = await axios.get(`${API_URL}/api/rentals/${rental.id}/units`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedRental(rental);
      setRentalUnits(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal mengambil unit rental");
    }
  };

  const resetConditionForm = () => {
    setConditionForm({
      unit_id: "",
      condition_after: "baik",
      notes: "",
      photo_url: "",
      fine_amount: "",
      fine_reason: "",
    });
  };

  const updateUnitCondition = async (unit) => {
    try {
      await axios.put(
        `${API_URL}/api/item-units/${unit.unit_id}/condition`,
        {
          rental_id: selectedRental.id,
          condition_after: conditionForm.condition_after,
          notes: conditionForm.notes,
          photo_url: conditionForm.photo_url || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (conditionForm.fine_amount && Number(conditionForm.fine_amount) > 0) {
        await axios.post(
          `${API_URL}/api/fines`,
          {
            rental_id: selectedRental.id,
            amount: Number(conditionForm.fine_amount),
            reason:
              conditionForm.fine_reason ||
              conditionForm.notes ||
              "Denda kerusakan barang",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      resetConditionForm();
      fetchRentalUnits(selectedRental);
      fetchRentals();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal update kondisi unit"
      );
    }
  };

  const updateRental = async (id, action) => {
    try {
      await axios.put(
        `${API_URL}/api/rentals/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRentals();

      if (selectedRental?.id === id) {
        fetchRentalUnits(selectedRental);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal update rental"
      );
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const statusClass = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "returned") return "bg-blue-100 text-blue-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const unitStatusClass = (status) => {
    if (status === "available") return "bg-green-100 text-green-700";
    if (status === "rented") return "bg-blue-100 text-blue-700";
    if (status === "maintenance") return "bg-yellow-100 text-yellow-700";
    if (status === "lost") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const conditionClass = (condition) => {
    if (condition === "baik") return "bg-green-100 text-green-700";
    if (condition === "rusak_ringan") return "bg-yellow-100 text-yellow-700";
    if (condition === "rusak_berat") return "bg-red-100 text-red-700";
    if (condition === "hilang") return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const updateFieldForUnit = (unit, field, value) => {
    setConditionForm({
      ...conditionForm,
      unit_id: unit.unit_id,
      [field]: value,
    });
  };

  const getFieldValue = (unit, field, fallback = "") => {
    if (conditionForm.unit_id === unit.unit_id) {
      return conditionForm[field];
    }

    return fallback;
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
            <ClipboardList className="text-blue-600" />
            Kelola Rental
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <p>Loading...</p>
        ) : rentals.length === 0 ? (
          <p>Belum ada data rental.</p>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div key={rental.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-xl">
                      Rental #{rental.id}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      Penyewa: {rental.user_name || rental.user_id}
                    </p>

                    <p className="text-sm text-gray-600">
                      Tanggal sewa: {rental.rental_date}
                    </p>

                    <p className="text-sm text-gray-600">
                      Tanggal kembali: {rental.return_date}
                    </p>

                    <p className="text-sm text-gray-600">
                      Actual return: {rental.actual_return_date || "-"}
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                      Unit dipinjam: {rental.rented_units || "-"}
                    </p>

                    <span
                      className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClass(
                        rental.status
                      )}`}
                    >
                      Status: {rental.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 min-w-40">
                    <button
                      onClick={() => fetchRentalUnits(rental)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                      Cek Unit
                    </button>

                    {rental.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateRental(rental.id, "approve")}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateRental(rental.id, "cancel")}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {rental.status === "active" && (
                      <button
                        onClick={() => updateRental(rental.id, "return")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                Unit Rental #{selectedRental.id}
              </h2>

              <button
                onClick={() => {
                  setSelectedRental(null);
                  resetConditionForm();
                }}
                className="text-red-600 font-semibold"
              >
                Tutup
              </button>
            </div>

            {rentalUnits.length === 0 ? (
              <p className="text-gray-500">Tidak ada unit pada rental ini.</p>
            ) : (
              <div className="space-y-4">
                {rentalUnits.map((unit) => (
                  <div
                    key={unit.rental_unit_id}
                    className="border rounded-xl p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {unit.item_name} - {unit.unit_code}
                      </h3>

                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${conditionClass(
                            unit.condition_status
                          )}`}
                        >
                          Kondisi: {unit.condition_status}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${unitStatusClass(
                            unit.availability_status
                          )}`}
                        >
                          Status: {unit.availability_status}
                        </span>
                      </div>

                      {unit.notes && (
                        <p className="text-sm text-gray-500 mt-2">
                          Catatan: {unit.notes}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <select
                        value={getFieldValue(
                          unit,
                          "condition_after",
                          unit.condition_status || "baik"
                        )}
                        onChange={(e) =>
                          updateFieldForUnit(
                            unit,
                            "condition_after",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-lg"
                      >
                        <option value="baik">Baik</option>
                        <option value="rusak_ringan">Rusak Ringan</option>
                        <option value="rusak_berat">Rusak Berat</option>
                        <option value="hilang">Hilang</option>
                      </select>

                      <input
                        placeholder="Catatan kondisi"
                        value={getFieldValue(unit, "notes")}
                        onChange={(e) =>
                          updateFieldForUnit(unit, "notes", e.target.value)
                        }
                        className="border p-3 rounded-lg"
                      />

                      <input
                        placeholder="URL Foto"
                        value={getFieldValue(unit, "photo_url")}
                        onChange={(e) =>
                          updateFieldForUnit(unit, "photo_url", e.target.value)
                        }
                        className="border p-3 rounded-lg"
                      />

                      <input
                        type="number"
                        placeholder="Nominal denda"
                        value={getFieldValue(unit, "fine_amount")}
                        onChange={(e) =>
                          updateFieldForUnit(
                            unit,
                            "fine_amount",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-lg"
                      />

                      <input
                        placeholder="Alasan denda"
                        value={getFieldValue(unit, "fine_reason")}
                        onChange={(e) =>
                          updateFieldForUnit(
                            unit,
                            "fine_reason",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-lg"
                      />

                      <button
                        onClick={() => updateUnitCondition(unit)}
                        className="bg-green-600 text-white rounded-lg py-3"
                      >
                        Simpan Kondisi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRentalsPage;