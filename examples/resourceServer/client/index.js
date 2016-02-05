$(document).ready(function() {
    $(document).on('DOMNodeInserted', function(e) {
        var setCount = 0;
        setCount += prePopulateValues(e, 'configure-login-service-dialog-clientId', 'resourceServerClient');
        setCount += prePopulateValues(e, 'configure-login-service-dialog-secret', '12345');
        setCount += prePopulateValues(e, 'configure-login-service-dialog-baseUrl', 'http://localhost:3100');
        setCount += prePopulateValues(e, 'configure-login-service-dialog-loginUrl', 'http://localhost:3100');

        // a hacky way to make the meteor configure interface make the save button
        // enabled. it only enables if it detects key up events in the input fields.
        if (setCount) {
            $('#configure-login-service-dialog-clientId').trigger('keyup', 17);
        }
    });
});

function prePopulateValues(e, id, value) {
    var el = $(e.target).find('#' + id);
    if (!el.length) {
        return false;
    }

    if (!el.val()) {
        el.val(value);
        return true;
    }

    return false;
}

Template.main.events({
    'click button.resetServiceConfiguration': function() {
        Meteor.call('resetServiceConfiguration');
    }
});