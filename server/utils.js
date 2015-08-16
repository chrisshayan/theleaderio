Meteor.startup(function() {

    Utils = {};
    Utils.compileServerTemplate = function(templateName, templatePath, params) {
        check(templateName, String);
        check(templatePath, String);
        if (!params) params = {};
        check(params, Match.Optional(Object));
        SSR.compileTemplate(templateName, Assets.getText(templatePath));
        return SSR.render(templateName, params);
    }
    
});


