import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

// layouts
// import MainLayout from '/imports/ui/layouts/MainLayout';
import {MainLayout} from '/imports/ui/layouts/MainLayoutNew';
import {MainLayoutFull} from '/imports/ui/layouts/MainLayoutFull';
import BlankLayout from '/imports/ui/layouts/BlankLayout';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import WelcomePage from '/imports/ui/common/WelcomePage';
import ThankyouPage from '/imports/ui/common/ThankyouPage';

import ConfirmEmail from '/imports/ui/components/ConfirmEmail';

import Management from '/imports/ui/containers/admin/Management';

import ArticlesContainer from '/imports/ui/containers/articles/ArticlesContainer';
import EditArticle from '/imports/ui/containers/articles/EditArticle';
import ViewArticle from '/imports/ui/containers/articles/ViewArticleContainer';

import LandingPage from '/imports/ui/containers/LandingPage';

import SignUpUser from '/imports/ui/containers/signup/SignUpUser';
import SignUpAlias from '/imports/ui/containers/signup/SignUpAlias';
import ResetAlias from '/imports/ui/containers/migration/ResetAlias';
import ConfirmReferral from '/imports/ui/containers/referrals/ConfirmReferral';
import CancelReferral from '/imports/ui/containers/referrals/CancelReferral';

import {SignUpUserNew} from '/imports/ui/containers/signup/SignUpUserNew';
import {SignUpAliasNew} from '/imports/ui/containers/signup/SignUpAliasNew';

import SignInAlias from '/imports/ui/containers/signin/SignInAlias';
import SignInAccount from '/imports/ui/containers/signin/SignInAccount';
import PasswordPage from '/imports/ui/containers/password/PasswordPage';
import SetPasswordPage from '/imports/ui/containers/password/SetPasswordPage';
import ForgotAliasPage from '/imports/ui/containers/alias/ForgotAliasPage';

import PublicProfile from '/imports/ui/containers/PublicProfile';
import Preferences from '/imports/ui/containers/preferences/Preferences';

import Dashboard from '/imports/ui/containers/dashboard/Dashboard';
import Organizations from '/imports/ui/containers/organizations/Organizations';
import CreateOrganization from '/imports/ui/containers/organizations/CreateOrganization';
import UpdateOrganization from '/imports/ui/containers/organizations/UpdateOrganization';

import Feedback from '/imports/ui/containers/feedback/Feedback';

import Messages from '/imports/ui/containers/messages/Messages';

import ReferralsContainer from '/imports/ui/containers/referrals/ReferralsContainer';

import {GettingStartedJourney} from '/imports/ui/containers/journey/GettingStartedJourney';

import AskQuestions from '/imports/ui/containers/questions/AskQuestions';
import Questions from '/imports/ui/containers/questions/Questions';
import ViewQuestions from '/imports/ui/containers/questions/ViewQuestions';

// functions
import {isAdmin} from '/imports/utils/index';
import * as Notifications from '/imports/api/notifications/functions';
import {getSubdomain} from '/imports/utils/subdomain';


/**
 * Constant
 * @routes all routes in action
 * @DOMAIN application domain
 */

// this domain should get from settings
export const DOMAIN = Meteor.settings.public.domain;
var LAST_INTERCOM_UPDATE = {};

/**
 * Subscriptions
 */
Meteor.subscribe('profiles');
Meteor.subscribe('defaults');

/**
 * Change root url to make flow router understand subdomain
 */
FlowRouter.setRootUrl = (url) => {
  Meteor.absoluteUrl.defaultOptions.rootUrl = url || window.location.origin;
}

Tracker.autorun(function () {
  FlowRouter.watchPathChange();
  FlowRouter.setRootUrl();
});

Accounts.onLogout(function () {
  window.Intercom('shutdown');
});


function intercomUpdate(context, redirect) {
  var user = Meteor.user();
  var appId = Meteor.settings.public.intercom.appId;
  var data = {};
  if (user) {
    var email = user.emails[0].address;
    var user_id = user._id;
    data = {app_id: appId, email, user_id, last_page: window.location.toString()};
    if (!_.isEqual(LAST_INTERCOM_UPDATE, data)) {
      LAST_INTERCOM_UPDATE = data;
      window.Intercom('update', data);
    }
  }
}

// init root url - support subdomain
FlowRouter.setRootUrl();

/**
 * @summary Default Invalid Url Route
 * @route notFound
 */
FlowRouter.notFound = {
  action() {
    mount(MainLayoutFull, {
      content() {
        return <NoticeForm/>;
      }
    });
  }
};

