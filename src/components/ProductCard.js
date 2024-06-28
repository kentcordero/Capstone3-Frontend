import { Card, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';





export default function ProductCard({ name, description, price, id}) {

    return (
        <Card className='product-card my-3'>
            <Card.Body className='px-3 py-4'>
            <Card.Title className='text-center blue-text'>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Text className='mt-5 orange-text'>₱{price}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <Link className="btn btn-primary w-100" to={`/product/${id}`}>Details</Link>
            </Card.Footer>
        </Card>
    )
}