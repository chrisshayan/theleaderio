import React, {Component} from 'react';
import {words as capitalize} from 'capitalize';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import IboxContentHorizontal from '/imports/ui/components/IboxContentHorizontal';

export default class UserInfoBox extends Component {

  _renderPicture(preferences, data) {
    if (preferences.imageUrl && !!data.imageUrl) {
      return (
        <div className="ibox-content no-padding" style={{borderTopWidth: 0, borderBottomWidth: 0}}>
          <ProfilePhoto
            imageClass='img-thumbnail'
            imageUrl={data.imageUrl}
            width={260}
            height={260}
          />
        </div>
      );
    } else {
      return (
        <div className="ibox-content no-padding" style={{borderTopWidth: 0, borderBottomWidth: 0}}>
          <ProfilePhoto
            imageUrl={data.imageUrl}
            imageClass='img-thumbnail'
            width={260}
            height={260}
          />
        </div>
      );
    }
  }

  _renderBasicAndHeadline(preferences, data) {
    const basicContent = [];
    if (preferences.headline.title && !!data.headline.title) {
      basicContent.push({label: capitalize(data.headline.title), value: ''});
    }
    if (preferences.basic.industry && !!data.basic.industry) {
      basicContent.push({label: data.basic.industry, value: ''});
    }
    return (
      <IboxContentHorizontal
        ibcTitle={capitalize(data.basic.name)}
        ibcContent={basicContent}
        classGridLabel='col-xs-12'
        classGridValue='col-xs-0'
      />
    );
  }

  _renderContact(preferences, data) {
    // content for contact info
    const contactContent = [];
    if (preferences.email) {
      contactContent.push({label: 'Email', value: data.email});
    }
    if (preferences.phone && !!data.phone) {
      contactContent.push({label: 'Phone', value: data.phone});
    }
    if (!_.isEmpty(contactContent)) {
      return (
        <IboxContentHorizontal
          ibcTitle="Contact"
          ibcContent={contactContent}
          classGridLabel='col-xs-2'
          classGridValue='col-xs-6'
        />
      );
    } else {
      return '';
    }
  }

  _renderSummary(preferences, data) {
    // content for contact info
    const summaryContent = [];
    if (preferences.noOrg && !!data.noOrg) {
      if(data.noOrg > 1) {
        summaryContent.push({label: 'Organizations', value: data.noOrg});
      } else {
        summaryContent.push({label: 'Organization', value: data.noOrg});
      }
    }
    if (preferences.noEmployees && !!data.noEmployees) {
      if(data.noEmployees > 1) {
        summaryContent.push({label: 'Employees', value: data.noEmployees});
      } else {
        summaryContent.push({label: 'Employee', value: data.noEmployees});
      }
    }
    if (preferences.noFeedbacks && !!data.noFeedbacks) {
      if(data.noFeedbacks > 1) {
        summaryContent.push({label: 'Feedbacks', value: data.noFeedbacks});
      } else {
        summaryContent.push({label: 'Feedback', value: data.noFeedbacks});
      }
    }
    if (!_.isEmpty(summaryContent)) {
      return (
        <IboxContentHorizontal
          ibcTitle="Summary"
          ibcContent={summaryContent}
          classGridLabel='col-xs-4'
          classGridValue='col-xs-2 text-center'
        />
      );
    } else {
      return '';
    }
  }

  _renderAbout(preferences, data) {
    // content for about info
    const aboutContent = [];
    if (preferences.aboutMe && !!data.aboutMe) {
      aboutContent.push({label: '', value: data.aboutMe});
    }
    if (!_.isEmpty(aboutContent)) {
      return (
        <IboxContentHorizontal
          ibcTitle='About'
          ibcContent={aboutContent}
          classGridLabel='col-xs-0'
          classGridValue='col-xs-12'
        />
      );
    } else {
      return '';
    }
  }

  render() {
    const {preferences, data} = this.props;

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-title">
          <h5>Information</h5>
        </div>
        <div className="ibox-content">
          <div className="row text-center">
            {this._renderPicture(preferences.picture, data.picture)}
          </div>
          <div className="row">
            {this._renderBasicAndHeadline(
              {
                basic: preferences.basic,
                headline: preferences.headline
              },
              {
                basic: data.basic,
                headline: data.headline
              }
            )}
          </div>
          <div className="row">
            {this._renderContact(preferences.contact, data.contact)}
          </div>
          <div className="row">
            {this._renderSummary(preferences.summary, data.summary)}
          </div>
          <div className="row">
            {this._renderAbout(preferences.about, data.about)}
          </div>
        </div>
      </div>
    );
  }
}