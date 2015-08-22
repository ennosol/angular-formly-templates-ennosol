angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2'], ['formlyConfigProvider', function configFormlyEnnosol(formlyConfigProvider) {
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
        wrapper: ['label']
    }, {
        name: 'select',
        templateUrl: '/src/templates/select.html',
        wrapper: ['label']
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

.service('formlyEnnosolCfg', ['$q', '$http', function($q, $http) {

    // This allows the controller to handle dot notation syntax
    // when addressing the model.
    // This also disallows the use of dots in keys
    this.initDotModel = function(scope, model, dotModel) {

        var self = this;

        // Access an object's properties via dot notation
        // Creates any keys not yet present as objects
        self.dotGet = function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '--$1');
            s = s.replace(/^--/, '');
            var a = s.split('--');
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

            var segments = dotNotation.split('--');
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
                prop = prop.replace(/\[(\w+)\]/g, '--$1');
                prop = prop.replace(/^--/, '');

                if (prop.indexOf('--') > 0) {
                    self.dotSet(scope[model], prop, value[prop]);
                }
            }

            // Update the dot copy of the model (this is read-only!)
            for (var prop in value) {

                var oprop = prop;
                prop = prop.replace(/\[(\w+)\]/g, '--$1');
                prop = prop.replace(/^--/, '');

                if (prop.indexOf('--') <= 0) {
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

angular.module("formlyEnnosol").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/addons.html","<div ng-class=\"{\'input-group\': to.addonLeft || to.addonRight}\"><div style=\"border:0\" class=\"input-group-addon {{to.addonLeft.bgClassName}}\" ng-if=\"to.addonLeft\" ng-style=\"{cursor: to.addonLeft.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonLeft.onClick(options, this)\"><i class=\"{{to.addonLeft.className}}\" ng-if=\"to.addonLeft.className\"></i> <span ng-if=\"to.addonLeft.text\">{{to.addonLeft.text}}</span></div><formly-transclude></formly-transclude><div style=\"border:0\" class=\"input-group-addon {{to.addonRight.bgClassName}}\" ng-if=\"to.addonRight\" ng-style=\"{cursor: to.addonRight.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonRight.onClick(options, this)\"><i class=\"{{to.addonRight.className}}\" ng-if=\"to.addonRight.className\"></i> <span ng-if=\"to.addonRight.text\">{{to.addonRight.text}}</span></div></div>");
$templateCache.put("/src/templates/checkbox.html","<div class=\"checkbox clip-check check-primary\"><input type=\"checkbox\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\"> <label for=\"{{id}}-chk\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label></div>");
$templateCache.put("/src/templates/coordinate.html","<div class=\"input-group\"><input class=\"form-control text-center\" id=\"{{id}}_lat\" name=\"lat\" ng-model=\"model[options.key][\'lat\']\" placeholder=\"{{to.placeholder.lat}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;{{to.separator.style}}\" ng-click=\"to.separator.click(id)\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control text-center\" id=\"{{id}}_lng\" name=\"lng\" ng-model=\"model[options.key][\'lng\']\" placeholder=\"{{to.placeholder.lng}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div>");
$templateCache.put("/src/templates/date.html","<div class=\"form-group\"><input class=\"form-control show text-center\" data-provide=\"{{to.readOnly || to.disabled ? \'\' : \'datepicker\'}}\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/daterange.html","<div class=\"form-group\"><div class=\"input-daterange input-group\" data-provide=\"datepicker\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"><input class=\"form-control show\" name=\"start\" ng-model=\"model[options.key][\'start\']\" placeholder=\"{{to.placeholder.start}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control show\" name=\"end\" ng-model=\"model[options.key][\'end\']\" placeholder=\"{{to.placeholder.end}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div></div>");
$templateCache.put("/src/templates/input.html","<div class=\"form-group\"><input class=\"form-control\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"{{to.password ? \'password\' : (to.type ? to.type : \'text\')}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/label.html","<div class=\"form-group\"><label for=\"{{id}}\" class=\"control-label\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label><div><formly-transclude></formly-transclude></div><em id=\"{{id}}_description\" class=\"help-block\" ng-if=\"options.templateOptions.description\" style=\"opacity:0.6\">{{options.templateOptions.description}}</em></div>");
$templateCache.put("/src/templates/radio-inline.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio-inline\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/radio.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio margin-right-20\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/search.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" data-text-field=\"to.textField\" data-text-fn=\"to.textFn\"></select>");
$templateCache.put("/src/templates/select.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"key as value for (key, value) in to.options track by key\"></select>");
$templateCache.put("/src/templates/spinner.html","<div class=\"form-group\"><input nsl-touchspin=\"\" class=\"form-control text-center\" type=\"text\" ng-model=\"model[options.key]\" data-min=\"to.data.min\" data-max=\"to.data.max\" data-step=\"to.data.step\" data-stepinterval=\"to.data.stepInterval\" data-decimals=\"to.data.decimals\" data-boost-at=\"to.data.boostAt\" data-max-boosted-step=\"to.data.maxBoostedStep\" data-prefix=\"to.data.prefix\" data-postfix=\"to.data.postfix\" data-vertical-buttoms=\"to.data.verticalButtons\"></div>");
$templateCache.put("/src/templates/static.html","<div class=\"form-group\"><p class=\"form-control-static\">{{model[options.key]}}</p></div>");
$templateCache.put("/src/templates/switch.html","<input type=\"checkbox\" class=\"js-switch\" ui-switch=\"\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\">");
$templateCache.put("/src/templates/tags.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"option for option in to.options track by option\" data-tags=\"true\" multiple=\"multiple\"></select>");
$templateCache.put("/src/templates/textarea.html","<textarea class=\"form-control\" rows=\"{{options.templateOptions.rows? options.templateOptions.rows: \'5\'}}\" placeholder=\"{{options.templateOptions.placeholder}}\" ng-model=\"model[options.key]\"></textarea>");}]);