FlowRouter.route('/not-found', {
  name: 'notFound',
  action() {
    mount(MainLayoutFull, {
      content() {
        return <NoticeForm/>;
      }
    });
  }
});


/**
 * @summary lists of public routes
 * @route landingPage
 * @routes signupRouteGroup
 * @routes signinRouteGroup
 * @route forgotpassword
 * @route resetpassword
 */

const homeRoute = FlowRouter.route('/', {
  name: 'homePage',
  action() {
    const alias = Session.get('alias');
    if (alias) {
      if(alias === "www") {
        mount(LandingPage);
      } else {
        mount(MainLayoutFull, {
          bgClass: 'gray-bg',
          content() {
            return <PublicProfile/>;
          }
        });
      }
    } else {
      mount(LandingPage);
    }
  }
});

export const welcomeRoute = FlowRouter.route('/welcome', {
  name: 'welcomePage',
  action() {
    mount(MainLayoutFull, {
      content() {
        return <Notification/>;
      }
    });
  }
});

export const thankyouRoute = FlowRouter.route('/thankyou', {
  name: 'thankyouPage',
  action() {
    mount(MainLayoutFull, {
      content() {
        return <ThankyouPage/>;
      }
    });
  }
});

// FlowRouter.route('/newsignup', {
//   name: "newSignUp",
//   action() {
//     mount(SignUpUserNew);
//   }
// });

const newSignUpRoutes = FlowRouter.group({
  name: "newSignUpRoutes",
  prefix: "/signup"
});

newSignUpRoutes.route('/:action', {
  name: "newSignUpSteps",
  action(params) {
    const {action} = params;
    switch (action) {
      case 'alias': {
        mount(MainLayoutFull, {
          content() {
            return <SignUpAliasNew/>;
          }
        });
        break;
      }
      case 'user': {
        const alias = getSubdomain();
        if(_.isEmpty(alias)) {
          const
            title = 'No alias',
            message = 'Please choose your alias first!'
            ;

          Notifications.warning({title, message});
          FlowRouter.go('newSignUpSteps', {action: 'alias'});
        } else {
          mount(MainLayoutFull, {
            content() {
              return <SignUpUserNew/>;
            }
          });
        }
        break;
      }
      // email confirmation
      case 'confirm': {
        mount(MainLayoutFull, {
          content() {
            return <ConfirmEmail/>;
          }
        });
        break;
      }
      // create alias for migrated user
      case 'migration': {
        mount(MainLayoutFull, {
          content() {
            return <ResetAlias/>;
          }
        });
        break;
      }
      // create alias for referral user
      case 'referral': {
        const
          {response} = queryParams;
        switch (response) {
          case 'confirm': {
            mount(MainLayoutFull, {
              content() {
                return <ConfirmReferral/>;
              }
            });
            break;
          }
          case 'cancel': {
            const {_id} = queryParams;
            mount(MainLayoutFull, {
              content() {
                return <CancelReferral _id={_id}/>;
              }
            });
            break;
          }
        }
        break;
      }
      default: {
        mount(NoticeForm);
      }
    }
  }
});

/**
 * @summary lists of signup routes
 * @route /signup/:action
 * @action user
 * @action alias
 */
// export const signUpRoutes = FlowRouter.group({
//   name: 'signupRouteGroup',
//   prefix: '/signup'
// });
// // handling /signup root group
// signUpRoutes.route('/:action', {
//   name: 'signUpPage',
//   action(params, queryParams) {
//     const {action} = params;
//     switch (action) {
//       // register user
//       case 'user': {
//         mount(SignUpUser);
//         break;
//       }
//       // register alias
//       case 'alias': {
//         if (!Meteor.loggingIn() && !Meteor.userId()) {
//           const
//             closeButton = false,
//             title = "Signup user",
//             message = "Please enter your basic informations first";
//           Notifications.warning({closeButton, title, message});
//           FlowRouter.go('signUpPage', {action: 'user'});
//         } else {
//           mount(SignUpAlias);
//         }
//         break;
//       }
//       // email confirmation
//       case 'confirm': {
//         mount(ConfirmEmail);
//         break;
//       }
//       // create alias for migrated user
//       case 'migration': {
//         mount(ResetAlias);
//         break;
//       }
//       // create alias for referral user
//       case 'referral': {
//         const
//           {response} = queryParams;
//         switch (response) {
//           case 'confirm': {
//             mount(ConfirmReferral);
//             break;
//           }
//           case 'cancel': {
//             const {_id} = queryParams;
//             mount(CancelReferral, {_id});
//             break;
//           }
//         }
//         break;
//       }
//       default: {
//         throw new Meteor.Error(`Unknow action: ${action}`);
//       }
//     }
//   }
// });

