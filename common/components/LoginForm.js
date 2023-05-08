import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function LoginForm() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log("submit")
        // console.log(event.target.username.value)
        // console.log(event.target.password.value)

        const endpoint = '/api/login';
        const data = {
            username: event.target.username.value,
            password: event.target.password.value
        };
        const JSONdata = JSON.stringify(data);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const resData = await response.json();
        console.log(resData);

        if (resData.message === 'ok') {
          // redirect to home page
          // window.location.href = '/';
          // reload the page
          window.location.reload();
        }else{
            alert(resData.message)
        }
    };

  return (
    <> 
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter your username" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>

    </>
  );
    
}