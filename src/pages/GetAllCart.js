import { useState, useEffect, useContext } from 'react';
import { Row, Button, Form, Col } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import UserContext from '../UserContext';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

export default function Cart() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState(null);
    console.log("USER ID", user.id);
    console.log("ACCESS TOKEN", localStorage.getItem('token'));

    function getCart() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => res.json())
        .then(async data => {
            console.log(data);
        
            if (data.cart) {
                const { cartItems } = data.cart;
                const formattedCartItems = cartItems?.map(async (cartItem) => {
                    const [productDetails] = await Promise.all([getProductDetails(cartItem.productId)]);
                    return {
                        productName: productDetails.name,
                        productDescription: productDetails.description,
                        productPrice: productDetails.price,
                        ...cartItem,
                    }
                });
                setCartItems(await Promise.all(formattedCartItems));
                setCart(data.cart);
            } else {
                console.log('Failed to fetch cart items');
            }
        });
    };

    async function getProductDetails(productId) {
        const product = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
		})
		.then(res => res.json())
        .then(data => {
            return data.product;
        });
        return product;
    }

    useEffect(() => {
        getCart();
    }, []);

    function removeItemFromCart(productId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        }).then(res => res.json())
        .then(data => {
            getCart();
        })

    }

    function checkout() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
        .then(res => res.json())
        .then(data => {
        getCart();
        Swal.fire({
            title: 'Order Successfully Placed',
            icon: 'success',
            text: "Thank you for shopping with us!"
        });
        });
    }

    function clearCart() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear/cart`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        }).then(res => res.json())
        .then(data => {
            getCart();
        })
    }

    function updateQuantity(itemId, quantity) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                itemId: itemId,
                quantity: quantity
            })
        }).then(res => res.json())
        .then(data => {
            getCart();
        })
    }

    const handleDecrement = (itemId, quantity) => {
        if (quantity > 0) {
            const newQuantity = quantity - 1; 
            updateQuantity(itemId, newQuantity);
        }
    };
    
    const handleIncrement = (itemId, quantity) => {
        const newQuantity = quantity + 1;
        updateQuantity(itemId, newQuantity);
    };

return (
    <>
    <Navbar />
<div>
    <h1 className="my-5 text-center">Your Shopping Cart</h1>

    {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
    ) : (   
    <>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {
                    cartItems?.map((item) => {
                        return (
                            <tr key={item.productId}>
                                <td>{item.productName}</td>
                                <td>₱{item.productPrice}</td>
                                <td>
                                <Row className="quantity-container">
                                    <Button onClick={() => handleDecrement(item._id, item.quantity)} className="quantity-btn">-</Button>
                                    <Form.Control type="number" value={item.quantity} className="quantity-input" readOnly />
                                    <Button onClick={() => handleIncrement(item._id, item.quantity)} className="quantity-btn">+</Button>
                                </Row>
                                </td>
                                <td>₱{item.subtotal}</td>
                                <td><Button className='remove-btn' onClick={() => removeItemFromCart(item.productId)}>Remove</Button></td>
                            </tr>
                        )
                    })
                }
                <tr>
                    <td colSpan={5} className='justify-content-between'>
                            <Button className='btn-primary d-inline-block checkout-btn' onClick={() => checkout()}>Checkout</Button> 
                            <h3 style={{ float: 'right', marginRight: '6.5rem' }} className='d-inline-block'>Total: ₱{cart.totalPrice}</h3>
                    </td>
                </tr>
            </tbody>
        </Table>
        <Button className='clear-btn mt-2' onClick={() => clearCart()}>Clear Cart</Button>
    </>
    )}
    </div>
    </>
    );
}