angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2'], ['formlyConfigProvider', function configFormlyEnnosol(formlyConfigProvider) {
    'use strict';

    // WRAPPERS
    formlyConfigProvider.setWrapper([{
        name: 'label',
        templateUrl: '/src/templates/label.html'
    }, {
        name: 'addons',
        templateUrl: '/src/templates/addons.html'
    }, {
        name: 'fieldset',
        templateUrl: '/src/templates/fieldset.html'
    }, {
        name: 'validation',
        templateUrl: '/src/templates/error.html'
    }]);

    // TYPES
    formlyConfigProvider.setType([{
        name: 'nested',
        wrapper: ['fieldset'],
        template: '<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>'
    }, {
        name: 'checkbox',
        templateUrl: '/src/templates/checkbox.html',
        wrapper: ['validation']
    }, {
        name: 'switch',
        templateUrl: '/src/templates/switch.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'radio',
        templateUrl: '/src/templates/radio.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'radio-inline',
        templateUrl: '/src/templates/radio-inline.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'input',
        templateUrl: '/src/templates/input.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'date',
        templateUrl: '/src/templates/date.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'daterange',
        templateUrl: '/src/templates/daterange.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'coordinate',
        templateUrl: '/src/templates/coordinate.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'static',
        templateUrl: '/src/templates/static.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'textarea',
        templateUrl: '/src/templates/textarea.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'spinner',
        templateUrl: '/src/templates/spinner.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'search',
        templateUrl: '/src/templates/search.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'tags',
        templateUrl: '/src/templates/tags.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'select',
        templateUrl: '/src/templates/select.html',
        wrapper: ['label', 'validation']
    }]);

}])

.directive('nslTouchspin', function () {
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
        }
    };
})

.directive('nslFormlyDatepicker', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element, ngModelController) {
            // Zero timeout for access the compiled template
            $timeout(function() {
                // Cut off UTC info
                $(element).val($(element).val().substring(0, 10));

                // Trigger input event for updating ng-model
                $(element).datepicker()
                    .on('changeDate', function() {
                        element.trigger('input');
                    });
            }, 0);
        }
    };
})

.service('formlyEnnosolCfg', ['$q', '$http', function($q, $http) {

    this.configuration = function() {

        var self = this;

        self.url = '';
        self.method = 'get';
        self.delay = 250;

        self.idField = 'id';
        self.dataAccessor = '';
        self.termParam = 'query';
        self.termAccessor = 'term';
        self.pageParam = 'page';
        self.pageAccessor = 'page';

        self.data = function(params) {
            var data = {};
            data[self.cfg.termParam] = params[self.cfg.termAccessor];
            data[self.cfg.pageParam] = params[self.cfg.pageAccessor];
            return data;
        };

        self.processResults = function(data, page) {

            // access the target array
            if (self.cfg.dataAccessor !== '') {
                var accessor = self.cfg.dataAccessor.split('--');
                do {
                    var a = accessor.splice(0, 1);
                    if (angular.isNumber(a)) {
                        a = a * 1;
                    }
                    data = data[a];
                } while (accessor.length > 0);
            }

            // make sure we have an id
            if (self.cfg.idField !== 'id') {
                data.forEach(function(elem, ndx, arr) {
                    arr[ndx].id = arr[ndx][self.cfg.idField];
                });
            }

            return {
                results: data
            };
        };

        self.templateResult = function(data) {
            return data.text;
        };

        self.templateSelection = function(data) {
            return data.text;
        };

        self.escapeMarkup = function(markup) {
            return markup;
        };

        self.getConfig = function(config) {
            if (typeof config === 'undefined') {
                config = {};
            }
            self.cfg = angular.merge({}, self, config);
            return {
                ajax: {
                    type: self.cfg.method,
                    method: self.cfg.method,
                    dataType: 'json',
                    delay: self.cfg.delay,
                    cache: true,
                    transport: self.cfg.jTransport,
                    url: self.cfg.url,
                    data: self.cfg.data,
                    params: self.cfg.data,
                    processResults: self.cfg.processResults
                },
                templateResult: self.cfg.templateResult,
                templateSelection: self.cfg.templateSelection,
                escapeMarkup: self.cfg.escapeMarkup
            };
        };
        self.getConfig({});

        self.jTransport = function(params, success, failure) {
            var $request = $.ajax(params);

            $request.then(success);
            $request.fail(failure);

            return $request;
        };

        self.aTransport = function(params, success, failure) {
            var timeout = $q.defer();

            params.method = params.type;
            params.params = params.data;

            angular.extend({
                timeout: timeout
            }, params);

            $http(params).then(function(response) {
                success(response.data);
            }, failure);

            return {
                abort: timeout.resolve
            };
        };
    };
}]);
