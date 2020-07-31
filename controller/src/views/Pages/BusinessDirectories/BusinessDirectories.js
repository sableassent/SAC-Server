import React, { Component } from 'react'
import { Row, Col, Card, CardBody, Input, CardHeader, Table, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, ListGroup, ListGroupItem, CardFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import BusinessService from '../../../services/BusinessService'
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from '../../../NotificationSetting';
import Moment from 'react-moment';
import logo from '../../../assets/img/logo.jpeg';
import logo3 from '../../../assets/img/logo3.jpeg';
import { UncontrolledCarousel } from 'reactstrap';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";

const mapStyles = {
    width: '50%',
    height: '50%'
};

class BusinessDirectories extends Component {
    constructor(props) {
        super(props)

        this.state = {
            businesses: [],
            openModal: false,
            business: {},
            page: 1,
            pages: [],
            limit: 2,
            totalBusinesses: 0,
            totalPages: 1,
            nextPage: 1,
            previousPage: 0,
            color: '',
            details: [],
            user: {}

        }
    }
    componentDidMount() {
        this.getBusinessByStatus()

    }
    getBusinessByStatus = async () => {
        try {
            let obj = {
                offset: (this.state.page - 1) * this.state.limit,
                limit: this.state.limit
            }
            let response = await BusinessService.getByStatus(obj);
            this.setState({ businesses: response, details: response });
            console.log('bussiness', this.state.businesses)
            if (response) {
                this.setState({
                    totalBusinesses: response.length,
                    totalPages: 3
                    // totalPages: Math.ceil(response.length / this.state.limit)
                }, () => {
                    let pages = this.state.pages;
                    for (let page = 1; page <= this.state.totalPages; page++) {
                        if (page == 0) page = 1;
                        if (!pages.includes(page)) pages.push(page);
                    }
                    this.setState({ pages: pages })
                    console.log(response)
                })
            }
        } catch (error) {

        }

    }
    verifyBusiness = async (status, _id) => {
        try {
            let obj = {
                businessId: _id,
                verificationStatus: status
            }
            let responce = await BusinessService.verifyBusiness(obj);
            this.getBusinessByStatus()

        } catch (e) {

        }

    }
    refreshPagination = async (page, limit = 2) => {
        this.setState({ page: page, nextPage: page + 1, previousPage: page - 1, limit: parseInt(limit) }, () => {
            this.getBusinessByStatus();
        });
    }
    toggle = () => {
        this.setState({ openModal: !this.state.openModal })
    }
    openBusinessModal = (business) => {
        this.setState({
            openModal: true,
            business: business
        })
        this.getUser(business.userId);
    }
    getUser = async (userId) => {
        try {
            let response = await BusinessService.getUser(userId);
            this.setState({ user: response })
        } catch (error) {

        }
    }
    render() {
        const Style = {
            position: 'relative',
            width: '50%',
            height: '30%'
        }
        const items = [
            {
                src: logo3,
                altText: 'Slide 1',
                caption: 'Bussiness',
                header: 'Slide 1 Header',
                key: '1'
            },
            {
                src: logo3,
                altText: 'Slide 2',
                caption: 'Slide 2',
                header: 'Slide 2 Header',
                key: '2'
            },
            {
                src: logo3,
                altText: 'Slide 3',
                caption: 'Slide 3',
                header: 'Slide 3 Header',
                key: '3'
            }
        ]

        return (
            <div>
                <Card>
                    <CardBody>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>PhoneNumber</th>
                                    <th>Address</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>FoundationYear</th>
                                    <th>CreatedAt</th>
                                    <th>UpdatedAt</th>
                                    <th>Verification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.businesses
                                        ? this.state.businesses.map((business, index) => {
                                            return (
                                                <tr onClick={() => this.openBusinessModal(business)} key={index}>
                                                    <td>{business.name}</td>
                                                    <td>{business.email}</td>
                                                    <td>{business.phoneNumber}</td>
                                                    <td>{business.address.houseNumber, business.address.streetName, business.address.city}</td>
                                                    <td>{business.category}</td>
                                                    <td>{business.description}</td>
                                                    <td>{business.foundationYear}</td>
                                                    <td><Moment format="ddd, MMM DD, YYYY hh:mm A">{business.createdAt}</Moment></td>
                                                    <td><Moment format="ddd, MMM DD, YYYY hh:mm A">{business.updatedAt}</Moment></td>
                                                    <td ><Button className={business.verification === "PENDING" ? "btn-warning btn-sm" : business.verification === "VERIFIED" ? "btn-success btn-sm" : "btn-danger btn-sm"}>{business.verification}</Button></td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr><td colSpan="9" className="text-center">No Business found</td></tr>
                                }
                            </tbody>
                        </Table>
                    </CardBody>
                    <CardFooter>
                        <Pagination aria-label="Page navigation example">
                            <PaginationItem disabled>
                                <PaginationLink first href="#" />
                            </PaginationItem>
                            <PaginationItem disabled={this.state.previousPage <= 1}>
                                <PaginationLink previous onClick={() => this.refreshPagination(this.state.previousPage)} />
                            </PaginationItem>
                            {this.state.pages && this.state.pages.map((index, page) => (
                                <PaginationItem key={index}>
                                    <PaginationLink onClick={() => this.refreshPagination(page + 1)}>
                                        {page + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem disabled={this.state.totalPages > this.state.nextPage}>
                                <PaginationLink next onClick={() => this.refreshPagination(this.state.nextPage)} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink last href="#" />
                            </PaginationItem>
                        </Pagination>
                    </CardFooter>
                </Card>
                <Modal className="modal-dialog modal-lg" isOpen={this.state.openModal} toggle={this.toggle}>
                    {/* <ModalHeader toggle={this.toggle}>User Information</ModalHeader> */}
                    <h4 style={{ marginTop: '20px', marginLeft: '20px' }}><strong>User Information :</strong></h4>
                    <ModalBody>
                        <Row>
                            <Col sm={5}>
                                <img width="250px" height="150px" src={logo} />
                            </Col>
                            <Col sm={7}>
                                <Table >
                                    <tbody>
                                        <tr>
                                            <th> Name : </th>
                                            <td>{this.state.user.name}</td>
                                        </tr>
                                        <tr>
                                            <th> Email: </th>
                                            <td>{this.state.user.email}</td>
                                        </tr>
                                        <tr>
                                            <th> PhoneNumber: </th>
                                            <td>{this.state.user.phoneNumber}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </ModalBody>
                    {/* <ModalHeader>Business Information</ModalHeader> */}
                    <h4 style={{ marginLeft: '10px' }}><strong>Business Information :</strong></h4>
                    <ModalBody>
                        <Row>
                            <Col sm={6}>
                                <Table hover responsive>
                                    <tbody>
                                        <tr>
                                            <th> Name : </th>
                                            <td>{this.state.business.name}</td>
                                        </tr>
                                        <tr>
                                            <th> Email: </th>
                                            <td>{this.state.business.email}</td>
                                        </tr>
                                        <tr>
                                            <th> PhoneNumber: </th>
                                            <td>{this.state.business.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <th> Category : </th>
                                            <td>{this.state.business.category}</td>
                                        </tr>
                                        <tr>
                                            <th>Submitted On :</th>
                                            <td><Moment format="ddd, MMM DD, YYYY">{this.state.business.createdAt}</Moment></td>
                                        </tr>
                                        <tr>
                                            <th>Verification</th>
                                            <td><Button className={this.state.business.verification === "PENDING" ? "btn-warning btn-sm" : this.state.business.verification === "VERIFIED" ? "btn-success btn-sm" : "btn-danger btn-sm"}>{this.state.business.verification}</Button></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col sm={6}>
                                <UncontrolledCarousel style={{ width: '250px', height: '150' }} items={items} />
                                {/* //<img width="250px" height="150px" src={logo} /> */}
                            </Col>
                        </Row>
                        <h4> <strong>Social Media links:</strong></h4>
                        <div style={{ display: 'flex' }}>
                            <Button className="btn btn-primary"><TiSocialTwitter size="40px"></TiSocialTwitter></Button > <Button className="btn btn-primary" style={{ marginLeft: '10px' }}> <TiSocialLinkedin size="40px"></TiSocialLinkedin></Button> <Button className="btn btn-primary" style={{ marginLeft: '10px' }}> <TiSocialFacebook size="40px"></TiSocialFacebook></Button ><Button className="btn btn-primary" style={{ marginLeft: '10px' }}><TiSocialInstagram size="40px"></TiSocialInstagram></Button>
                        </div>
                        {/* <h4> <strong>Contact:</strong></h4>
                        <div >
                            <Map style={Style} google={this.props.google} zoom={14}>

                                <Marker onClick={this.onMarkerClick}
                                    name={this.state.business.address && Object.values(this.state.business.address).join()} />

                                <InfoWindow onClose={this.onInfoWindowClose}>
                                    <div>
                                        <h1>{this.state.business.address && Object.values(this.state.business.address).join()}</h1>
                                    </div>
                                </InfoWindow>
                            </Map>
                        </div> */}
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.business.verification === "PENDING" ?
                                <div>
                                    <Button color="success" onClick={() => this.verifyBusiness('VERIFIED', this.state.business._id)}>Verify</Button>
                                    <Button style={{ marginLeft: '10px' }} color="danger" onClick={() => this.verifyBusiness('REJECTED', this.state.business._id)}>Reject</Button>
                                </div>
                                :
                                this.state.business.verification === "VERIFIED" ?
                                    <Button color="danger" onClick={() => this.verifyBusiness('REJECTED', this.state.business._id)}>Reject</Button>
                                    :
                                    <Button color="success" onClick={() => this.verifyBusiness('VERIFIED', this.state.business._id)}>Verify</Button>
                        }
                        <Button style={{ marginLeft: '10px' }} onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
            </div>
        )
    }
}

export default BusinessDirectories
// GoogleApiWrapper({
//     apiKey: ("AIzaSyCJ8mASDSrqNJ4DZYY4FFjPiQbD02ncYRU")
// })()