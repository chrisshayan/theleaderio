Meteor.startup(function() {
    // DEFINE APP CONTANTS
    ROLE = {
        LEADER: 'leader',
        EMPLOYEE: 'employee',
        ADMIN: "admin"
    }

    LEADER_REQUEST_STATUS = {
    	1: "New",
    	2: "Invited",
    	3: "Connected",
        4: "Rejected"
    }
});
