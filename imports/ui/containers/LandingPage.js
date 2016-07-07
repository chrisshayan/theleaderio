import React, {Component} from 'react';

import { DOMAIN, routes } from '/imports/startup/client/routes';

export default class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      navChange: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const changeNavOn = 125;
    if(this.scrollY() > changeNavOn) {
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

  render() {
    let navStyle = "navbar navbar-default navbar-fixed-top";
    if (this.state.navChange) {
      navStyle = `${navStyle} navbar-scroll`
    }
    const homeUrl = `http://${DOMAIN}/${routes.home}`;
    return (
      <div id="page-top" className="landing-page">
        <div className="navbar-wrapper">
          <nav ref="nav" className={navStyle} role="navigation">
            <div className="container">
              <div className="navbar-header page-scroll">
                <button type="button" className="navbar-toggle collapsed" dataToggle="collapse" dataTarget="#navbar"
                        ariaExpanded="false" ariaControls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href={homeUrl}>theLeader.io</a>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li><a className="page-scroll" href="#page-top">Home</a></li>
                  <li><a className="page-scroll" href="#features">Features</a></li>
                  <li><a className="page-scroll" href="#testimonials">Testimonials</a></li>
                  <li><a className="page-scroll" href="#contact">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div id="inSlider" className="carousel carousel-fade" data-ride="carousel">
          <div className="carousel-inner">
            <div className="container">
              <div className="carousel-caption blank">
                <h1>Do you strive to be a great leader? <br/> Not sure how to improve?</h1>
                <p>Get insight on how your team rates your leadership and how to improve.</p>
                <p>
                  <a className="btn btn-lg btn-primary" role="button" href={routes.signUp.user}>Try for free!</a>
                  <a className="caption-link" href={routes.signIn.alias} role="button">Have account already?</a>
                </p>
              </div>
            </div>
            <div className="header-back two"></div>
          </div>
        </div>


        <section id="features" className="container services">
          <div className="row">
            <div className="col-sm-6">
              <h2>SURVEY YOUR EMPLOYEES</h2>
              <p>
                Create your own questions or choose from a list of questions which are already in use by others in your industry. Send simple, personalized surveys that get industry high response rates of 60%.</p>
              <p><a className="navy-link" href="#" role="button">Details &raquo;</a></p>
            </div>
            <div className="col-sm-6">
              <h2>MEASURE AND TRACK EMPLOYEE SATISFACTION</h2>
              <p>
                Keep track of employee satisfaction by monitoring changes from one survey period to the next. See if what you are doing is improving satisfaction or having a negative impact.</p>
              <p><a className="navy-link" href="#" role="button">Details &raquo;</a></p>
            </div>
          </div>
        </section>

        <section className="container features">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="navy-line"></div>
              <h1>Analytics 3.0<br/> <span className="navy"> the era of data-enriched offerings</span></h1>
              <p>New ways of deciding, managing, changing, innovating, improving and Leading.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 text-center wow fadeInLeft">
              <div>
                <i className="fa fa fa-frown-o features-icon"></i>
                <h2>Identify Unhappy Employees</h2>
                <p>
                  By using past scores and industry data, we identify your 'at risk' employees and send you an immediate email notification so you can proactively address their concerns.</p>
              </div>
              <div className="m-t-lg">
                <i className="fa fa-bar-chart features-icon"></i>
                <h2>Benchmark Against Your Industry</h2>
                <p>
                  See how your leadership stacks up against others in your industry. Benchmark your performance so you can continuously improve.</p>
              </div>
            </div>
            <div className="col-md-6 text-center  wow zoomIn">
              <img src="img/landing/perspective.png" alt="dashboard" className="img-responsive"/>
            </div>
            <div className="col-md-3 text-center wow fadeInRight">
              <div>
                <i className="fa fa-quote-left features-icon"></i>
                <h2>Get Testimonials, Display and Share Them</h2>
                <p>
                  Generate testimonials from your employees, display them using our testimonial widget and have them instantly shared across LinkedIn, Facebook and Twitter.</p>
              </div>
              <div className="m-t-lg">
                <i className="fa fa-rocket features-icon"></i>
                <h2>Embedded analytics</h2>
                <p>
                  Consistent with the increased speed of data processing and analysis, our models in Analytics 3.0 are often embedded into operational and decision processes, dramatically increasing speed and impact.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="navy-section testimonials">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center wow zoomIn">
                <i className="fa fa-comment big-icon"></i>
                <h1>
                  What our users say
                </h1>
                <div className="testimonials-text">
                  <i>"theLeader.io is so simple and easy to use, my employees just love filling it out. Now that I have the majority of our employees leaving me feedback on my leadership, I feel more engaged with them and can use the data to make more confident business decisions."</i>
                </div>
                <small>
                  <strong>12.02.2015 - Andy Smith</strong>
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="comments gray-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="navy-line"></div>
                <h1>What our customers say</h1>
                <p>Our Customers Love us.</p>
              </div>
            </div>
            <div className="row features-block">
              <div className="col-lg-4">
                <div className="bubble">
                  "theLeader.io can be as valuable as your business wants to make it. Its great to ask for feedback from employees and have dashboard! it gives me a lead in talking point to further employee relationships."
                </div>
                <div className="comments-avatar">
                  <a href="" className="pull-left">
                    <img alt="image" src="img/landing/avatar3.jpg"/>
                  </a>
                  <div className="media-body">
                    <div className="commens-name">
                      Paula Williams
                    </div>
                    <small className="text-muted">A-NET from Dubai</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="bubble">
                  "Great tool to automate employees feedback process and also get insights into changes over time! Easy to use - must have for any leader!."
                </div>
                <div className="comments-avatar">
                  <a href="" className="pull-left">
                    <img alt="image" src="img/landing/avatar1.jpg"/>
                  </a>
                  <div className="media-body">
                    <div className="commens-name">
                      Peter Nielsen
                    </div>
                    <small className="text-muted">British Telcom from Malaysia</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="bubble">
                  "Such a great service that provides me with valuable insight into our employee satisfaction. Thank you theLeader.io"
                </div>
                <div className="comments-avatar">
                  <a href="" className="pull-left">
                    <img alt="image" src="img/landing/avatar2.jpg"/>
                  </a>
                  <div className="media-body">
                    <div className="commens-name">
                      Eduardo Mora
                    </div>
                    <small className="text-muted">VietnamWorks from Vietnam</small>
                  </div>
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
                  Our Vision in theLeader.io is to help leaders like you to become a better leader. You can make decisions for your employees based on data and monitor employee satisfaction to reduce your turn over rate. Leadership matters a lot.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 text-center">
                <a href="mailto:test@email.com" className="btn btn-primary">Send us mail</a>
                <p className="m-t-sm">
                  Or follow us on social platform
                </p>
                <ul className="list-inline social-icon">
                  <li><a href="#"><i className="fa fa-twitter"></i></a>
                  </li>
                  <li><a href="#"><i className="fa fa-facebook"></i></a>
                  </li>
                  <li><a href="#"><i className="fa fa-linkedin"></i></a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 text-center m-t-lg m-b-lg">
                <p><strong>&copy; 2016 theLeader.io</strong><br/>
                  We Help Leaders to become a better Leader by improving the Decision Making Process.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }

}