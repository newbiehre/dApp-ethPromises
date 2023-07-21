import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./layouts/Layout";
import { MyPage } from "./pages/MyPage";
import { OthersPage } from "./pages/OthersPage";
import { PublicPage } from "./pages/PublicPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PublicPage />} />
        <Route path="my-promises" element={<MyPage />} />
        <Route path="others-promises" element={<OthersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
