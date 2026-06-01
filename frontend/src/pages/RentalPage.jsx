import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import { Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function RentalPage() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // [{item_id, quantity, name, price}]
  const [rentalDate, setRentalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItem = location.state?.selectedItem;

    useEffect(() => {
      fetchItems();

      if (selectedItem) {
        setSelectedItems([
          {
            item_id: selectedItem.id,
            name: selectedItem.name,
            price: Number(selectedItem.price_per_day),
            quantity: 1,
          },
        ]);
      }
    }, []);
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    if (item.available_stock <= 0) return;

    const existing = selectedItems.find((i) => i.item_id === item.id);

    if (existing) {
      if (existing.quantity >= item.available_stock) {
        alert("Jumlah melebihi stok tersedia");
        return;
      }

      setSelectedItems(
        selectedItems.map((i) =>
          i.item_id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          item_id: item.id,
          name: item.name,
          price: Number(item.price_per_day),
          stock: item.available_stock,
          quantity: 1,
        },
      ]);
    }
  };
  const removeFromCart = (itemId) => {
    setSelectedItems(selectedItems.filter(i => i.item_id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const selected = selectedItems.find((i) => i.item_id === itemId);

    if (selected && newQuantity > selected.stock) {
      alert("Jumlah melebihi stok tersedia");
      return;
    }

    setSelectedItems(
      selectedItems.map((i) =>
        i.item_id === itemId
          ? { ...i, quantity: newQuantity }
          : i
      )
    );
  };

  const calculateTotal = () => {
    const days = rentalDate && returnDate 
      ? Math.ceil((new Date(returnDate) - new Date(rentalDate)) / (1000 * 3600 * 24)) 
      : 0;
    
    return selectedItems.reduce((total, item) => {
      return total + (item.price * item.quantity * days);
    }, 0);
  };

  const handleBooking = async () => {
    if (!rentalDate || !returnDate || selectedItems.length === 0) {
      setMessage('Mohon lengkapi tanggal dan pilih barang');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/rentals`, {
        user_id: user.id,
        rental_date: rentalDate,
        return_date: returnDate,
        items: selectedItems.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity
        }))
      });

      setMessage('✅ Booking berhasil! Silakan cek riwayat sewa Anda.');
      setSelectedItems([]); // Reset keranjang
    } catch (err) {
      setMessage('❌ Gagal melakukan booking: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/catalog')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} /> Kembali ke Katalog
          </button>
          <h1 className="text-2xl font-bold">Pemesanan Sewa</h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daftar Barang */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Pilih Peralatan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-green-600 font-bold mt-1">
                  Rp {item.price_per_day.toLocaleString()}/hari
                </p>
                <p className="text-sm text-gray-500">Stok tersedia: {item.available_stock}</p>
                
                <button
                  onClick={() => addToCart(item)}
                  className={`mt-4 w-full py-2.5 rounded-lg ${
                    item.available_stock <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  disabled={item.available_stock <= 0}
                >
                  {item.available_stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-6">
            <h3 className="font-semibold text-xl mb-5 flex items-center gap-2">
              <Clock /> Ringkasan Sewa
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal Sewa</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal Kembali</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Barang Dipilih ({selectedItems.length})</h4>
              {selectedItems.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada barang dipilih</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.item_id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.item_id, item.quantity - 1)} className="text-lg">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.item_id, item.quantity + 1)} className="text-lg">+</button>
                      <button onClick={() => removeFromCart(item.item_id)} className="text-red-500 text-sm ml-3">Hapus</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Sewa</span>
                <span>Rp {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || selectedItems.length === 0}
              className="mt-6 w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Memproses...' : 'Konfirmasi Booking'}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalPage;