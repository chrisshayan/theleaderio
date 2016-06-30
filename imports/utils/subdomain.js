import _ from 'lodash';


export const getSubdomain = () => {
  var hostnameArr = document.location.hostname.split( "." );

  if(hostnameArr.length === 3) {
    return hostnameArr[0];
  }

  if(hostnameArr.length === 4 && hostnameArr[0].toLowerCase() === 'www') {
    return hostnameArr[1];
  }
}

export const addSubdomain = function({ alias, route }) {
  // context is the output of `FlowRouter.current()`
  const domain = `devtheleader.io`;
  const newUrl = `http://${alias}.${domain}/${route}`;
  console.log(`newUrl: ${newUrl}`);
  window.location = newUrl;
}
