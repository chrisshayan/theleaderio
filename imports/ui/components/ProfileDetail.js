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
    const summaryContent = {};
    if (!!summary.noOrg) {
      summaryContent.Organizations = summary.noOrg;
    }
    if (!!summary.noEmployees) {
      summaryContent.Employees = summary.noEmployees;
    }
    if (!!summary.noFeedbacks) {
      summaryContent.Feedbacks = summary.noFeedbacks;
    }

    // content for about info
    const aboutContent = [];
    if (!!about.aboutMe) {
      aboutContent.push({label: '', value: about.aboutMe});
    }

    return (
      <div className="ibox float-e-margins" style={{marginBottom: 18}}>
        <div className="ibox-content">
          <div className="row">
            <div className="col-md-4">
              <ProfilePhoto
                imageClass='img-thumbnail'
                imageUrl={picture.imageUrl}
                width={220}
                height={220}
              />
            </div>
            <div className="col-md-8">
              <IboxContentHorizontal
                ibcTitle={capitalize(basic.name)}
                ibcContent={basicContent}
                classGridLabel='col-xs-12'
                classGridValue='col-xs-0'
              />
              <IboxContentInline
                ibcTitle="Summary"
                ibcContent={summaryContent}
                classGrid="col-xs-4"
              />
            </div>
          </div>
          {!_.isEmpty(contactContent) && (
            <div className="row">
              <IboxContentHorizontal
                ibcTitle="Contact"
                ibcContent={contactContent}
                classGridLabel='col-xs-4'
                classGridValue='col-xs-8'
              />
            </div>
          )}
          {!_.isEmpty(summaryContent) && (
            <div className="row">
              <IboxContentInline
                ibcTitle="Summary"
                ibcContent={summaryContent}
                classGrid="col-xs-4"
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