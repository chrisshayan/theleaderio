# theLeader.io

## Code structure

```
\.Root
|
├── packages
│   ├── comment
│   │   ├── common
│   │   └── server
│   ├── core
│   │   ├── common
│   │   └── server
│   ├── evaluation
│   │   ├── common
│   │   └── server
│   ├── feedback
│   │   ├── common
│   │   └── server
│   ├── industry
│   │   ├── common
│   │   └── server
│   ├── kudobox
│   │   ├── common
│   │   └── server
│   ├── notification
│   │   ├── common
│   │   └── server
│   ├── post
│   │   ├── common
│   │   ├── form-models
│   │   └── server
│   ├── relationship
│   │   ├── common
│   │   ├── form-models
│   │   └── server
│   ├── request
│   │   ├── common
│   │   ├── form-models
│   │   └── server
│   ├── request-invite
│   │   ├── common
│   │   ├── form-models
│   │   └── server
│   └── user
│       ├── common
│       ├── form-models
│       └── server
│           └── config
├── public
│   ├── fonts
│   └── images
│
├── client
│   ├── 0.vendor
│   ├── actions
│   ├── components
│   │   ├── Avatar
│   │   ├── DataTable
│   │   ├── Employees
│   │   ├── EmployeesPage
│   │   ├── Feedback
│   │   ├── ForgotPassword
│   │   ├── Home
│   │   ├── LandingPage
│   │   ├── Layouts
│   │   ├── Login
│   │   ├── Navigations
│   │   ├── RequestInvite
│   │   ├── ResetPassword
│   │   ├── Signup
│   │   ├── admin
│   │   ├── others
│   │   └── profiles
│   ├── configs
│   ├── containers
│   └── stylesheets
│
├── lib
└── server

```

With new app structure we manage module(feature) as a meteor package:

```
.
├── README.md
├── package.js // describe what module need and what module do 
├── common // this folder contains isomophic code 
│   ├── config.js // module config
│   ├── events.js // events of collection: beforeSave, afterSave, ...
│   ├── extends.js 
│   └── model.js  // model map to collection 
│
├── form_models // contain models to handle raw data and validate data received 
│   └── loginForm.js
│   └── requestInviteForm.js 
│   └──...
│
└── server // contains module config, rest apis, meteor methods and publications
    ├── methods.js
    └── publications.js
```

### Props:

Easy mantain and testing

[How to develope meteor package](https://themeteorchef.com/recipes/writing-a-package/)