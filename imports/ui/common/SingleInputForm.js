import React, {Component} from 'react';

import Copyright from '/imports/ui/common/Copyright';

export default class SingleInputForm extends Component {

  _onSubmit() {
    const inputValue = this.refs.input.value;
    this.props.onSubmit({ inputValue });
  }

  render() {
    const {
      logoName = 'TL+',
      formTitle = 'Forgot password',
      formDescription = 'Enter your email address and your password will be reset and emailed to you.',
      inputType = 'email',
      inputHolder = 'Email address',
      buttonLabel = 'Send new password',
      errors = null,
      onSubmit = () => null
    } = this.props;

    return (
      <div className="middle-box text-center animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name">{ logoName }</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="ibox-content">
                <h2 className="font-bold">{ formTitle }</h2>
                <p>
                  { formDescription }
                </p>
                <div className="row">
                  <div className="col-lg-12">
                    <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
                      <div className="form-group">
                        <input ref="input" type={ inputType } className="form-control" placeholder={ inputHolder } required=""/>
                      </div>
                      <div className="form-group">
                        {!_.isEmpty(errors) && (
                          <p className="alert-danger text-center">{errors}</p>
                        )}
                      </div>
                      <button type="submit" className="btn btn-primary block full-width m-b">
                        { buttonLabel } <i className="fa fa-arrow-right"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Copyright />
        </div>
      </div>
    );
  }
}