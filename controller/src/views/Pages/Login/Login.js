import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Alert, Card, CardBody, CardGroup, Spinner, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Formik } from 'formik';
import logo from '../../../assets/img/brand/logo.webp';
import AuthService from '../../../services/AuthService';
import UserService from '../../../services/UserService';

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
          email: '',
          password: ''
        }}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          }
          if (!values.password) {
            errors.password = 'Requried';
          }

          if (!errors.email && !errors.password) {
            setSubmitting(true);
          }

        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setShowError(false);
            setSpinner(true);
            let response = await UserService.login(values);
            AuthService.setAuthorizationHeader(response.tokenType + " " + response.accessToken);
            AuthService.setAuthUser(response.user);
            AuthService.setAuthWallet(response.wallet);
            setSpinner(false);
            history.replace('/dashboard');

          } catch (e) {
            console.log(e);
            setSpinner(false);
            setShowError(true);
            setMessage(e.message);
          }
        }}
      >
        {({ values, handleChange, handleSubmit, errors, isSubmitting }) => (
          <CardGroup>
            <Card className="p-4">
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name="email" value={values.email} placeholder="Email" autoComplete="email" onChange={handleChange} />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name="password" value={values.password} placeholder="Password" autoComplete="current-password" onChange={handleChange} />
                  </InputGroup>
                  <Row>
                    <Col xs="12" style={{ textAlign: 'center' }}>
                      {
                        spinner ?
                          <Spinner />
                          : <Button type="submit" color="primary" className="px-4" disabled={!submiting}>Login</Button>
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
            <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
              <CardBody className="text-center">
                <div>
                  <img src={logo} className="img-avatar" alt="SableAssent Logo" />
                  <h2>Welcome to SableAssent </h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                </div>
              </CardBody>
            </Card>
          </CardGroup>
        )}
      </Formik>
    </div>)
};
class Login extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
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

export default Login;
