import React, {Component} from 'react';

// components
import CheckBox from '/imports/ui/components/CheckBox1';

export default class SingleInputForm extends Component {

  constructor() {
    super();

    this.state = {
      showPassword: false,
      errors: null
    };
  }

  _onSubmit() {
    this.setState({
      errors: null
    });
    const inputValue = this.refs.input.value;
    if(_.isEmpty(inputValue)) {
      this.setState({
        errors: `Please enter your ${this.props.inputHolder}`
      });
    } else {
      this.props.onSubmit({ inputValue });
    }
  }

  render() {
    const
      {showPassword} = this.state,
      {
      inputType = 'email',
      inputHolder = 'Email address',
      buttonLabel = 'Send new password',
      havePasswordForm = false,
      errors = null
    } = this.props;

    return (
      <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
        <div className="form-group">
          <input ref="input"
                 type={havePasswordForm ? (showPassword ? "text" : "password") : inputType }
                 className="form-control"
                 placeholder={ inputHolder }
                 autoFocus
          />
        </div>
        {havePasswordForm && (
          <div className="form-group text-left">
            <CheckBox
              label=" show password"
              checked={showPassword}
              onChange={value => this.setState({ showPassword: value })}
            />
          </div>
        )}
        <div className="form-group">
          {!_.isEmpty(errors) && (
            <p ref="error" className="alert-danger text-center">{errors}</p>
          )}
          {!_.isEmpty(this.state.errors) && (
            <p ref="error" className="alert-danger text-center">{this.state.errors}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary block full-width m-b">
          { buttonLabel } <i className="fa fa-arrow-right"></i>
        </button>
      </form>
    );
  }
}