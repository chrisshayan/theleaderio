export const IDValidator = {
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
};

export const getSubdomain = () => {
  var hostnameArr = document.location.hostname.split( "." );

  if(hostnameArr.length === 3) {
    return hostnameArr[0];
  }

  if(hostnameArr.length === 4 && hostnameArr[0].toLowerCase() === 'www') {
    return hostnameArr[1];
  }
}
