import axios from 'axios'
import { Form, Row, Col, Button } from 'react-bootstrap'

export default class Login extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:4000/login', {
            username: this.state.username,
            password: this.state.password
        })
        .then((res) => {
            this.props.setToken(res.data.token);
        })
        .catch((err) => {
            alert(err.response.data);
        })
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }
    
    render() {
        return (
        <>
            <p>Please login to access the system:</p>
            <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row} controlId="formUsername">
                    <Form.Label column sm="2">Username</Form.Label>
                    <Col sm="10">
                        <Form.Control value={this.state.username} onChange={this.handleUsernameChange} />        
                    </Col>    
                </Form.Group>
                <Form.Group as={Row} controlId="formPassword">
                    <Form.Label column sm="2">Password</Form.Label>
                    <Col sm="10">
                        <Form.Control type="password" value={this.state.password} onChange={this.handlePasswordChange} />        
                    </Col>    
                </Form.Group>
                <Button type="submit" variant="primary" className="float-right">Login</Button>
            </Form>
        </>
    )}
}