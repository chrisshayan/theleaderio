import React, {Component} from 'react';

export default class EmptyBox extends Component {
  render() {
    const styles = {
        container: {
          width: '100%',
          height: '300px',
          border: '2px dashed #ddd',
          borderRadius: '6px',
          textAlign: 'center',
          margin: '30px 0',
          padding: '40px'
        },
        msg: {
          textAlign: 'center'
        },
        icon: {
          fontSize: 40,
          color: '#ddd'
        }
      },
      {icon, message} = this.props
      ;
    return (
      <div className="form-control" style={styles.container}>
        <i className={icon} style={styles.icon}></i>
        <h2 style={styles.msg}>{message}</h2>
      </div>
    );
  }
}

