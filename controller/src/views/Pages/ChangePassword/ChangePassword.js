import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Spinner, Card, Alert, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Formik } from 'formik';
import AdminService from '../../../services/AdminService';

const Basic = () => {
    let history = useHistory();
    let [spinner, setSpinner] = useState(false);
    let [showError, setShowError] = useState(false);
    let [message, setMessage] = useState('');
    let [submiting, setSubmitting] = useState(false);
    return (
        <div>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }}
                validate={values => {
                    const errors = {};
                    if (!values.oldPassword || values.oldPassword === '') {
                        errors.oldPassword = 'Required';
                    }

                    if (!values.newPassword || values.newPassword === '') {
                        errors.newPassword = 'Requried';
                    }

                    if (!values.confirmPassword || values.confirmPassword === '') {
                        errors.confirmPassword = 'Required';
                    }

                    if (values.confirmPassword !== values.newPassword) {
                        errors.confirmPassword = 'Confirm paswword dose not match';
                    }

                    if (!errors.oldPassword && !errors.newPassword && !errors.confirmPassword) {
                        setSubmitting(true);
                    }
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        setShowError(false);
                        setSpinner(true);
                        delete values.confirmPassword;
                        await AdminService.changePassword(values);
                        setSpinner(false);
                        history.replace('/dashboard');
                    } catch (e) {
                        setSpinner(false)
                        setShowError(true);
                        setMessage(e.message);
                    }
                }}
            >
                {({ values, handleChange, handleSubmit, handleBlur, errors, touched, isSubmitting }) => (
                    <CardGroup>
                        <Card className="p-4">
                            <CardBody>
                                <Form onSubmit={handleSubmit}>
                                    <h1>Change Password</h1>
                                    <p className="text-muted">Please enter the old and the new password </p>
                                    <InputGroup className="mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="icon-user"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="password" name="oldPassword" invalid={touched.eamil && errors.oldPassword} value={values.oldPassword} placeholder="Old password" autoComplete="Old password" onChange={handleChange} onBlur={handleBlur} required={true} />
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="icon-lock"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="password" name="newPassword" value={values.newPassword} placeholder="New password" autoComplete="New password" onChange={handleChange} onBlur={handleBlur} required={true} />
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="icon-lock"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="password" name="confirmPassword" value={values.confirmPassword} placeholder="Confirm password" autoComplete="Confirm password" onChange={handleChange} onBlur={handleBlur} required={true} />
                                    </InputGroup>
                                    <Row>
                                        <Col xs="12" style={{ textAlign: 'center' }}>
                                            {
                                                spinner ?
                                                    <Spinner />
                                                    : <Button type="submit" color="primary" className="px-5" disabled={!submiting}>Change Password</Button>
                                            }
                                        </Col>
                                    </Row>
                                    {showError
                                        ?
                                        <Alert color="danger" className="mt-4">
                                            {message}
                                        </Alert> : ''
                                    }
                                </Form>

                            </CardBody>
                        </Card>
                    </CardGroup>
                )}
            </Formik>
        </div>)
};
class ChangePassword extends Component {
    render() {
        return (
            <div className="app flex-row align-items-top">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <Basic />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ChangePassword;
