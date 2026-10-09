import "./App.css";
import "./assets/styles/global.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '3px solid var(--border)',
            borderRadius: '0',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          },
        }} 
      />
    </>
  );
}

export default App;
