import React from 'react';

import TopNav from '/imports/ui/common/TopNav';

export default ({content = () => null}) => (
  <div className="gray-bg">
    <div className="container gray-bg">
      <div className="row">
        <div className="col-md-10 col-md-offset-1 col-xs-12">
          <TopNav />
        </div>
        { content() }
      </div>
    </div>
  </div>
);