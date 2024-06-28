import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import ProductsCatalog from './pages/ProductsCatalog';
import CreateProduct from './pages/CreateProduct';
import UpdateProduct from './pages/UpdateProduct';
import Homepage from './pages/Home';

import './App.css';

import { UserProvider } from './UserContext';
import ProductCatalog from './pages/ProductCatalog';
import AdminView from './pages/AdminDashboard';
import Cart from './pages/GetAllCart';

function App() {

  const [user, setUser] = useState({
    id: null
  });

  const unsetUser = () => {

    localStorage.clear();

  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${ localStorage.getItem('token') }`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (typeof data.user !== undefined) {
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin
          });
        } else {
          setUser({
            id: null
          });
        }
      })
    }
    

  }, []);

return (
  <UserProvider value={{user, setUser, unsetUser}}>
    <Router>
      <Container>
        <Routes>
          {user?.isAdmin ?
            <>
              <Route path="/dashboard" element={<AdminView />} />
              <Route path="/add-product" element={<CreateProduct />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
            </>
            :
            <>
              <Route path="/products" element={<ProductsCatalog />} />  
              <Route path="/product/:id" element={<ProductCatalog />} />
              <Route path="/cart" element={<Cart />} />
            </>
          }
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Container>
    </Router>
  </UserProvider>
);
}

export default App;