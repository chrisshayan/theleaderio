import React, {Component} from 'react';
import {words as capitalize} from 'capitalize';

// components
import IboxContentHorizontal from '/imports/ui/components/IboxContentHorizontal';
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import IboxContentInline from '/imports/ui/components/IboxContentInline';

export default class ProfileDetail extends Component {

  constructor() {
    super();

    this.state = {
      profile: {
        picture: {
          imageUrl: ''
        },
        basic: {
          name: '',
          industry: ''
        },
        headline: {
          title: ''
        },
        contact: {
          phone: '',
          email: ''
        },
        summary: {
          noOrg: 0,
          noEmployees: 0,
          noFeedbacks: 0
        },
        about: {
          aboutMe: ''
        }
      }
    };
  }

  render() {
    const {
      picture,
      basic,
      headline,
      contact,
      summary,
      about
    } = this.props.profile;
    // console.log(`profile details: `)
    // console.log(this.state)

    // content for basic info
    const basicContent = [];
    if (!!headline.title) {
      basicContent.push({label: capitalize(headline.title), value: ''});
    }
    if (!!basic.industry) {
      basicContent.push({label: basic.industry, value: ''});
    }

    // content for contact info
    const contactContent = [];
    if (!!contact.email) {
      contactContent.push({label: 'Email', value: contact.email});
    }
    if (!!contact.phone) {
      contactContent.push({label: 'Phone', value: contact.phone});
    }

    // content for summary info
    const summaryContent = [];
    if (!!summary.noOrg) {
      summaryContent.push({label: 'Organizations', value: summary.noOrg});
    }
    if (!!summary.noEmployees) {
      summaryContent.push({label: 'Employees', value: summary.noEmployees});
    }
    if (!!summary.noFeedbacks) {
      summaryContent.push({label: 'Feedbacks', value: summary.noFeedbacks});
    }

    // content for about info
    const aboutContent = [];
    if (!!about.aboutMe) {
      aboutContent.push({label: '', value: about.aboutMe});
    }

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-title">
          <h5>Information</h5>
        </div>
        <div className="ibox-content">
          <div className="row text-center">
            <div className="ibox-content no-padding" style={{borderTopWidth: 0, borderBottomWidth: 0}}>
              <ProfilePhoto
                imageClass='img-thumbnail'
                imageUrl={picture.imageUrl}
                width={260}
                height={260}
              />
            </div>
          </div>
          <div className="row">
            <IboxContentHorizontal
              ibcTitle={capitalize(basic.name)}
              ibcContent={basicContent}
              classGridLabel='col-xs-12'
              classGridValue='col-xs-0'
            />
          </div>
          {!_.isEmpty(contactContent) && (
            <div className="row">
              <IboxContentHorizontal
                ibcTitle="Contact"
                ibcContent={contactContent}
                classGridLabel='col-xs-2'
                classGridValue='col-xs-6'
              />
            </div>
          )}
          {!_.isEmpty(summaryContent) && (
            <div className="row">
              <IboxContentHorizontal
                ibcTitle="Summary"
                ibcContent={summaryContent}
                classGridLabel='col-xs-4'
                classGridValue='col-xs-2 text-center'
              />
            </div>
          )}
          {!_.isEmpty(aboutContent) && (
            <div className="row">
              <IboxContentHorizontal
                ibcTitle='About'
                ibcContent={aboutContent}
                classGridLabel='col-xs-0'
                classGridValue='col-xs-12'
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}