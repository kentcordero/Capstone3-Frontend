import React, { useState, useEffect, useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import ProductsCatalog from './ProductsCatalog';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import Navbar from '../components/Navbar';

export default function AdminView() {
	const {user} = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [needRefresh, setNeedRefresh] = useState(false);

  function fetchProducts() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if(!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => setProducts(data.products));
  }
  
  useEffect(() => {
    fetchProducts();
    console.log({ user });
  }, []);
  
  function disableProduct(id) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        productId: id
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      fetchProducts();
    })
    .catch((err) => console.error(err));
  }

  function activateProduct(id) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      fetchProducts();
    })
    .catch((err) => console.error(err));
  }

  
  return (
    <>
    <Navbar />
      <h1 className="text-center mt-4">Admin Dashboard</h1>
      <div className='d-flex justify-content-center mb-4 '>
        <Link className='btn btn-primary' to={'/add-product'}>Add New Product</Link>
        <Link className='btn bg-success'>Show User Orders</Link>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td className={product.isActive ? 'text-success' : 'text-danger'}>
                  {product.isActive ? 'Available' : 'Unavailable'}
                </td>
                <td>
                  <Link className='btn btn-primary' to={`/update-product/${product._id}`}>Update</Link>
                  {product.isActive ?
                    <>
                      <Button className='bg-danger' onClick={() => {
                        console.log("DISABLE CLICKED")
                        disableProduct(product._id);
                      }}>Disable</Button>
                    </>
                    :
                    <>
                      <Button className='bg-success' onClick={() => activateProduct(product._id)}>Enable</Button>
                    </>
                  }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}