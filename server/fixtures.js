setupFixtures = function() {
	// setup default administrator
	setupDefaultAdmin();
	
	// setup industries
	setupIndustries();
}

function setupIndustries() {
	if(Collections.Industries.find().count() > 0) return;

	var rawJson = Assets.getText("industries.json");
	var data = EJSON.parse(rawJson);
	_.each(data.industries, function(i) {
		var _item = {
			name: i.label
		};
		Collections.Industries.insert(_item);		
	});
}


function setupDefaultAdmin() {
	hasAdmin = Meteor.users.findOne({roles: "admin"});
	if(!hasAdmin) {
		var userId = Accounts.createUser({
			username: "admin",
			email: "admin@theleader.io",
			password: "123456",
			profile: {
				firstName: "Chris",
				lastName: "Shayan"
			}
		});
		if(userId) {
			Roles.addUsersToRoles(userId, [ROLE.ADMIN, ROLE.LEADER]);
		}
	}
}