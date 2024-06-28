import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function UpdateProduct() {
    const { user } = useContext(UserContext);
    const { id } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [product, setProduct] = useState(null);
    const [isActive, setIsActive] = useState(false);

    function fetchProduct(id) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => res.json())
        .then(data => {
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setProduct(data.product);
        });
        console.log(localStorage.getItem('token'))
    }

    useEffect(() => {
        fetchProduct(id);
    }, [])

    const updateProduct = (e) => {
        e.preventDefault();
        console.log({ user })

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/update`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Product updated successfully") {

                Swal.fire({
                title: 'Product Updated Successfully',
                icon: 'success',
                });
            } else {
                Swal.fire({
                title: 'Something went wrong.',
                icon: 'error',
                text: 'Please try again later or contact us for assistance',
                });
            }
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        if (name !== '' && description !== '' && price !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [name, description, price]);

    return (
    <>
        {user.id == null ? (
            <Navigate to="/login" />
        ) : (
        <>
            <Form onSubmit={updateProduct}>
                <Modal.Title>Edit Product</Modal.Title>
                <Form.Group>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Product Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>
                <Button disabled={!isActive} variant="success" type="submit">
                    Update
                </Button>
            </Form>
        </>
        )}
    </>
    );
}