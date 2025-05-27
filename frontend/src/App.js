import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/web/Login";
import { Register } from "./pages/web/Register";
import { Dashboard } from "./pages/admin/Dashboard";
import { LayoutAdmin } from "./components/adminPage/layout/LayoutAdmin";
import { NotFound } from "./pages/web/NotFound";
import { VehicleManagement } from "./pages/admin/VehicleManagement";
import { AddVehicle } from "./pages/admin/VehicleManagement/AddVehicle";
import { EditVehicle } from "./pages/admin/VehicleManagement/EditVehicle";
import { DetailVehicle } from "./pages/admin/VehicleManagement/DetailVehicle";
import { CustomerSearch } from "./pages/admin/Rental/CustomerSearch";
import { VehicleSearch } from "./pages/admin/Rental/VehicleSearch";
import { ContractDraft } from "./pages/admin/Rental/Contract";
import { SearchContractPage } from "./pages/admin/CompletedRental/SearchContract";
import { ContractDetailPage } from "./pages/admin/CompletedRental/ContractDetail";
import { Invoice } from "./pages/admin/CompletedRental/Invoice";
import { SearchContractBooked } from "./pages/admin/Rental/SearchContractBooked";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<LayoutAdmin />}>
          {/*Dashboard*/}
          <Route path="/admin" element={<Dashboard />} />
          {/* Rental*/}
          {/* Tìm/Thêm Khách hàng */}
          <Route path="/rental/customerSearch" element={<CustomerSearch />} />
          <Route
            path="/rental/contractSearch"
            element={<SearchContractBooked />}
          />
          {/* Tìm/Chọn Xe*/}
          <Route path="/rental/vehicles" element={<VehicleSearch />} />
          <Route path="/rental/contract/draft" element={<ContractDraft />} />
          {/* Completed Rental*/}
          <Route path="/completedRental" element={<SearchContractPage />} />

          <Route
            path="/completedRental/contract/:contractId"
            element={<ContractDetailPage />}
          />
          <Route
            path="/completedRental/invoice/:contractId"
            element={<Invoice />}
          />
          {/*Management*/}
          {/*Vehicle Management*/}
          <Route
            path="admin/management/vehicle"
            element={<VehicleManagement />}
          />
          <Route path="admin/management/vehicle/add" element={<AddVehicle />} />
          <Route
            path="admin/management/vehicle/edit/:id"
            element={<EditVehicle />}
          />
          <Route
            path="admin/management/vehicle/detail/:id"
            element={<DetailVehicle />}
          />
        </Route>
        {/*Login*/}
        <Route path="/login" element={<Login />} />
        {/*Register*/}
        <Route path="/register" element={<Register />} />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
