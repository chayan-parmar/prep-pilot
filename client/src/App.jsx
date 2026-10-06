import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: "#13132a",
            color: "#e8e8f0",
            border: "1px solid #2a2a3d",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;