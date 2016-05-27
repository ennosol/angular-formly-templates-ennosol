angular.module('formlyEnnosol')
    .directive('nslFormlyDatepicker', ['$timeout', function($timeout) {
        return {
            restrict: 'CA',
            scope: {
                datePickerOptions: '='
            },
            link: function(scope, element) {
                // Extend the default options with the user defined options
                var options = angular.extend({
                    autoclose: true
                }, scope.datePickerOptions);

                // Zero timeout for access the compiled template
                $timeout(function() {
                    // Cut off UTC info
                    $(element).val($(element).val().substring(0, 10));

                    // Trigger input event for updating ng-model
                    $(element).datepicker(options)
                        .on('changeDate', function() {
                            element.trigger('input');
                        });
                }, 0);
            }
        };
    }]);
