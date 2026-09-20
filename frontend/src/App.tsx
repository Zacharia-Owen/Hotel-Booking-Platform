import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminPage from './pages/AdminPage'
import CancelBookingPage from "./pages/CancelBookingPage";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cancel-booking" element={<CancelBookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App