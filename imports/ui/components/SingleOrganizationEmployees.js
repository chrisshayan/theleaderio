import React, { Component } from 'react';
import ScrollBox from 'react-scrollbar';
import Avatar from '/imports/ui/components/Avatar';


class SingleOrganizationEmployees extends Component {
	render() {
		const { employees = [] } = this.props;
		return (
			<ScrollBox style={{height: '500px'}}>
			  <table className="table table-striped table-hover">
			    <tbody>
			      { employees.map((employee, key) => (
							<tr key={key}>
				        <td style={styles.valign} className="client-avatar">
				        	<Avatar size={32} letter={ employee.firstLetter() } />
			        	</td>
				        <td style={styles.valign}>
				        	<a href="#" className="client-link">{ employee.fullname() }</a>
			        	</td>
				        <td className="contact-type" style={styles.valign}>
				        	<i className="fa fa-envelope"> </i>
				        </td>
				        <td style={styles.valign}> { employee.email }</td>
				        <td className="client-status" style={styles.valign}>
				        	<span className="label label-primary">Active</span>
			        	</td>
				      </tr>
			      ))}
			    </tbody>
			  </table>
			</ScrollBox>
		);
	}
}

const styles = {
	valign: {
		verticalAlign: 'middle'
	}
};

export default SingleOrganizationEmployees;