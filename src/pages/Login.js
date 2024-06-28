import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`,{

		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		body: JSON.stringify({

			email: email,
			password: password

		})
	})
	.then(res => res.json())
	.then(data => {
		
		if(data.access){

			localStorage.setItem('token', data.access);
			retrieveUserDetails(data.access);

			Swal.fire({
        	    title: "Login Successful",
        	    icon: "success",
        	    text: "Welcome to Zuitt!"
        	});
		
		} else {

			Swal.fire({
                title: "Authentication failed",
                icon: "error",
                text: "Check your login details and try again."
            });
		}
	})

	setEmail('');
	setPassword('');


    }


    const retrieveUserDetails = (token) => {

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {

            setUser({
            	id: data.user._id,
				isAdmin: data.user.isAdmin,
            });

        })

    };

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
		<>
			{(user.id !== null) ?
				<>
					{user.isAdmin ? 
						<Navigate to="/dashboard" />
						:
						<Navigate to="/products" />
					}
				</>
				:
				<Form onSubmit={(e) => authenticate(e)}>
					<h1 className="my-5 text-center">Login</h1>
					<Form.Group controlId="userEmail">
						<Form.Label>Email:</Form.Label>
						<Form.Control 
							type="text"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group controlId="password">
						<Form.Label>Password:</Form.Label>
						<Form.Control 
							type="password" 
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Group>

					{ isActive ? 
						<Button variant="primary" className="my-3 w-100" type="submit" id="submitBtn">
							Submit
						</Button>
						: 
						<Button variant="primary" className="my-3 w-100" type="submit" id="submitBtn" disabled>
							Submit
						</Button>
					}
					<p className="mt-3 text-center">
						Don't have an account yet? <Link to="/register">Click here</Link> to register.
					</p>
				</Form>
			}
		</>
    )
}