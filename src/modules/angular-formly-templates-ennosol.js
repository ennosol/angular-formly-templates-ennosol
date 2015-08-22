angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2'], function configFormlyEnnosol(formlyConfigProvider) {
    'use strict';

    // WRAPPERS
    formlyConfigProvider.setWrapper([{
        name: 'label',
        templateUrl: '/src/templates/label.html'
    }, {
        name: 'addons',
        templateUrl: '/src/templates/addons.html'
    }]);

    // TYPES
    formlyConfigProvider.setType([{
        name: 'checkbox',
        templateUrl: '/src/templates/checkbox.html',
        wrapper: []
    }, {
        name: 'switch',
        templateUrl: '/src/templates/switch.html',
        wrapper: ['label']
    }, {
        name: 'radio',
        templateUrl: '/src/templates/radio.html',
        wrapper: ['label']
    }, {
        name: 'radio-inline',
        templateUrl: '/src/templates/radio-inline.html',
        wrapper: ['label']
    }, {
        name: 'input',
        templateUrl: '/src/templates/input.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'date',
        templateUrl: '/src/templates/date.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'daterange',
        templateUrl: '/src/templates/daterange.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'coordinate',
        templateUrl: '/src/templates/coordinate.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'static',
        templateUrl: '/src/templates/static.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'textarea',
        templateUrl: '/src/templates/textarea.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'spinner',
        templateUrl: '/src/templates/spinner.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'search',
        templateUrl: '/src/templates/search.html',
        wrapper: ['label']
    }, {
        name: 'tags',
        templateUrl: '/src/templates/tags.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'select',
        templateUrl: '/src/templates/select.html',
        wrapper: ['addons', 'label']
    }]);

})

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

.service('formlyEnnosolCfg', function($q, $http) {

    // This allows the controller to handle dot notation syntax
    // when addressing the model.
    // This also disallows the use of dots in keys
    this.initDotModel = function(scope, model, dotModel) {

        var self = this;

        // Access an object's properties via dot notation
        // Creates any keys not yet present as objects
        self.dotGet = function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1');
            s = s.replace(/^\./, '');
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (!(k in o)) {
                    o[k] = {};
                }
                o = o[k];
            }
            return o;
        };

        self.dotSet = function(object, dotNotation, value) {

            var segments = dotNotation.split('.');
            var segLen = segments.length;

            for (var i = 0; i < segLen; ++i) {
                var seg = segments[i];

                if (Object.prototype.toString.call(object) !== '[object Object]') {
                    continue;
                }

                if (!(seg in object)) {
                    object[seg] = {};
                }

                if (i === segLen - 1) {
                    object[seg] = value;
                } else {
                    object = object[seg];
                }
            }
        };

        if (typeof model === 'undefined') {
            model = 'model';
        }

        if (Object.prototype.toString.call(scope[model]) !== '[object Object]') {
            scope[model] = {};
        }

        scope.$watch(model, function(value) {

            scope[dotModel] = {};

            if (Object.prototype.toString.call(value) !== '[object Object]') {
                return;
            }

            // Update the model
            for (var prop in value) {

                var oprop = prop;
                prop = prop.replace(/\[(\w+)\]/g, '.$1');
                prop = prop.replace(/^\./, '');

                if (prop.indexOf('.') > 0) {
                    self.dotSet(scope[model], prop, value[prop]);
                }
            }

            // Update the dot copy of the model (this is read-only!)
            for (var prop in value) {

                var oprop = prop;
                prop = prop.replace(/\[(\w+)\]/g, '.$1');
                prop = prop.replace(/^\./, '');

                if (prop.indexOf('.') <= 0) {
                    scope[dotModel][prop] = scope[model][prop];
                }
            }
        }, true);
    };

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
                var accessor = self.cfg.dataAccessor.split('.');
                do {
                    var a = accessor.splice(0, 1);
                    if (angular.isNumber(a)) a = a * 1;
                    data = data[a];
                } while (accessor.length > 0);
            }

            // make sure we have an id
            if (self.cfg.idField !== 'id') {
                data.forEach(function(elem, ndx, arr) {
                    arr[ndx]['id'] = arr[ndx][self.cfg.idField];
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
});

