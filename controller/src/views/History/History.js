import React, { Component, useState } from 'react';
import { Badge, Card, Collapse, CardGroup, InputGroup, Option, InputGroupAddon, InputGroupText, Button, Form, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Input, Label } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import EthereumService from '../../services/EthereumService';
import { saveAs } from 'file-saver';

const Basic = (props) => {
  let history = useHistory();
  let [showFilter, setShowFilter] = useState(false);
  return (
    <div>
      <Formik
        initialValues={{
          fromDate: '',
          toDate: '',
          status: '',
          amount: '',
          address: ''
        }}
        validate={values => {
          const errors = {};
          if (!values.fromDate) {
            errors.fromDate = 'Required';
          }
          if (!values.toDate) {
            errors.toDate = 'Requried';
          }
        }}

        onSubmit={async (values, { setSubmitting }) => {
          setShowFilter(false);
          props.setFilter(values);
        }}
      >
        {({ values, handleChange, handleSubmit, errors, isSubmitting }) => (
          <CardGroup>
            <Card className="p-0">
              <CardHeader>
                <i className={!showFilter ? 'fa fa-chevron-down' : 'fa fa-chevron-up'} onClick={() => setShowFilter(!showFilter)}></i> Filter
              </CardHeader>
              <Collapse isOpen={showFilter} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">

                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xs="4">
                        <Label> From Date </Label>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-calendar"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="date" name="fromDate" value={values.fromDate} placeholder="From Date" autoComplete="fromDate" onChange={handleChange} />
                        </InputGroup>
                      </Col>
                      <Col xs="4">
                        <Label> To Date </Label>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-calendar"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="date" name="toDate" value={values.toDate} placeholder="To Date" autoComplete="toDate" onChange={handleChange} />
                        </InputGroup>
                      </Col>
                      <Col xs="4">
                        <Label> Amount </Label>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-dollar fa-sm"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="amount" value={values.amount} placeholder="Enter amount" autoComplete="amount" onChange={handleChange} />
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="4">
                        <Label> Address </Label>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-dollar fa-sm"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="address" value={values.address} placeholder="Enter address" autoComplete="address" onChange={handleChange} />
                        </InputGroup>
                      </Col>
                      <Col xs="4">
                        <Label> Status </Label>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-flag fa-sm"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="select" name="status" value={values.status} placeholder="Enter status" autoComplete="status" onChange={handleChange} >
                            <option value=""></option>
                            <option value="Success">Success</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                          </Input>
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <Button type="button" color="primary btn-sm" className="px-5 mt-4 mr-4" disabled={isSubmitting} onClick={() => {
                          values.status = '';
                          values.amount = '';
                          values.address = '';
                          values.fromDate = '';
                          values.toDate = '';
                          props.setFilter(values);
                        }}>Reset</Button>
                        <Button type="submit" color="primary btn-sm" className="px-5 mt-4 mr-4" disabled={isSubmitting} >Search</Button>

                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Collapse>
            </Card>
          </CardGroup>
        )}
      </Formik>
    </div>)
};


