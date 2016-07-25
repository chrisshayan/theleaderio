import React, {Component} from 'react';


// IboxTable.propTypes = {
//   itTitle: React.PropTypes.string,
//   itContent: React.PropTypes.array,
//   colHeader: React.PropTypes.string,
//   colStandard: React.PropTypes.string
// };

export default class Card2Columns extends Component {
  render() {
    const {cardTitle, cardContent, classGridLabel, classGridValue} = this.props;
    return (
      <div className="ibox-content">
        <h5><strong>{cardTitle}</strong></h5>
        {cardContent.map((content, key) => (
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