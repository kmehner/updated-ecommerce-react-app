// src/components/CustomerForm.jsx
import React, { Component } from 'react';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import axios from 'axios';

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null,
            showSuccessModal: false // State to control the visibility of the success modal
        };
    }

    componentDidMount() {
        const { id } = this.props.params; // Get the route parameter
        console.log(id);
        if (id) {
            // If an ID is present, fetch customer data for editing
            this.fetchCustomerData(id);
        }
    }

    componentDidUpdate(prevProps) {
        // Check if the selected customer ID has changed
        if (prevProps.customerId !== this.props.customerId) {
            // Update the state with the new customer ID
            this.setState({ selectedCustomerId: this.props.customerId });
    
            // Fetch the customer data for editing
            // This assumes that the customer data can be retrieved by making an API call
            // using the customer ID. Replace the URL with your actual API endpoint.
            if (this.props.customerId) {
                axios.get(`http://127.0.0.1:5000/customers/${this.props.customerId}`)
                    .then(response => {
                        const customerData = response.data;
                        this.setState({
                            name: customerData.name,
                            email: customerData.email,
                            phone: customerData.phone
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching customer data:', error);
                        // Handle errors here, such as setting an error message state to display in the UI
                    });
            } else {
                // Reset the form if no customer is selected (for adding a new customer)
                this.setState({
                    name: '',
                    email: '',
                    phone: ''
                });
            }
        }
    }
    
    fetchCustomerData = (id) => {
        axios.get(`http://127.0.0.1:5000/customers/${id}`)
            .then(response => {
                const customerData = response.data;
                this.setState({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    selectedCustomerId: id
                });
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    validateForm = () => {
        const { name, email, phone } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!phone) errors.phone = 'Phone is required';
        return errors;
    };  

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null });
            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };
            const apiUrl = this.state.selectedCustomerId
                ? `http://127.0.0.1:5000/customers/${this.state.selectedCustomerId}`
                : 'http://127.0.0.1:5000/customers';

            const httpMethod = this.state.selectedCustomerId ? axios.put : axios.post;

            httpMethod(apiUrl, customerData)
                .then(response => {
                    this.setState({
                        showSuccessModal: true, // Show the success modal
                        isLoading: false
                    });
                    // Optionally reset form here or wait for modal close
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    this.setState({ error: error.toString(), isLoading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null
        });
        this.props.navigate('/customers'); // Navigate away after modal close
    };

    /*
    render() {
        const { name, email, phone, isLoading, error, errors } = this.state;

        if (isLoading) return <p>Submitting customer data...</p>;
        if (error) return <p>Error submitting customer data: {error}</p>;

        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Add/Edit Customer</h3>
                <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={this.handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" value={email} onChange={this.handleChange} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </label>
                <br />
                <label>
                    Phone:
                    <input type="tel" name="phone" value={phone} onChange={this.handleChange} />
                    {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }*/

    render() {
        const { name, email, phone, isLoading, error, errors, showSuccessModal } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
                {error && <Alert variant="danger">Error submitting customer data: {error}</Alert>}
                
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={name} onChange={this.handleChange} />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={email} onChange={this.handleChange} />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" name="phone" value={phone} onChange={this.handleChange} />
                        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                
                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The customer has been successfully {this.state.selectedCustomerId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}
export default CustomerForm;