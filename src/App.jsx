import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  const location = useLocation();

  /* HIDE LAYOUT */
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Header />}

      <AppRoutes />

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
