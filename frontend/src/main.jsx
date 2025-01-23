
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition:Bounce />
  </BrowserRouter>


)
