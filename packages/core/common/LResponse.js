/**
 * Common response
 */
class LResponse {
	constructor() {
		this._code = '';
		this._message = '';
		this._details = {};
		this._payload = {};
	}

	static get CODE() {
		return {
			SUCCESS: 'SUCCESS',
			INVALID_OPERATION: 'INVALID_OPERATION',
			PERMISSION_DENIED: 'PERMISSION_DENIED',
			INVALID_PARAMETER: 'INVALID_PARAMETER',
			NOT_FOUND: 'NOT_FOUND',
			UNAUTHORIZED: 'UNAUTHORIZED',
			UNKNOWN: 'UNKNOWN',
			SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
			SERVER_ERROR: 'SERVER_ERROR',
		};
	}

	setCode(code) {
		check(code, String);
		this._code = code;
		return this;
	}

	setMessage(msg) {
		check(msg, String);
		this._message = msg;
		return this;
	}

	setDetails(details) {
		check(details, Object);
		this._details = details;
		return this;
	}

	setPayload(payload) {
		check(payload, Match.Any);
		this._payload = payload;
		return this;
	}

	/**
	 * output final result
	 *
	 * @return {object}
	 */
	end() {
		return {
			code: this._code,
			message: this._message,
			details: this._details,
			payload: this._payload
		};
	}

	//========================================================================//
	// Common response
	//========================================================================//

	/**
	 * Default error response
	 */
	error() {
		this._code = LResponse.CODE.INVALID_PARAMETER;
		this._message = 'Invalid parameter';
		this._details = {};
		this._payload = {};
		return this;
	}

	/**
	 * Default success response
	 * @param payload {object} main data that user need
	 */
	success(payload = {}) {
		this._code = LResponse.CODE.SUCCESS;
		this._message = 'success';
		this._details = {};
		this._payload = payload;
		return this;
	}

	/**
	 * Error response for unknown cases
	 */
	unknownError() {
		this._code = LResponse.CODE.UNKNOWN;
		this._message = 'Unknown error';
		this._details = {};
		this._payload = {};
		return this;
	}

	/**
	 * Error response for any parameter invalid
	 * @param details
	 */
	invalidParameter(details = {}, msg = 'Invalid parameter') {
		this._code = LResponse.CODE.INVALID_PARAMETER;
		this._message = msg;
		this._details = details;
		this._payload = {};
		return this;
	}

	/**
	 * Error response if action required user login
	 */
	userNotLoggedIn() {
		this._code = LResponse.CODE.UNAUTHORIZED;
		this._message = 'User not logged in';
		this._details = {};
		this._payload = {};
		return this;
	}

	/**
	 * Error response if user don't have permission on an action or data
	 * @param details
	 */
	permissionDenied(details = {}, msg = 'Permission denied') {
		this._code = LResponse.CODE.PERMISSION_DENIED;
		this._message = msg;
		this._details = details;
		this._payload = {};
		return this;
	}

	/**
	 * Error response if data not found
	 *
	 * Ex: postId is not found
	 * => {code: 'NOT_FOUND', message: 'Post is not found', details: {postId: "postId not found"}, payload: {}}
	 *
	 * @param details
	 * @param message
	 */
	notFound(details = {}, message = null) {
		this._code = LResponse.CODE.NOT_FOUND;
		this._message = message || 'Data not found';
		this._details = details;
		this._payload = {};
		return this;
	}
}

this.LResponse = LResponse;
