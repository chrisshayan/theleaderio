import React, {Component} from 'react';


export default class AliasForm extends Component {

  constructor() {
    super();

    this.state = {
      aliasAllowed: false
    };
  }

  _onSubmit() {
    const inputValue = this.refs.input.value;
    this.props.onSubmit({inputValue});
  }

  _onKeyUp() {
    const inputValue = this.refs.input.value;
    // verify Alias
    this.props.onKeyUp({inputValue});
  }

  render() {
    const {
      inputType = 'text',
      inputHolder = 'alias',
      buttonLabel = 'Create',
      aliasAllowed = false,
      errors = null
    } = this.props;
    return (
      <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
        <div className="form-group">
          <div className="input-group m-b">
            <input
              ref="input"
              type={ inputType }
              className="form-control text-right"
              placeholder={ inputHolder }
              required
              autoFocus
              onKeyUp={() => {
                  this._onKeyUp();
                }}
            />
            <span className="input-group-addon font-bold m-t text-left" style={{borderWidth: 0, padding: 0,
    paddingLeft: 1}}>.theleader.io</span>
            {aliasAllowed && (
              <span className="input-group-addon m-t text-left text-navy" style={{borderWidth: 0, padding: 0,
    paddingLeft: 1}}>
                  <i className="fa fa-check"></i>
                </span>
            )}
          </div>
        </div>
        <div className="form-group">
          {!_.isEmpty(errors) && (
            <p ref="error" className="alert-info text-center">{errors}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary block full-width m-b" disabled={!aliasAllowed}>
          { buttonLabel } <i className="fa fa-arrow-right"></i>
        </button>
      </form>
    );
  }
}