import React, {Component} from 'react';

// components
import UserInfoBox from '/imports/ui/components/UserInfoBox';

export default class ProfileBox extends Component {
  render() {
    const {preferences, data} = this.props;

    // user info content
    const userInfoPreferences = {
      picture: preferences.picture,
      basic: preferences.basic,
      headline: preferences.headline,
      contact: preferences.contact,
      summary: preferences.summary,
      about: preferences.about
    };
    const userInfoData = {
      picture: data.picture,
      basic: data.basic,
      headline: data.headline,
      contact: data.contact,
      summary: data.summary,
      about: data.about
    };

    // leadership progress content
    const leadershipPreferences = {
      metrics: preferences.metrics
    };
    const leadershipData = {
      chart: data.chart,
      metrics: data.metrics
    }

    // organizations content
    const orgPreferences = {
      organizations: preferences.organizations
    };
    const orgData = {
      organizations: data.organizations
    }

    return (
      <div>
        <UserInfoBox
          preferences={userInfoPreferences}
          data={userInfoData}
        />
      </div>
    );
  }
}