import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from './pages/BookingConfirmation';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />

        <Route path="properties/:documentId" element={<PropertyDetail />} />
        <Route path="booking" element={<BookingForm />} />
        <Route path="booking/verify" element={<BookingConfirmation />} />
        <Route path="about" element={<Navigate to="/#about" replace />} />
        <Route path="contact" element={<Navigate to="/#contact" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
