import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard"
import { CardGroup, Col, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";

export default function ProductsCatalog() {
    const [products, setProducts] = useState([]);

    function fetchProducts() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`,{

            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`

            },
		})
		.then(res => res.json())
        .then(data => setProducts(data.products));
    };

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <>
        <Navbar />
        <h2 className="text-center py-4">Our Products</h2>
            <Row>
            {products?.map((product) => {
                console.log(product);
                const { name, description, price, _id } = product
                    return (
                        <Col sm={4}>
                            <ProductCard name={name} description={description} price={price} id={_id} />
                        </Col>
                    )
                })}
            </Row>
        </>
    )
}