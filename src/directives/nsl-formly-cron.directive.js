angular.module('formlyEnnosol')
    .directive('nslFormlyCron', function() {
        return {
            restrict: 'C',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                scope.$watch('cronOutput', function() {
                   ngModel.$setViewValue(scope.cronOutput);
                });
            }
        };
    });
