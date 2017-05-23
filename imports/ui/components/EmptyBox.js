import React, {Component} from 'react';

export default class EmptyBox extends Component {
  render() {
    const
      {icon, message, height = '300px'} = this.props,
      styles = {
        container: {
          width: '100%',
          height: height,
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
      }
      ;
    return (
      <div className="form-control" style={styles.container}>
        <i className={icon} style={styles.icon}></i>
        <h2 style={styles.msg}>{message}</h2>
      </div>
    );
  }
}

