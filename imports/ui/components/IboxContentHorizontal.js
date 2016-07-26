import React, {Component} from 'react';


// IboxTable.propTypes = {
//   itTitle: React.PropTypes.string,
//   itContent: React.PropTypes.array,
//   colHeader: React.PropTypes.string,
//   colStandard: React.PropTypes.string
// };

export default class IboxContentHorizontal extends Component {
  render() {
    const {ibcTitle, ibcContent, classGridLabel, classGridValue} = this.props;
    return (
      <div className="ibox-content">
        <h5><strong>{ibcTitle}</strong></h5>
        {ibcContent.map((content, key) => (
          <div key={key} className="row">
            <div className={classGridLabel}>
              {content.label}
            </div>
            <div className={classGridValue}>
              {content.value}
            </div>
          </div>
        ))}
      </div>
    );
  }
}