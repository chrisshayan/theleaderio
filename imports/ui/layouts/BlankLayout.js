import React from 'react';

import TopNav from '/imports/ui/common/TopNav';

export default ({content = () => null}) => (
  <div>
    <TopNav />
    <div className="wrapper wrapper-content">
      { content() }
    </div>
  </div>
);