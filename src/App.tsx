import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from './pages/BookingConfirmation';

// Temporary placeholder pages
// const HomePage = () => (
//   <div className="container mx-auto px-4 py-16">
//     <h1 className="text-4xl font-bold text-primary">Home Page</h1>
//     <p className="mt-4 text-gray-600">This will be the home page with hero section and featured properties.</p>
//   </div>
// );

// const PropertiesPage = () => (
//   <div className="container mx-auto px-4 py-16">
//     <h1 className="text-4xl font-bold text-primary">Properties Page</h1>
//     <p className="mt-4 text-gray-600">This will show all available properties.</p>
//   </div>
// );

const AboutPage = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-primary">About Page</h1>
    <p className="mt-4 text-gray-600">Information about Lagos Beach Rentals.</p>
  </div>
);

const ContactPage = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-primary">Contact Page</h1>
    <p className="mt-4 text-gray-600">Get in touch with us.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />

        <Route path="properties/:documentId" element={<PropertyDetail />} />
        <Route path="booking" element={<BookingForm />} />
        <Route path="booking/verify" element={<BookingConfirmation />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

export default App;
