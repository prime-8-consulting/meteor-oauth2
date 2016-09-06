/*
    This file just contains convenient methods for auto-filling the oauth2 login form configuration. None
    of the code here is important for implementing oauth2 on your site.
 */

$(document).ready(function() {
    // update the fields when the dialog is dynamically added.
    $(document).on('DOMNodeInserted', '#configure-login-service-dialog', function(e) {
        populateServiceValues(e.target);
    });

    // update the fields on page load.
    populateServiceValues($('#configure-login-service-dialog'));
});

function populateServiceValues(target) {
    var setCount = 0;
    setCount += prePopulateValues(target, 'configure-login-service-dialog-clientId', 'clientApplication');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-secret', '12345');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-baseUrl', 'http://localhost:3100');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-loginUrl', 'http://localhost:3100');

    // a hacky way to make the meteor configure interface make the save button
    // enabled. it only enables if it detects key up events in the input fields.
    if (setCount) {
        $('#configure-login-service-dialog-clientId').trigger('keyup', 17);
    }
}

function prePopulateValues(target, id, value) {
    var el = $(target).find('#' + id);
    if (!el.length) {
        return false;
    }

    if (!el.val()) {
        el.val(value);
        return true;
    }

    return false;
}
