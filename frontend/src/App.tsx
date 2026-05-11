import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import DigitalGoods from "./pages/DigitalGoods";
import FreelancerEscrow from "./pages/FreelancerEscrow";
import RWA from "./pages/RWA";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/digital-goods" element={<DigitalGoods />} />
          <Route path="/freelancers" element={<FreelancerEscrow />} />
          <Route path="/rwa" element={<RWA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