class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: {
        fromDate: "",
        toDate: "",
        status: "",
        amount: ""
      },
      page: 1,
      limit: 10,
      transactions: {
        transactions: []
      },
      pageNumbers: [],
      totalTransactions: 0,
      pages: 0,
      showFilter: false,
    }

  }

  componentDidMount() {
    this.transactions();
  }

  downloadCSV = async () => {
    try {
      let response = await EthereumService.downloadCSV({ filter: this.state.filter });
      let csvData = response.map(e => e.join(',')).join('\n');
      let data = new Blob([csvData], { type: 'data:text/csv;charset=utf-8' });
      saveAs(data, 'Transactions.csv');
    } catch (e) {

    }
  }

  async transactions(page, limit) {
    try {
      let transactions = await EthereumService.search({ filter: this.state.filter, page: this.state.page, limit: this.state.limit });
      let pageNumbers = [];
      for (let page = 1; page <= transactions.pages; page++) {
        pageNumbers.push(page);
      }
      this.setState(
        {
          transactions: transactions,
          pageNumbers: pageNumbers,
          pages: transactions.pages,
          totalTransactions: transactions.totalTransactions
        });
    } catch (e) {
    }
  }

  refreshPagination = async (page, limit) => {
    this.setState({ page: parseInt(page, 10), limit: limit }, () => {
      this.transactions(page, limit);
    });
  }

  async resetFilter() {
    await this.setState({
      filter: {
        fromDate: "",
        toDate: "",
        status: "success",
        amount: "1"
      }
    });
    this.transactions(this.state.page, this.state.limit);
  }

  showFilter() {
    this.setState((prevState) => ({
      ...prevState,
      showFilter: !prevState.showFilter
    }));
  }

  render() {
    let { transactions, filter, page, limit, showFilter } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col sm="12" xl="12" style={{ marginBottom: 20 }}>
            <Basic setFilter={async (values) => {
              this.setState({
                filter: values,
                showFilter: false
              });
              this.transactions();
            }}
              downloadCSV={async () => this.downloadCSV()}
              reset={async () => this.resetFilter()}
            />
          </Col>
          <Col sm="12" xl="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="8" lg="8" className="d-flex justify-content-start">
                    Transactions
                </Col>
                  <Col sm="4" lg="4" className="d-flex justify-content-end">
                    <Button type="button" color="primary btn-sm" className="px-5" onClick={() => this.downloadCSV()}>Download CSV</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {transactions.totalTransactions >= 1 ?
                  (<Table hover bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hash</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Fees</th>
                        <th>Nonce</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactions.transactions.map((transaction, key) => {
                          return (
                            <tr key={key}>
                              <td>{transaction._id}</td>
                              <td>{transaction.from}</td>
                              <td>{transaction.to}</td>
                              <td>{transaction.amountInFloat + ' SAC'}</td>
                              <td>{transaction.feesInFloat + ' SAC'}</td>
                              <td>{transaction.nonce}</td>
                              <td>{moment(transaction.createdAt).format('MM/DD/YY hh:mm:ss')}</td>
                              <td>
                                <Badge color={transaction.status === 'Success' ? 'success' : transaction.status === 'Pending' ? 'warning' : transaction.status === 'Failed' ? 'danger' : 'secondary'}>{transaction.status}</Badge>
                              </td>
                            </tr>
                          )
                        })
                      }

                    </tbody>
                  </Table>) : <span style={{ textAlign: 'center' }}> <h6> No trasnactions found </h6> </span>
                }
                {transactions.totalTransactions >= 1 ?
                  <Row>
                    <Col xl={8} lg={12} md={12}>
                      <div className="d-flex justify-content-start">
                        <div sm={4} className="pr-2"><Button className="btn btn-default" disabled={this.state.page <= 1} onClick={(event) => this.refreshPagination(this.state.page - 1, this.state.limit)}>prev</Button></div>
                        <div sm={4}>
                          <Input type="select" value={this.state.page} name="filter" onChange={(event) => { this.refreshPagination(event.target.value, this.state.limit) }}>
                            {
                              this.state.pageNumbers.map((pageNumber, index) => (
                                <option value={pageNumber} key={index}>{pageNumber}</option>
                              ))
                            }
                          </Input>
                        </div>
                        <div sm={4} className="pl-2"><Button className="btn btn-default" disabled={this.state.page >= this.state.pages} onClick={() => this.refreshPagination(this.state.page + 1, this.state.limit)}>next</Button></div>
                      </div>
                    </Col>
                    <Col xl={4} lg={12} md={12}>
                      <div className="d-flex justify-content-end">
                        <div sm={4} className="mt-2 pr-2"><Label>Shown</Label></div>
                        <div sm={4}>
                          <Input type="select" name="pageLimit" onChange={(event) => { this.refreshPagination(1, event.target.value) }}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </Input>
                        </div>
                        <div sm={4} className="mt-2 pl-2"><Label>entries</Label></div>
                      </div>
                    </Col>
                  </Row> : ''
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default History;
