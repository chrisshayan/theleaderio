import React, {Component} from 'react';
import {Session} from 'meteor/session';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {DOMAIN} from '/imports/startup/client/routes';
import * as Notifications from '/imports/api/notifications/functions';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      navChange: false,
      email: ""
    };

    this._onEnterEmail = this._onEnterEmail.bind(this);
    this._onGetStarted = this._onGetStarted.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const changeNavOn = 125;
    if (this.scrollY() > changeNavOn) {
      this.setState({
        navChange: true
      });
    } else {
      this.setState({
        navChange: false
      });
    }
  }

  scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  _onEnterEmail(e) {
    this.setState({email: e.target.value});
  }

  _onGetStarted(e) {
    e.preventDefault();
    const {email} = this.state;
    if (!_.isEmpty(email)) {
      Session.set('email', email);
      return FlowRouter.go('newSignUpSteps', {action: 'alias'});
    }

    Notifications.warning({
      title: 'Get started',
      message: "Email is empty!"
    });
  }

  render() {
    // let navStyle = "navbar navbar-default navbar-fixed-top navbar-scroll";
    let navStyle = "navbar navbar-default navbar-fixed-top navbar-scroll";
    // if (this.state.navChange) {
    //   navStyle = `${navStyle} navbar-scroll`
    // }
    const
      homeUrl = `http://${DOMAIN}${FlowRouter.path('homePage')}`,
      signUpUrl = FlowRouter.path('newSignUpSteps', {action: 'alias'}),
      signInUrl = FlowRouter.path('SignInPage', {action: 'alias'}),
      emailPlaceHolder = 'name@company.com';

    return (
      <div id="page-top" className="landing-page white-bg">
        {/* Navbar */}
        <div className="navbar-wrapper">
          <nav ref="nav" className={navStyle} role="navigation">
            <div className="container">
              <div className="navbar-header page-scroll">
                <button type="button" className="navbar-toggle collapsed">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href={homeUrl}
                   style={{marginTop: 15, paddingLeft: 10, paddingRight: 10}}
                >
                  theLeader.io</a>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                {/*
                 <ul className="nav navbar-nav navbar-left">
                 <li>
                 <a className="page-scroll" href="#">
                 {'Features '}<i className="fa fa-caret-down"/>
                 </a>
                 </li>
                 <li>
                 <a className="page-scroll" href="#">
                 {'Pricing'}
                 </a>
                 </li>
                 </ul>
                 */}
                <ul className="nav navbar-nav navbar-right">
                  <li style={{marginRight: 10, marginLeft: 10}}>
                    <a className="page-scroll" href={signInUrl}>
                      Sign In
                    </a>
                  </li>
                  <li style={{marginRight: 10, marginLeft: 10}}>
                    <a className="btn btn-lg btn-primary brand"
                       style={{borderTopWidth: 1, paddingTop: 10, paddingBottom: 10, marginTop: 15}}
                       href={signUpUrl}
                    >Get Started</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        {/* Carousel */}
        <div id="inSlider" className="carousel carousel-fade" data-ride="carousel">
          <div className="carousel-inner">
            <div className="container">
              <div className="carousel-caption blank">
                <h1>BRING OUT THE BEST IN YOUR PEOPLE</h1>
                <p style={{textTransform: 'none', fontSize: 20}}
                >Lightweight performance management – Anonymous Questions, pulse surveys, 1-on-1s, peer recognition
                  and feedback in one simple weekly check-in.</p>
                <div className="search-form">
                  <form>
                    <div className="input-group">
                      <input type="email" placeholder={emailPlaceHolder} className="form-control input-lg"
                             value={this.state.email}
                             onChange={this._onEnterEmail}
                             style={{width: 295, color: '#000'}}
                      />
                      <div className="input-group-btn pull-left" style={{marginLeft: 15}}>
                        <button className="btn btn-lg btn-primary " style={{height: 46}}
                                onClick={this._onGetStarted}>Get Started
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="header-back one"></div>
          </div>
        </div>
        <div className="clients clients-5">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ul>
                  <li><img src="/img/landing/HubSpotlogo.png" alt=""/></li>
                  <li><img src="/img/landing/citrix-logo-black.png" alt=""/></li>
                  <li><img src="/img/landing/logo-dark-1.png" alt=""/></li>
                  <li><img src="/img/landing/Justfab_logo-1.png" alt=""/></li>
                  <li><img src="/img/landing/shoretel-logo-web-1.png" alt=""/></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Introduce about theLeaderio */}
        <section id="features" className="container services">
          <div className="row features-block" style={{height: 315}}>
            <div className="col-md-6 col-xs-12 text-left wow fadeInLeft">
              <embed width="420" height="315"
                     src="https://www.youtube.com/embed/c4dj-MUf0X0"/>
            </div>
            <div className="col-md-6 col-xs-12 features-block wow fadeInRight">
              <h1 style={{textTransform: 'none'}}>Performance Management For Lean Leadership</h1>
              <ul style={{fontSize: 20, boxSizing: 'border-box', marginBottom: 10}}>
                <li>Grow without losing your culture</li>
                <li>Maximize employee performance</li>
                <li>Stop employee turnover in its tracks</li>
              </ul>
              <a href={signUpUrl} className="btn btn-primary">Get Started Now</a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container features">
          <div className="row" style={{marginBottom: 10}}>
            <div className="col-lg-12 text-center">
              <div className="navy-line"></div>
              <h1><span className="navy">How theLeader.io engages your employees</span></h1>
              <p></p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 text-center wow fadeInLeft">
              <div>
                <i className="fa fa-envelope-o features-icon"></i>
                <h2>Simple Survey With Email</h2>
                <p>
                  Employee just reply to a simple email for scoring leader.</p>
              </div>
            </div>
            <div className="col-md-4 text-center wow fadeInRight">
              <div>
                <i className="fa fa-comment features-icon"></i>
                <h2>Ask Leader</h2>
                <p>
                  Communication between Leader and Employee is now faster and simpler</p>
              </div>
            </div>
            <div className="col-md-4 text-center wow fadeInLeft">
              <div>
                <i className="fa fa-bar-chart features-icon"></i>
                <h2>Benchmark Your Leadership Progress</h2>
                <p>
                  See how your leadership stacks up against others in your industry. Benchmark your performance so you
                  can continuously improve.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="white-section team">
          <div className="container">
            <div className="row m-b-lg">
              <div className="col-lg-12 text-center">
                <div className="navy-line"></div>
                <h1>Recommended by Other Leaders</h1>
                <p>The Most Recommended Leadership Tool</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 col-sm-offset-4">
                <div className="team-member wow zoomIn">
                  <a href="https://www.entrepreneur.com/author/jeff-boss">
                    <img src="/img/jeff_boss.jpg" className="img-responsive img-circle" alt="Jeff Boss"/>
                  </a>
                  <small className="text-muted">Entrepreneur, Executive Coach, Author, Speaker</small>
                  <h4><span className="navy">Jeff</span> Boss</h4>
                  <p>
                    "Fortunately, theleader.io is a great resource for tracking feedback and measuring leadership
                    effectiveness, not only in your company, but industrywide. Theleader.io helps identify sources for
                    disgruntled rumblings within your organization so you can nip them in the bud before they sprout
                    into full-blown resentment."</p>
                  <ul className="list-inline social-icon">
                    <li><a href="https://www.linkedin.com/in/jeffboss236"><i className="fa fa-linkedin"></i></a>
                    </li>
                    <li><a href="https://twitter.com/JeffBoss9"><i className="fa fa-twitter"></i></a>
                    </li>
                    <li><a href="https://www.facebook.com/Adaptabilitycoach/"><i className="fa fa-facebook"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="navy-section testimonials">
          <div className="container">
            <div className="row ">
              <div className="col-md-6 col-md-offset-3 text-center wow zoomIn">
                <h1 style={{color: '#FFF'}}>Join theLeader.io today</h1>
                <div className="search-form" style={{marginLeft: 80}}>
                  <form>
                    <div className="input-group">
                      <input type="email" placeholder={emailPlaceHolder} className="form-control input-lg"
                             value={this.state.email}
                             onChange={this._onEnterEmail}
                             style={{width: 295, color: '#000'}}
                      />
                      <div className="input-group-btn pull-left" style={{marginLeft: 15}}>
                        <button className="btn btn-lg btn-primary "
                                style={{height: 46, borderColor: "#FFF"}}
                                onClick={this._onGetStarted}>Get Started
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="gray-section contact">
          <div className="container">
            <div className="row m-b-lg">
              <div className="col-lg-12 text-center">
                <div className="navy-line"></div>
                <h1>Contact Us</h1>
                <p>Feel Free to contact us in case you have any question.</p>
              </div>
            </div>
            <div className="row m-b-lg">
              <div className="col-lg-3 col-lg-offset-3">
                <address>
                  <strong><span className="navy">theLeader.io, Inc.</span></strong><br/>
                  55 East 52nd Street<br/>
                  New York, NY 10022, United States<br/>
                </address>
              </div>
              <div className="col-lg-4">
                <p className="text-color">
                  Our Vision in theLeader.io is to help leaders like you to become a better leader. You can make
                  decisions for your employees based on data and monitor employee satisfaction to reduce your turn over
                  rate. Leadership matters a lot.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className="m-t-sm">
                  Follow us on social platform
                </p>
                <ul className="list-inline social-icon">
                  <li><a href="https://www.linkedin.com/company/6600918"><i className="fa fa-linkedin"></i></a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 text-center m-t-lg m-b-lg">
                <p><strong>&copy; 2016 theLeader.io</strong><br/>
                  STRIVE for Great Leadership</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage