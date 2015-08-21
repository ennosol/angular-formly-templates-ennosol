angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2'], ["formlyConfigProvider", function configFormlyEnnosol(formlyConfigProvider) {
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

.service('formlyEnnosolSearchConfigService', ["$q", "$http", function($q, $http) {

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
}]);


angular.module("formlyEnnosol").run(["$templateCache", function($templateCache) {$templateCache.put("templates/addons.html","<div ng-class=\"{\'input-group\': to.addonLeft || to.addonRight}\"><div style=\"border:0\" class=\"input-group-addon {{to.addonLeft.bgClassName}}\" ng-if=\"to.addonLeft\" ng-style=\"{cursor: to.addonLeft.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonLeft.onClick(options, this)\"><i class=\"{{to.addonLeft.className}}\" ng-if=\"to.addonLeft.className\"></i> <span ng-if=\"to.addonLeft.text\">{{to.addonLeft.text}}</span></div><formly-transclude></formly-transclude><div style=\"border:0\" class=\"input-group-addon {{to.addonRight.bgClassName}}\" ng-if=\"to.addonRight\" ng-style=\"{cursor: to.addonRight.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonRight.onClick(options, this)\"><i class=\"{{to.addonRight.className}}\" ng-if=\"to.addonRight.className\"></i> <span ng-if=\"to.addonRight.text\">{{to.addonRight.text}}</span></div></div>");
$templateCache.put("templates/checkbox.html","<div class=\"checkbox clip-check check-primary\"><input type=\"checkbox\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\"> <label for=\"{{id}}-chk\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label></div>");
$templateCache.put("templates/coordinate.html","<div class=\"input-group\"><input class=\"form-control text-center\" name=\"lat\" ng-model=\"model[options.key][\'lat\']\" placeholder=\"{{to.placeholder.lat}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control text-center\" name=\"lng\" ng-model=\"model[options.key][\'lng\']\" placeholder=\"{{to.placeholder.lng}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div>");
$templateCache.put("templates/date.html","<div class=\"form-group\"><input class=\"form-control show text-center\" data-provide=\"{{to.readOnly || to.disabled ? \'\' : \'datepicker\'}}\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("templates/daterange.html","<div class=\"form-group\"><div class=\"input-daterange input-group\" data-provide=\"datepicker\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"><input class=\"form-control show\" name=\"start\" ng-model=\"model[options.key][\'start\']\" placeholder=\"{{to.placeholder.start}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control show\" name=\"end\" ng-model=\"model[options.key][\'end\']\" placeholder=\"{{to.placeholder.end}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div></div>");
$templateCache.put("templates/input.html","<div class=\"form-group\"><input class=\"form-control\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"{{to.password ? \'password\' : (to.type ? to.type : \'text\')}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("templates/label.html","<div class=\"form-group\"><label for=\"{{id}}\" class=\"control-label\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label><div><formly-transclude></formly-transclude></div><em id=\"{{id}}_description\" class=\"help-block\" ng-if=\"options.templateOptions.description\" style=\"opacity:0.6\">{{options.templateOptions.description}}</em></div>");
$templateCache.put("templates/radio-inline.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio-inline\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'value\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'name\']}}</label></div></div>");
$templateCache.put("templates/radio.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio margin-right-20\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'value\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'name\']}}</label></div></div>");
$templateCache.put("templates/search.html","<div class=\"form-group\"><select ts-select2=\"to.config\" ng-model=\"model[options.key]\" data-text-field=\"to.textField\" data-text-fn=\"to.textFn\"></select></div>");
$templateCache.put("templates/select.html","<div class=\"form-group\"><select class=\"form-control\" ng-model=\"model[options.key]\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\"><option ng-repeat=\"(key, option) in to.options\" ng-if=\"(!to.readOnly && !to.disabled) || option[to.valueProp || \'value\'] === options.defaultValue\" ng-value=\"option[to.valueProp || \'value\']\" ng-selected=\"options.defaultValue==option[to.valueProp || \'value\']\">{{option[to.labelProp || \'name\']}}</option></select><span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("templates/spinner.html","<div class=\"form-group\"><input nsl-touchspin=\"\" class=\"form-control text-center\" type=\"text\" ng-model=\"model[options.key]\" data-min=\"to.data.min\" data-max=\"to.data.max\" data-step=\"to.data.step\" data-stepinterval=\"to.data.stepInterval\" data-decimals=\"to.data.decimals\" data-boost-at=\"to.data.boostAt\" data-max-boosted-step=\"to.data.maxBoostedStep\" data-prefix=\"to.data.prefix\" data-postfix=\"to.data.postfix\" data-vertical-buttoms=\"to.data.verticalButtons\"></div>");
$templateCache.put("templates/static.html","<div class=\"form-group\"><p class=\"form-control-static\">{{model[options.key]}}</p></div>");
$templateCache.put("templates/switch.html","<input type=\"checkbox\" class=\"js-switch\" ui-switch=\"\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\">");
$templateCache.put("templates/tags.html","<div class=\"form-group\"><select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"option for option in to.options track by option\" data-tags=\"true\" multiple=\"multiple\"></select></div>");
$templateCache.put("templates/textarea.html","<textarea class=\"form-control\" rows=\"{{options.templateOptions.rows? options.templateOptions.rows: \'5\'}}\" placeholder=\"{{options.templateOptions.placeholder}}\" ng-model=\"model[options.key]\"></textarea>");}]);