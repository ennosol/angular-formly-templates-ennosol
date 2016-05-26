angular.module('formlyEnnosol')
    .directive('nslFormlyTimepicker', ['$timeout', function($timeout) {
        return {
            restrict: 'C',
            link: function(scope, element) {
                // Zero timeout for access the compiled template
                $timeout(function() {
                    // Cut off UTC info
                    $(element).clockpicker({
                        placement: 'bottom',
                        align: 'left',
                        autoclose: true,
                        'default': 'now'
                    });

                    // Trigger input event for updating ng-model
                    $(element).clockpicker()
                        .on('change', function() {
                            element.find('input').trigger('input');
                        });
                }, 0);
            }
        };
    }]);
