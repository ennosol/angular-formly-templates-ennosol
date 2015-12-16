angular.module('formlyEnnosol')
    .directive('nslError', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // Error block added to DOM (by ng-if)
                $(element).next().addClass('has-error');

                // Error block removed from DOM (by ng-if)
                scope.$on('$destroy', function() {
                    $(element).next().removeClass('has-error');
                });
            }
        };
    });
