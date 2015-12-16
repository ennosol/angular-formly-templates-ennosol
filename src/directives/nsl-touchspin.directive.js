angular.module('formlyEnnosol')
    .directive('nslTouchspin', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                min: '=',
                max: '=',
                step: '=',
                stepInterval: '=',
                decimals: '=',
                boostAt: '=',
                maxBoostedStep: '=',
                prefix: '=',
                postfix: '=',
                verticalButtons: '='
            },
            link: function(scope, element, attrs) {
                if (typeof scope.min === 'undefined') {
                    scope.min = Number.MIN_SAFE_INTEGER || -Number.MAX_VALUE;
                }
                if (typeof scope.max === 'undefined') {
                    scope.max = Number.MAX_SAFE_INTEGER || Number.MAX_VALUE;
                }
                if (typeof scope.step === 'undefined' || scope.step === 0) {
                    scope.step = 1;
                }

                $(element).TouchSpin({
                    min: scope.min,
                    max: scope.max,
                    step: scope.step,
                    stepinterval: scope.stepInterval || 50,
                    decimals: scope.decimals || 0,
                    boostat: scope.boostAt || 5,
                    maxboostedstep: scope.maxBoostedStep || 10,
                    prefix: scope.prefix || '',
                    postfix: scope.postfix || '',
                    verticalbuttons: scope.verticalButtons || false
                });

                // Zero timeout for access the compiled template
                $timeout(function() {
                    // Trigger input event for updating ng-model
                    $(element)
                        .on('change', function() {
                            element.trigger('input');
                        });
                }, 0);
            }
        };
    }]);