/**
 * @summary lists of signin routes
 * @route /signin/:action
 * @action alias
 * @action email
 */
const checkSignIn = (context, redirect) => {
  if (Meteor.isLoggingIn || Meteor.userId()) {
    FlowRouter.go('app.dashboard');
  }
}

export const signInRoutes = FlowRouter.group({
  name: 'signinRouteGroup',
  prefix: '/signin'
});
// handling signin alias group
signInRoutes.route('/:action', {
  name: 'SignInPage',
  action(params, queryParams) {
    // sign in to user's web address with alias
    if (params.action == 'alias') {
      mount(MainLayoutFull, {
        content() {
          return <SignInAlias/>;
        }
      });
    }
    // sign in to user's account
    if (params.action == 'account') {
      if (Meteor.loggingIn() || Meteor.userId()) {
        FlowRouter.go('app.dashboard');
      } else {
        mount(MainLayoutFull, {
          content() {
            return <SignInAccount/>;
          }
        });
      }
    }
  }
});

/**
 * @summary lists of password routes
 * @route /password/:action
 * @action forgot
 * @action reset
 */
export const passwordRoutes = FlowRouter.group({
  name: 'passwordRouteGroup',
  prefix: '/password'
});
// handling signin alias group
passwordRoutes.route('/:action', {
  name: 'passwordPage',
  action(params) {
    // forgot password
    if (params.action == 'forgot') {
      mount(MainLayoutFull, {
        content() {
          return <PasswordPage/>;
        }
      });
    }
    // reset password
    if (params.action == 'reset') {
      mount(MainLayoutFull, {
        content() {
          return <PasswordPage/>;
        }
      });
    }
    // set password
    if (params.action == 'set') {
      mount(MainLayoutFull, {
        content() {
          return <SetPasswordPage/>;
        }
      });
    }
  }
});


/**
 * @summary lists of alias routes
 * @route /alias/:action
 * @action forgot
 */
export const aliasRoutes = FlowRouter.group({
  name: 'aliasRouteGroup',
  prefix: '/alias'
});
// handling signin alias group
aliasRoutes.route('/:action', {
  name: 'aliasPage',
  action(params) {
    // forgot alias
    if (params.action == 'forgot') {
      mount(MainLayoutFull, {
        content() {
          return <ForgotAliasPage/>;
        }
      });
    }
  }
});


/**************************************************
 * Main app routes
 **************************************************/

const requiredAuthentication = (context, redirect) => {
  if (!Meteor.isLoggingIn && !Meteor.userId()) {
    const
      alias = Session.get('alias'),
      params = {action: 'alias'},
      currentPath = FlowRouter.current().path
      ;
    if (alias) {
      params.action = 'account';
    } else {
      params.action = 'alias';
    }

    // console.log(currentPath)
    // save the path that user left
    if (!(currentPath === "/signin/account" || currentPath === "signin/alias")) {
      Session.set("currentPath", currentPath);
    }

    FlowRouter.go('SignInPage', params);
  }
}

const appRoutes = FlowRouter.group({
  prefix: '/app',
  triggersEnter: [requiredAuthentication],
});

/**
 * Route: Logout
 */
appRoutes.route('/logout', {
  name: 'app.logout',
  action() {
    Meteor.logout(() => {
      if (!Meteor.loggingIn() || !Meteor.user()) {
        const closeButton = false,
          timeOut = 2000,
          title = 'Signed out',
          message = '';
        Notifications.success({closeButton, timeOut, title, message});
      }
      FlowRouter.go('/');
    });
  }
});

/**
 * Route: Dashboard
 */
appRoutes.route('/', {
  name: 'app.dashboard',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action() {
    mount(MainLayout, {
      content() {
        return <Dashboard />
      }
    })
  }
});


/**************************************************
 * Admin routes
 **************************************************/

const requiredAdminAuthentication = (context, redirect) => {

}

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [requiredAuthentication, requiredAdminAuthentication]
});

/**
 * Route: Admin industries
 */
// adminRoutes.route('/industries', {
//   name: 'admin.industries',
//   action() {
//     mount(MainLayout, {
//       content() {
//         return <ManageIndustries />
//       }
//     })
//   }
// });

/**
 * Route: Admin jobs
 */
// adminRoutes.route('/jobs', {
//   name: 'admin.jobs',
//   action() {
//     mount(MainLayout, {
//       content() {
//         return <ManageJobs />
//       }
//     })
//   }
// });

/**
 * Route: Admin jobs
 */
