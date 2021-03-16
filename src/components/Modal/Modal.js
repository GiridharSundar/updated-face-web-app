import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.elem = document.createElement('div');
	}

	componentDidMount() {
		modalRoot.appendChild(this.elem);
	}

	componentWillUnmount() {
		modalRoot.removeChild(this.elem);
	}

	render(){
		return ReactDOM.createPortal(this.props.children, this.elem);
	}
}

export default Modal;