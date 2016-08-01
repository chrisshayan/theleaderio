import React, {Component} from 'react';
import {words as capitalize} from 'capitalize';

// components
import IboxContentHorizontal from '/imports/ui/components/IboxContentHorizontal';
import IboxContentPhoto from '/imports/ui/components/IboxContentPhoto';
import IboxContentInline from '/imports/ui/components/IboxContentInline';

export default class ProfileDetail extends Component {

  render() {
    const {
      picture,
      basic, 
      basicContent,
      contactContent,
      summaryContent,
      aboutContent
    } = this.props;
    return (
      <div className="ibox float-e-margins">
        <IboxContentPhoto
          imageClass="img-thumbnail"
          imageUrl={picture.imageUrl}
          width={360}
          height={360}
        />
        <IboxContentHorizontal
          ibcTitle={capitalize(basic.name)}
          ibcContent={basicContent}
          classGridLabel='col-xs-12'
          classGridValue='col-xs-0'
        />

        {!_.isEmpty(contactContent) && (
          <IboxContentHorizontal
            ibcTitle="Contact"
            ibcContent={contactContent}
            classGridLabel='col-xs-4'
            classGridValue='col-xs-8'
          />
        )}
        {!_.isEmpty(summaryContent) && (
          <IboxContentInline
            ibcTitle="Summary"
            ibcContent={summaryContent}
            classGrid="col-xs-4"
          />
        )}
        {!_.isEmpty(aboutContent) && (
          <IboxContentHorizontal
            ibcTitle='About'
            ibcContent={aboutContent}
            classGridLabel='col-xs-0'
            classGridValue='col-xs-12'
          />
        )}
      </div>
    );
  }
}