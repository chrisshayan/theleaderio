import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Organizations as OrganizationCollection} from '/imports/api/organizations';

import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';
import {actions as orgActions} from '/imports/store/modules/organizations';

// constants
import {DEFAULT_ORGANIZATION_PHOTO} from '/imports/utils/defaults';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
// Views
import NoOrganization from '/imports/ui/components/NoContent';
import Box from '/imports/ui/components/Box';
import Spinner from '/imports/ui/common/Spinner';

function getShortDescription(str) {
  if (!str) return '';
  let words = str.split(' ');
  if (words.length > 18) {
    words = words.splice(0, 18);
    words.push('...');
  }
  return words.join(' ');
}

class Organizations extends Component {
  componentWillMount() {
    const actions = (
      <a href={FlowRouter.url('app.organizations.create')} className="btn btn-primary">
        <i className="fa fa-plus"/>
        {' '}
        Create Organization
      </a>
    )

    setPageHeading({
      title: 'Organizations',
      breadcrumb: [{
        label: 'Organizations',
        active: true
      }],
      actions,
    });
  }

  componentWillUnmount() {
    resetPageHeading();
    orgActions.reset();
  }

  _onLoadMore = e => {
    e.preventDefault();
    orgActions.loadMore();
  }

  render() {
    const {loaded, isLoading, organizations, hasMore} = this.props;

    return (
      <div className="animated fadeInRight">
        {isLoading && !loaded && (<Spinner />)}
        {!isLoading && !organizations.length && (
          <NoOrganization icon="fa fa-folder-o" message="There is no organization."/>
        )}
        {/* Organization list */}
        <div className="row">
          {organizations.map((org, key) => (
            <div className="col-md-4" key={key} style={{height: '310px', cursor: 'pointer'}}
                 onClick={() => FlowRouter.go('app.organizations.update', {_id: org._id})}>
              <Box title={ org.name } tools={<a className="fa fa-edit" href={org.editUrl()}></a>}>
                <h4>{ org.jobTitle }</h4>
                {/* Description */}
                <p>{ getShortDescription(org.description) }</p>
                <div className="text-center">
                  <ProfilePhoto
                    imageClass='img-thumbnail'
                    imageUrl={org.imageUrl || DEFAULT_ORGANIZATION_PHOTO}
                    width={300}
                    height={200}
                  />
                </div>
                {/* Some numbers*/}
                <div className="row  m-t-sm">
                  <div className="col-sm-4">
                    <div className="font-bold">EMPLOYEES</div>
                    { org.employees && org.employees.length ? org.employees.length : 0 }
                  </div>
                </div>
              </Box>
            </div>
          ))}
        </div>

        {/* show load more button if has more org*/}
        { hasMore && (
          <div className="rowardui">
            <div className="col-md-12">
              <button className="btn btn-primary btn-block" onClick={this._onLoadMore}>
                Load more
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapMeteorToProps = params => {
  const {page, limit, q} = Meteor.AppState.get('organizations');
  let selector = {};
  let option = {
    limit: limit,
    skip: 0,
    sort: {createdAt: -1}
  };

  // filter by keyword
  if (!_.isEmpty(q)) {
    selector['$or'] = [
      {name: {$regex: q, $options: 'i'}}
    ];
  }

  const sub = Meteor.subscribe('organizations.list', {page, q});
  const isLoading = !sub.ready();
  const total = OrganizationCollection.find(selector).count();
  const organizations = OrganizationCollection.find(selector, option).fetch();

  return {
    isLoading,
    loaded: page > 1 || !isLoading,
    organizations,
    total,
    hasMore: (total > limit),
  };
}

export default createContainer(mapMeteorToProps, Organizations);
