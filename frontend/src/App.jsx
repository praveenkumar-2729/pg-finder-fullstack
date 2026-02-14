import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

import Home from './components/Home'
import Navbar from './components/Navbar'

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import OwnerDashboard from "./pages/pg_owner/OwnerDashboard";
import Post from "./pages/pg_owner/Post";
import MyPGs from './pages/pg_owner/MyPGs';
import EditPG from './pages/pg_owner/EditPG';
import PGDetails from './pages/pg_owner/PGDetails';
import AddRoom from './pages/pg_owner/AddRoom';

import PrivateRoutes from './routes/PrivateRoutes';

import UserDashboard from './pages/user/UserDashboard';
import UserPGDetail from './pages/user/UserPGDetail';
import BookingPage from './pages/user/BookingPage';
import MyBookings from './pages/user/MyBookings';
import ManagePGs from './pages/pg_owner/ManagePGs';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />

      <Routes>

        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/pg/:pgId" element={<UserPGDetail />} />
        <Route path="/book/:pgId/:roomId" element={<BookingPage />} />

        <Route path="/user/my-bookings" element={<MyBookings />} />

        {/* ===== USER PROTECTED ===== */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoutes role="user">
              <UserDashboard />
            </PrivateRoutes>
          }
        />

        {/* ===== OWNER PROTECTED ===== */}

        {/* Dashboard */}
        <Route
          path="/pgowner/dashboard"
          element={
            <PrivateRoutes role="owner">
              <OwnerDashboard />
            </PrivateRoutes>
          }
        />

        {/* Register PG */}
        <Route
          path="/owner/register-pg"
          element={
            <PrivateRoutes role="owner">
              <Post />
            </PrivateRoutes>
          }
        />

        {/* My PGs (VIEW ONLY) */}
        <Route
          path="/owner/my-pgs"
          element={
            <PrivateRoutes role="owner">
              <MyPGs />
            </PrivateRoutes>
          }
        />


        {/* PG DETAILS (rooms + add room + edit/delete) */}
        <Route
          path="/owner/pg-details/:pgId"
          element={
            <PrivateRoutes role="owner">
              <PGDetails />
            </PrivateRoutes>
          }
        />
        <Route
          path="/owner/manage-pgs"
          element={
            <PrivateRoutes role="owner">
              <ManagePGs />
            </PrivateRoutes>
          }
        />

        {/* ADD ROOM for a specific PG */}
        <Route
          path="/owner/add-room/:pgId"
          element={
            <PrivateRoutes role="owner">
              <AddRoom />
            </PrivateRoutes>
          }
        />

        {/* EDIT PG */}
        <Route
          path="/owner/edit-pg/:id"
          element={
            <PrivateRoutes role="owner">
              <EditPG />
            </PrivateRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
