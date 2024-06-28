import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function CreateProduct() {

	const {user} = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
	const [price,setPrice] = useState(0);
    const [isActive, setIsActive] = useState(false);

	function createProduct(e) {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`,{

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({

                name: name,
                description: description,
                price: price,
            })

		})
		.then(res => res.json())
		.then(data => {

		if(data.product){

			setName('');
			setDescription('');
			setPrice(0);

			Swal.fire({
        	    title: "Product Added Successfully",
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
    


	useEffect(()=>{

		if((name !== "" && description !=="" && price !=="")){

			setIsActive(true)

		} else {

			setIsActive(false)

		}

	},[name, description, price]);

	return (

		(user?.id == null) ?
		    <Navigate to="/login" />
		:
			
			<Form onSubmit={(e) => createProduct(e)}>
			<h1 className="my-5 text-center">Add Products</h1>

                <Form.Group>
					<Form.Label>Name:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Product Name" 
					required 
					value={name} 
					onChange={e => {setName(e.target.value)}}/>
                </Form.Group>
                <Form.Group>
					<Form.Label>Description:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Description" 
					required 
					value={description} 
					onChange={e => {setDescription(e.target.value)}}/>
                </Form.Group>
				<Form.Group>
					<Form.Label>Price:</Form.Label>
					<Form.Control 
					type="number"
					placeholder="Enter Price" 
					required 
					value={price} 
					onChange={e => {setPrice(e.target.value)}}/>
				</Form.Group>
                <Button type='submit'>Add Product</Button>
			</Form>
		)
}