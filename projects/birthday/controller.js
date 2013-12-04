/**
 * Created with IntelliJ IDEA.
 * User: brentbaumgartner
 * Date: 5/2/13
 * Time: 10:24 PM
 * To change this template use File | Settings | File Templates.
 */

function AppCtrl($scope) {
    // init the FB JS SDK
    FB.init({
        appId: '504700996255700',                       // App ID from the app dashboard
        channelUrl: '//localhost:8888/channel.html',                  // Channel file for x-domain comms
        status: true,                                 // Check Facebook Login status
        xfbml: true                                  // Look for social plugins on the page
    });

    FB.api('/me', function (response) {
        alert('Your name is ' + response.name);
    });

    $scope.login = FB.login(function (response) {
        if (response.authResponse) {
            $scope.welcome = 'Welcome!  Fetching your information.... ';
            FB.api('/me', function (response) {
                $scope.welcome = "Welcome, " + response.name;
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
};