import React, { Component } from 'react';
import { reactMeteorData } from 'meteor/react-meteor-data';

var Modal = require('react-bootstrap-modal');

class AddEmployeeModal extends Component {
	render() {
		return (
			<Modal 
        show={this.state.open} 
        onHide={closeModal}
        aria-labelledby="ModalHeader"
      >
      <Modal.Header closeButton>
        <Modal.Title id='ModalHeader'>A Title Goes here</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Some Content here</p>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>

        <button className='btn btn-primary' onClick={saveAndClose}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
		);
	}
}