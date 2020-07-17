import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Spinner
} from 'reactstrap';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from '../../NotificationSetting';

import AuthService from '../../services/AuthService';
import AdminService from '../../services/AdminService';
import EthereumService from '../../services/EthereumService';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.meRequestTimer = null;
    this.isActivatedRequestTimer = null;
    this.state = {
      walletActivated: false,
      activateWalletLoader: false,
      transferOwnershipLoader: false,
      withdrawLoader: false,
      setFeesLoader: false,
      secretKey: '',
      address: '',
      amount: '',
      fixedFees: '',
      percentFees: '',
      counts: {
        balanceETH: 0,
        balanceSAC: 0,
        contractBalanceSAC: 0,
        totalTransaction: 0
      }
    }
  }

  componentDidMount() {
    this.isActivated();
    this.getMe();
    this.startBackground();
  }

  async isActivated() {
    try {
      let response = await EthereumService.isActivated();
      this.setState({
        walletActivated: response
      })
    } catch (error) { }
  }

  async getMe() {
    try {
      let response = await AdminService.me();
      this.setState({
        counts: {
          balanceETH: response.wallet.balanceETH,
          balanceSAC: response.wallet.balanceSAC,
          contractBalanceSAC: response.contractBalanceSAC,
          totalTransaction: response.totalTransaction,
          fixedFees: response.wallet.fixedFees,
          percentFees: response.wallet.percentFees
        }
      })
    } catch (error) { }
  }

  startBackground() {
    this.meRequestTimer = setInterval(async () => {
      this.getMe();
    }, 10000 + Math.floor(Math.random() * 15000));
    this.isActivatedRequestTimer = setInterval(async () => {
      this.isActivated();
    }, 5000 + Math.floor(Math.random() * 8000));
  }

  async activateWallet() {
    try {
      this.setState({ activateWalletLoader: true });
      let response = await EthereumService.activate({ secretKey: this.state.secretKey });
      this.setState({ activateWalletLoader: false });
      this.setState({ walletActivated: true });
      this.setState({ secretKey: '' });
      this.notificationSystem.addNotification({
        message: response,
        level: 'success',
      });
    } catch (error) {
      this.setState({ activateWalletLoader: false });
      this.notificationSystem.addNotification({
        message: error.message,
        level: 'error',
      });
    }
  }

  async withdraw() {
    try {
      this.setState({ withdrawLoader: true });
      let response = await EthereumService.withdraw({ amount: this.state.amount });
      this.setState({ withdrawLoader: false });
      this.setState({ amount: '' });
      this.notificationSystem.addNotification({
        message: response,
        level: 'success',
      });
    } catch (error) {
      this.setState({ withdrawLoader: false });
      this.notificationSystem.addNotification({
        message: error.message,
        level: 'error',
      });
    }
  }

  async setFees() {
    try {
      this.setState({ setFeesLoader: true });
      let response = await EthereumService.setFees({ fixedFees: this.state.fixedFees, percentFees: this.state.percentFees });
      this.setState({ setFeesLoader: false });
      this.setState({ fixedFees: '', percentFees: '' });
      this.notificationSystem.addNotification({
        message: response,
        level: 'success',
      });
    } catch (error) {
      this.setState({ setFeesLoader: false });
      this.notificationSystem.addNotification({
        message: error.message,
        level: 'error',
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.meRequestTimer);
    clearInterval(this.isActivatedRequestTimer);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-info">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.balanceETH : 0)}</h2>
                <div>Wallet ETH</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-primary">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.balanceSAC : 0)}</h2>
                <div>Wallet SAC</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-success">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.contractBalanceSAC : 0)}</h2>
                <div>Accumulated SAC</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-primary">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.fixedFees : 0)}</h2>
                <div>Fixed Fees</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-dark">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.percentFees : 0)} %</h2>
                <div>Percent Fees</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="4" lg="4">
            <Card className="text-white bg-danger">
              <CardBody>
                <h2>{(this.state.walletActivated ? this.state.counts.totalTransaction : 0)}</h2>
                <div>Total Transactions</div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <Card>
              <Form action="" method="post" className="form-horizontal" onSubmit={(event) => { event.preventDefault(); this.activateWallet() }}>
                <CardHeader>
                  <strong>Activate Wallet</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="12">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="secretKey" name="secretKey" value={this.state.secretKey} onChange={(event) => { event.persist(); this.setState({ secretKey: event.target.value }) }} placeholder="Enter secret key" />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  {
                    this.state.activateWalletLoader &&
                    <Spinner />
                  }
                  {
                    !this.state.activateWalletLoader &&
                    <Button type="submit" size="sm" color="success" disabled={this.state.walletActivated}>Activate</Button>
                  }
                </CardFooter>
              </Form>
            </Card>
          </Col>
          <Col xs="12" md="6">
            <Card>
              <Form action="" method="post" className="form-horizontal" onSubmit={(event) => { event.preventDefault(); this.withdraw() }}>
                <CardHeader>
                  <strong>Withdraw</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="12">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="amount" name="amount" value={this.state.amount} onChange={(event) => { event.persist(); this.setState({ amount: event.target.value }) }} placeholder="Enter amount" />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  {
                    this.state.withdrawLoader &&
                    <Spinner />
                  }
                  {
                    !this.state.withdrawLoader &&
                    <Button type="submit" size="sm" color="success" disabled={!this.state.walletActivated}>Withdraw</Button>
                  }
                </CardFooter>
              </Form>
            </Card>
          </Col>
          <Col xs="12" md="6">
            <Card>
              <Form action="" method="post" className="form-horizontal" onSubmit={(event) => { event.preventDefault(); this.setFees() }}>
                <CardHeader>
                  <strong>Set Fees</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="6">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="fixedFees" name="fixedFees" value={this.state.fixedFees} onChange={(event) => { event.persist(); this.setState({ fixedFees: event.target.value }) }} placeholder="Enter fixed fees" />
                      </InputGroup>
                    </Col>
                    <Col md="6">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="percentFees" name="percentFees" value={this.state.percentFees} onChange={(event) => { event.persist(); this.setState({ percentFees: event.target.value }) }} placeholder="Enter percent fees" />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  {
                    this.state.setFeesLoader &&
                    <Spinner />
                  }
                  {
                    !this.state.setFeesLoader &&
                    <Button type="submit" size="sm" color="success" disabled={!this.state.walletActivated}>Set</Button>
                  }
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      </div>
    );
  }
}

export default Dashboard;
