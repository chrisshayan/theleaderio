import React, {Component} from 'react';

export class Footer extends Component {
  render() {
    const
      {fixed = true} = this.props,
      footerClass = `footer ${fixed ? "fixed" : ""}`
      ;
    return (
      <div className={footerClass}>
        <div>
          <strong>Copyright</strong> theLeader.io &copy; 2016
        </div>
      </div>
    );
  }
}