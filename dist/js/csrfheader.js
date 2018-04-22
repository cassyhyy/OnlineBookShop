$(document).ajaxSend(function(event,request,settings) {
    if(window.localStorage) {
    var csrf = window.localStorage.getItem('csrf') || null;
        if(csrf !== null)
            request.setRequestHeader('x-access-token',csrf);
    }
});