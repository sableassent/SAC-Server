import React, { Component } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.webp';
import sygnet from '../../assets/img/brand/sygnet.svg';
import AuthService from '../../services/AuthService';
import { black } from 'color-name';
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const DefaultHeader = (props) => {

  // eslint-disable-next-line
  const { children, ...attributes } = props;
  const user = AuthService.getAuthUser();
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('wallet');
    localStorage.removeItem('authorization');

    history.replace('/login');
  }
  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand
        style={{ background: '#2f353a' }}
        full={{ src: logo, width: 50, height: 50, alt: 'CoreUI Logo' }}
        minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />

      <Nav className="d-md-down-none" navbar>
        <NavItem className="px-3">
          <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
        </NavItem>
      </Nav>
      {
        user &&
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <span>{user.name}</span>
              <img src={'../../assets/img/avatars/1.png'} className="img-avatar" alt={user.email} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem>
                <NavLink to="/changePassword" style={{ textDecoration: 'none', color: 'black' }} className="nav-link">
                  <i className="fa fa-shield"></i>Change Password
              </NavLink>
              </DropdownItem>
              <DropdownItem onClick={
                () => logout()
              }><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      }
    </React.Fragment>
  );
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
