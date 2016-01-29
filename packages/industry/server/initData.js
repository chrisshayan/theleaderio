const industries = [{
	key: 1,
	label: "Accounting"
}, {
	key: 2,
	label: "Administrative/Clerical"
}, {
	key: 3,
	label: "Advertising/Promotion/PR"
}, {
	key: 4,
	label: "Agriculture/Forestry"
}, {
	key: 5,
	label: "Architecture/Interior Design"
}, {
	key: 6,
	label: "Pharmaceutical/Biotech"
}, {
	key: 7,
	label: "Civil/Construction"
}, {
	key: 8,
	label: "Consulting"
}, {
	key: 10,
	label: "Arts/Design"
}, {
	key: 11,
	label: "Customer Service"
}, {
	key: 12,
	label: "Education/Training"
}, {
	key: 15,
	label: "Entry level"
}, {
	key: 16,
	label: "Environment/Waste Services"
}, {
	key: 17,
	label: "Executive management"
}, {
	key: 18,
	label: "Expatriate Jobs in Vietnam"
}, {
	key: 19,
	label: "Export-Import"
}, {
	key: 21,
	label: "NGO/Non-Profit"
}, {
	key: 22,
	label: "Health/Medical Care"
}, {
	key: 23,
	label: "Human Resources"
}, {
	key: 24,
	label: "Insurance"
}, {
	key: 25,
	label: "Legal/Contracts"
}, {
	key: 26,
	label: "Production/Process"
}, {
	key: 27,
	label: "Marketing"
}, {
	key: 28,
	label: "Oil/Gas"
}, {
	key: 30,
	label: "Real Estate"
}, {
	key: 32,
	label: "Retail/Wholesale"
}, {
	key: 33,
	label: "Sales"
}, {
	key: 34,
	label: "Sales Technical"
}, {
	key: 35,
	label: "IT - Software"
}, {
	key: 36,
	label: "Freight/Logistics"
}, {
	key: 37,
	label: "Airlines/Tourism/Hotel"
}, {
	key: 39,
	label: "Other"
}, {
	key: 41,
	label: "Telecommunications"
}, {
	key: 42,
	label: "Banking"
}, {
	key: 43,
	label: "Chemical/Biochemical"
}, {
	key: 47,
	label: "Interpreter/Translator"
}, {
	key: 48,
	label: "TV/Media/Newspaper"
}, {
	key: 49,
	label: "Purchasing/Supply Chain"
}, {
	key: 51,
	label: "Temporary/Contract"
}, {
	key: 52,
	label: "Textiles/Garments/Footwear"
}, {
	key: 53,
	label: "Warehouse"
}, {
	key: 54,
	label: "Food & Beverage"
}, {
	key: 55,
	label: "IT - Hardware/Networking"
}, {
	key: 56,
	label: "Securities & Trading"
}, {
	key: 57,
	label: "Internet/Online Media"
}, {
	key: 58,
	label: "Auditing"
}, {
	key: 59,
	label: "Finance/Investment"
}, {
	key: 62,
	label: "Luxury Goods"
}, {
	key: 63,
	label: "Fashion/Lifestyle"
}, {
	key: 64,
	label: "Electrical/Electronics"
}, {
	key: 65,
	label: "Mechanical"
}, {
	key: 66,
	label: "High Technology"
}, {
	key: 67,
	label: "Automotive"
}, {
	key: 68,
	label: "Industrial Products"
}, {
	key: 69,
	label: "Planning/Projects"
}, {
	key: 70,
	label: "QA/QC"
}, {
	key: 71,
	label: "Overseas Jobs"
}];

const {Industries} = Meteor.TheLeader.collections;
const {Industry} = Meteor.TheLeader.models;

Meteor.startup(function() {
	if(Industries.find().count() == 0) {
		Industries.remove({});
		_.each(industries, function(item) {
			new Industry({
				name: item.label,
				order: item.key
			}).save();
		});
	}
});