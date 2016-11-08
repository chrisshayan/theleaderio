import React, {Component} from 'react';

export default class NoContent extends Component {
  render() {
    const
      {
        icon = "fa fa-folder-o",
        message = "There is no content."
      } = this.props,
      styles = {
        container: {
          width: '80%',
          height: '300px',
          margin: '0 auto',
          border: '2px dashed #ddd',
          padding: 50,
          textAlign: 'center'
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
      <div style={styles.container}>
        <i className={icon} style={styles.icon}></i>
        <h2 style={styles.msg}>{message}</h2>
      </div>
    );
  }
}
