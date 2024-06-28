import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

	const {user} = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
	const [email,setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

	function registerUser(e) {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`,{

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
				// "Access-Control-Allow-Origin": "*"
				"Access-Control-Allow-Origin":  "http://localhost:3000"
            },
            body: JSON.stringify({

                firstName: firstName,
                lastName: lastName,
                email: email,
                mobileNo: mobileNumber,
                password: password,

            })

		})
		.then(res => res.json())
		.then(data => {

		if(data.message === "Registered Successfully"){

			setEmail('');
			setPassword('');
			setConfirmPassword('');

			Swal.fire({
        	    title: "Registration Successful",
        	    icon: "success",
        	    text: "Thank you for registering!"
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

		if((email !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword)){

			setIsActive(true)

		} else {

			setIsActive(false)

		}

	},[firstName, lastName, email, mobileNumber, password, confirmPassword]);

	return (

		(user.id !== null) ?
		    <Navigate to="/courses" />
		:
			
			<Form onSubmit={(e) => registerUser(e)}>
			<h1 className="my-5 text-center">Register</h1>

                <Form.Group>
					<Form.Label>First Name:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Your First Name" 
					required 
					value={firstName} 
					onChange={e => {setFirstName(e.target.value)}}/>
                </Form.Group>
                <Form.Group>
					<Form.Label>Last Name:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Your Last Name" 
					required 
					value={lastName} 
					onChange={e => {setLastName(e.target.value)}}/>
                </Form.Group>
				<Form.Group>
					<Form.Label>Email:</Form.Label>
					<Form.Control 
					type="email"
					placeholder="Enter Email" 
					required 
					value={email} 
					onChange={e => {setEmail(e.target.value)}}/>
				</Form.Group>
                <Form.Group>
					<Form.Label>Mobile Number:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Your Mobile Number" 
					required 
					value={mobileNumber} 
					onChange={e => {setMobileNumber(e.target.value)}}/>
                </Form.Group>
				<Form.Group>
					<Form.Label>Password:</Form.Label>
					<Form.Control 
					type="password" 
					placeholder="Enter your password" 
					required 
					value={password} 
					onChange={e => {setPassword(e.target.value)}}/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Verify Password:</Form.Label>
					<Form.Control 
					type="password" 
					placeholder="Verify your password" 
					required 
					value={confirmPassword} 
					onChange={e => {setConfirmPassword(e.target.value)}}/>
				</Form.Group>
				{
					isActive

					? <Button variant="danger" className="mt-3" type="submit">Please enter your registration details</Button>
					: <Button variant="danger" className="mt-3" disabled>Please enter your registration details</Button>
				}
                <p className="mt-3 text-center">
					Already have an account? <Link to="/login">Click here</Link> to log in.
				</p>
			</Form>

		)
}