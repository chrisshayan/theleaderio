import { DOMAIN } from '/imports/startup/client/routes';

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
  const newUrl = `http://${alias}.${DOMAIN}${route}`;
  window.location = newUrl;
}

export const removeSubdomain = function ({route}) {
  const newUrl = `http://${DOMAIN}/${route}`;
  window.location = newUrl;
}
