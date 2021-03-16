import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



class ProfileIcon extends Component {
	constructor(props){
		super(props);
		this.state = {
			dropDownOpen: false
		}
	}

	toggle = () =>{
		this.setState(prevState => ({
			dropDownOpen: !prevState.dropDownOpen
		}));
	}

	signoutUser = () => {
		fetch('http://localhost:3000/signout', {
	      method: 'post',
	      headers: {
	        'Content-Type': 'application/json',
	        'authorization' : window.sessionStorage.getItem('token')
	      }
	    })
	      .then(response => response.json())
	      .then(status => {
	      	if(status.signout){
	      		window.sessionStorage.removeItem('token');
	      		this.props.onRouteChange('signout');
	      	}
	      })
	      .catch(console.log);
	} 

	render(){
		return(
			<div className="pa4 tc">
				<Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle}>
			    	<DropdownToggle
				        tag="span"
				        data-toggle="dropdown"
				        aria-expanded={this.state.dropDownOpen}>
				    	<img
					      src="http://tachyons.io/img/logo.jpg"
					      className="br-100 ba h3 w3 dib" alt="avatar" />
				    </DropdownToggle>
				    <DropdownMenu 
				    	right
				    	className='b--transparent shadow-5' 
				    	style={{marginTop: '20px',backgroundColor: 'rgba(255,255,255,0.5'}}>
					    <DropdownItem onClick={this.props.toogleModal}>View Profile</DropdownItem>
					    <DropdownItem onClick={this.signoutUser}>Sign out</DropdownItem>
				    </DropdownMenu>
			    </Dropdown>
			</div>
			
		);
	}
}
export default ProfileIcon;