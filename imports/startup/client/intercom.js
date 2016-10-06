const APP_ID = Meteor.settings.public.intercom.appId;
const defaultSettings = {
  app_id: APP_ID
};

// install plugin
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/z3mfdl3n';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()

window.Intercom("boot", defaultSettings);
Intercom('hide');

window.IntercomID = function() {
  return APP_ID;
}

window.updateRoute = function(name) {
  var newSettings = {};
  if(Meteor.user()) {
    var user = Meteor.user();
    newSettings.user_id = user._id;
    newSettings.email = user.emails[0].address;
  }
  window.Intercom('update', newSettings);
}

window.trackEvent = function(eventName, metadata = {}) {
  window.Intercom('trackEvent', eventName, metadata);
}