adminRoutes.route('/management', {
  name: 'admin.management',
  action() {
    mount(MainLayout, {
      content() {
        return <Management />
      }
    })
  }
});

/**
 * Route: Preferences
 */
appRoutes.route('/preferences', {
  name: 'app.preferences',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action() {
    mount(MainLayout, {
      content() {
        return <Preferences />
      }
    })
  }
});

/**
 * Route for organization
 *
 * This route can show leader's organizations
 */
appRoutes.route('/organizations', {
  name: 'app.organizations',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action() {
    mount(MainLayout, {
      content() {
        return <Organizations />
      }
    })
  }
});

/**
 * Route for creating new organization
 */
appRoutes.route('/organizations/create', {
  name: 'app.organizations.create',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action() {
    mount(MainLayout, {
      content() {
        return <CreateOrganization />
      }
    })
  }
});

/**
 * Route for updating an organization
 */
appRoutes.route('/organizations/update/:_id', {
  name: 'app.organizations.update',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action(params) {
    mount(MainLayout, {
      content() {
        return <UpdateOrganization _id={params._id}/>
      }
    })
  }
});

/**
 * Route for feedback
 */
appRoutes.route('/feedback', {
  name: 'app.feedback',
  triggersEnter: [_.debounce(intercomUpdate, 1000)],
  action(params) {
    mount(MainLayout, {
      content() {
        return <Feedback />
      }
    })
  }
});

/**
 * Route for messages
 */
appRoutes.route('/messages', {
  name: "app.messages",
  action() {
    mount(MainLayout, {
      content() {
        return <Messages />;
      }
    });
  }
});

/**
 * Route for articles
 */
appRoutes.route('/articles', {
  name: "app.articles",
  action() {
    mount(MainLayout, {
      content() {
        return <ArticlesContainer />;
      }
    });
  }
});

/**
 * Route for creating an article
 */
appRoutes.route('/articles/create', {
  name: 'app.articles.create',
  action(params) {
    mount(MainLayout, {
      content() {
        return <EditArticle />
      }
    })
  }
});

/**
 * Route for edit an article
 */
appRoutes.route('/articles/:action/:seoUrl', {
  name: 'app.articles.action',
  action(params, queryParams) {
    switch (params.action) {
      case "edit": {
        mount(MainLayout, {
          content() {
            return <EditArticle _id={queryParams._id}/>
          }
        });
        break;
      }
      case "view": {
        mount(MainLayout, {
          content() {
            return <ViewArticle _id={queryParams._id}/>
          }
        });
        break;
      }
      default: {
        mount(MainLayout, {
          content() {
            return <NoticeForm />
          }
        });
      }
    }

  }
});

/**
 * Route for view an article
 */
const viewArticleRoute = FlowRouter.route('/articles/view/:seoUrl', {
  name: 'articles.view',
  action(params, queryParams) {
    // mount(ViewArticle, {_id: queryParams._id});
    mount(MainLayoutFull, {
      content() {
        return <ViewArticle _id={queryParams._id}/>
      }
    });
  }
});

/**
 * Route for referrals
 */
appRoutes.route('/referrals', {
  name: "app.referrals",
  action() {
    mount(MainLayout, {
      content() {
        return <ReferralsContainer />;
      }
    });
  }
});


/**
 * Route for getting started journey
 */
appRoutes.route('/journey/start/:step', {
  name: "app.journey",
  action(params) {
    const {step} = params;
    mount(MainLayoutFull, {
      showSignIn: false,
      showDashboard: false,
      content() {
        return <GettingStartedJourney step={step} />;
      }
    });
  }
});



const questionsRoutes = FlowRouter.group({
  prefix: '/questions'
});

/**
 * Route for anonymous question to leader
 */
questionsRoutes.route('/ask/:randomCode', {
  name: 'questions.ask',
  action(params, queryParams) {
    const {randomCode} = params;
    mount(MainLayoutFull, {
      showSignIn: false,
      showDashboard: false,
      content() {
        return <AskQuestions randomCode={randomCode}/>
      }
    });
  }
});

/**
 * Route for viewing questions of an organization
 */
questionsRoutes.route('/view/:organizationId', {
  name: 'questions.view',
  action(params, queryParams) {
    const {organizationId} = params;
    mount(MainLayoutFull, {
      showSignIn: false,
      showDashboard: false,
      content() {
        return <ViewQuestions organizationId={organizationId}/>
      }
    });
  }
});


/**
 * Route for list all questions and answers
 */
appRoutes.route('/questions', {
  name: "app.questions",
  action(params) {
    // const {action} = params;
    mount(MainLayout, {
      content() {
        return <Questions />;
      }
    });
  }
});