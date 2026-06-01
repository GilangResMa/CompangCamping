import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import RentalPage from "./pages/RentalPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRentalsPage from "./pages/AdminRentalPage";
import AdminItemsPage from "./pages/AdminItemsPage";
import AdminFinesPage from "./pages/AdminFinesPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminItemUnitsPage from "./pages/AdminItemUnitsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/rental" element={<RentalPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/rentals" element={<AdminRentalsPage />} />
          <Route path="/admin/items" element={<AdminItemsPage />} />
          <Route path="/admin/fines" element={<AdminFinesPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/item-units" element={<AdminItemUnitsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
