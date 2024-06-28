import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Card, Button, Row, Col, Form } from "react-bootstrap";

export default function ProductCatalog() {
    const { id } = useParams();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };
    
    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    function addToCart() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId: selectedProduct._id,
                quantity: quantity
            })
        }).then (res => res.json())
        .then(data => {

            if(data.message == "Item added to cart successfully") {

                Swal.fire({
                    title: "Item added to cart successfully",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Something went wrong.",
                    icon: "error",
                    text: "Please try again later or contact us for assistance"
                });
            }
        })
    }

    function getProductDetails() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
		})
		.then(res => res.json())
        .then(data => {
            console.table(data.product);
            setSelectedProduct(data.product);
        });
    }
    
    useEffect(() => {
        getProductDetails();
    }, [])

    return (
        <Card>
            <Card.Header className="bg-dark text-light text-center">{selectedProduct?.name}</Card.Header>
            <Card.Body>
                <Card.Text>{selectedProduct?.description}</Card.Text>
                <Card.Text>
                Price: <span className="orange-text">₱{selectedProduct?.price}</span>
                </Card.Text>
                <Card.Text>Quantity:</Card.Text>
                <Row className="quantity-container">
                        <Button onClick={handleDecrement} className="quantity-btn">-</Button>
                        <Form.Control type="number" value={quantity} className="quantity-input" readOnly />
                        <Button onClick={handleIncrement} className="quantity-btn">+</Button>
                </Row>
            </Card.Body>
            <Card.Footer>
                <Button className="addcart-btn" onClick={() => addToCart()}>Add to Cart</Button>
            </Card.Footer>
        </Card>
    );
}