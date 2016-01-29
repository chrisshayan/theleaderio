/**
 * 1: invite leader
 * 2: invite employee by email
 * 3: invite employee by userId
 * 4: invite friend(as a leader) by email
 * 5: invite friend(as a leader) by userId
 * @type {{}}
 */
Request.TYPE = {
	INVITE_LEADER               : 1,
	INVITE_EMPLOYEE_BY_EMAIL    : 2,
	INVITE_EMPLOYEE_BY_ID       : 3,
	INVITE_FRIEND_BY_EMAIL      : 4,
	INVITE_FRIEND_BY_ID         : 5
};

Request.STATUS = {
	NEW         : 'NEW',
	ACCEPTED    : 'ACCEPTED', // also mean : Connected
	DENIED      : 'DENIED'
};

Request.mapToApi = function(r) {
	var _req = new Request(r);
	r.requester = _req.requester();
	return r;
};