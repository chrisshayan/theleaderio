import React from 'react';

export default ({content = () => null}) => (
  <div>
    { content() }
  </div>
);