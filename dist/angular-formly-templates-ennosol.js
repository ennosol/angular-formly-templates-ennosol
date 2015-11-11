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
    }, {
        name: 'multiSelect',
        templateUrl: '/src/templates/multiselect.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'repeatSection',
        templateUrl: '/src/templates/repeat-section.html',
        wrapper: [],
        controller: 'RepeatSectionController'
    }, {
        name: 'sortableRepeatSection',
        templateUrl: '/src/templates/sortable-repeat-section.html',
        wrapper: [],
        controller: 'RepeatSectionController'
    }]);
}])

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
}])

.directive('nslFormlyDatepicker', ['$timeout', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element) {
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
}])

.directive('nslSelectWatcher', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // Load saved model values to multiselect input
            $timeout(function() {
                if ($(element).attr('multiple') === 'multiple') {
                    $(element).select2().select2('val', ngModel.$modelValue);
                }
            }, 0);

            // Watch
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function(newValue) {
                // Clear select value if the model has been removed
                if (newValue === undefined) {
                    $(element).select2().select2('val', null);
                }
            });
        }
     };
}])

.controller('RepeatSectionController', ['$scope', '$timeout', function($scope, $timeout) {
    var unique = 1;

    $scope.formOptions = {formState: $scope.formState};
    $scope.addNew = addNew;
    $scope.removeItem = removeItem;
    $scope.copyFields = copyFields;

    function copyFields(fields) {
        fields = angular.copy(fields);
        addRandomIds(fields);
        return fields;
    }

    function addNew() {
        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
        var repeatsection = $scope.model[$scope.options.key];
        var lastSection = repeatsection[repeatsection.length - 1];
        var newsection = {open: true}; // open:true for the sortable-repeat-section template
        repeatsection.push(newsection);
    }

    function removeItem(idx) {
        $scope.model[$scope.options.key].splice(idx, 1);
    }

    function addRandomIds(fields) {
        unique++;
        angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
                addRandomIds(field.fieldGroup);
                return; // fieldGroups don't need an ID
            }

            if (field.templateOptions && field.templateOptions.fields) {
                addRandomIds(field.templateOptions.fields);
            }

            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //$scope.panelHeader
    $scope.getPanelHeader = function(idx) {
        var params = [];
        angular.forEach($scope.options.templateOptions.panel.header.captionFields, function(field, index) {
            if (typeof getValueByDottedKey($scope.model[$scope.options.key][idx], field) !== 'undefined')  {
                params.push(getValueByDottedKey($scope.model[$scope.options.key][idx], field));
            }
        });

        try {
            var caption = vsprintf($scope.options.templateOptions.panel.header.captionFormat, params);
        } catch(err) {
            caption = '';
        } finally {
            return caption;
        }
    }

    function getValueByDottedKey(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }
}])

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

angular.module("formlyEnnosol").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/addons.html","<div ng-class=\"{\'input-group\': to.addonLeft || to.addonRight}\"><div style=\"border:0\" class=\"input-group-addon {{to.addonLeft.bgClassName}}\" ng-if=\"to.addonLeft\" ng-style=\"{cursor: to.addonLeft.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonLeft.onClick(options, this)\"><i class=\"{{to.addonLeft.className}}\" ng-if=\"to.addonLeft.className\"></i> <span ng-if=\"to.addonLeft.text\" ng-bind-html=\"to.addonLeft.text\"></span></div><formly-transclude></formly-transclude><div style=\"border:0\" class=\"input-group-addon {{to.addonRight.bgClassName}}\" ng-if=\"to.addonRight\" ng-style=\"{cursor: to.addonRight.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonRight.onClick(options, this)\"><i class=\"{{to.addonRight.className}}\" ng-if=\"to.addonRight.className\"></i> <span ng-if=\"to.addonRight.text\" ng-bind-html=\"to.addonRight.text\"></span></div></div>");
$templateCache.put("/src/templates/checkbox.html","<div class=\"checkbox clip-check check-primary\"><input type=\"checkbox\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\"> <label for=\"{{id}}-chk\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label></div>");
$templateCache.put("/src/templates/coordinate.html","<div class=\"input-group\"><input class=\"form-control text-center\" id=\"{{id}}_lat\" name=\"lat\" ng-model=\"model[options.key][\'lat\']\" placeholder=\"{{to.placeholder.lat}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;{{to.separator.style}}\" ng-click=\"to.separator.click(id)\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control text-center\" id=\"{{id}}_lng\" name=\"lng\" ng-model=\"model[options.key][\'lng\']\" placeholder=\"{{to.placeholder.lng}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div>");
$templateCache.put("/src/templates/date.html","<div class=\"form-group\"><input class=\"form-control show text-center nslFormlyDatepicker\" data-provide=\"{{to.readOnly || to.disabled ? \'\' : \'datepicker\'}}\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/daterange.html","<div class=\"form-group\"><div class=\"input-daterange input-group\" data-provide=\"datepicker\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"><input class=\"form-control show nslFormlyDatepicker\" name=\"start\" ng-model=\"model[options.key][\'start\']\" placeholder=\"{{to.placeholder.start}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;border:0;\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control show nslFormlyDatepicker\" name=\"end\" ng-model=\"model[options.key][\'end\']\" placeholder=\"{{to.placeholder.end}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"text\"></div></div>");
$templateCache.put("/src/templates/error.html","<formly-transclude></formly-transclude><div ng-messages=\"fc.$error\" ng-if=\"options.validation.errorExistsAndShouldBeVisible\" class=\"error-messages\"><div ng-message=\"{{ ::name }}\" ng-repeat=\"(name, message) in ::options.validation.messages\" class=\"message\">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div></div>");
$templateCache.put("/src/templates/fieldset.html","<fieldset><legend>{{to.label}} {{to.required ? \'*\' : \'\'}}</legend><formly-transclude></formly-transclude></fieldset>");
$templateCache.put("/src/templates/input.html","<div class=\"form-group\"><input class=\"form-control\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"{{to.disabled}}\" type=\"{{to.password ? \'password\' : (to.type ? to.type : \'text\')}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/label.html","<div class=\"form-group\"><label for=\"{{id}}\" class=\"control-label\"><span ng-bind-html=\"to.label\"></span> {{to.required ? \'*\' : \'\'}}</label><div><formly-transclude></formly-transclude></div><em id=\"{{id}}_description\" class=\"help-block\" ng-if=\"options.templateOptions.description\" style=\"opacity:0.6\">{{options.templateOptions.description}}</em></div>");
$templateCache.put("/src/templates/multiselect.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" multiple=\"multiple\" ng-options=\"option.value for option in to.options track by option.key\" nsl-select-watcher=\"\"></select>");
$templateCache.put("/src/templates/radio-inline.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio-inline\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/radio.html","<div class=\"radio-group\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio margin-right-20\"><label><input type=\"radio\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/repeat-section.html","<div><fieldset><legend>{{to.label}}</legend><div class=\"{{hideRepeat}}\"><div class=\"repeatsection\" ng-repeat=\"element in model[options.key]\" ng-init=\"fields = copyFields(to.fields)\"><formly-form fields=\"fields\" model=\"element\" form=\"form\"></formly-form><div style=\"margin-bottom:20px;\" class=\"{{to.removeBtn.className}}\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"removeItem($index)\"><span class=\"{{to.removeBtn.spanClassName}}\">{{to.removeBtn.text}}</span></button></div><hr></div><p class=\"AddNewButton\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNew()\">{{to.addBtnText}}</button></p></div></fieldset></div>");
$templateCache.put("/src/templates/search.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" data-text-field=\"to.textField\" data-text-fn=\"to.textFn\"></select>");
$templateCache.put("/src/templates/select.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"key as value for (key, value) in to.options\" nsl-select-watcher=\"\"></select>");
$templateCache.put("/src/templates/sortable-repeat-section.html","<div><fieldset><legend>{{to.label}}</legend><div class=\"{{hideRepeat}}\"><div class=\"sortable-container\" sv-root=\"\" sv-on-sort=\"\" sv-part=\"model[options.key]\"><div class=\"repeatsection\" ng-repeat=\"element in model[options.key]\" sv-element=\"opts\" ng-init=\"fields = copyFields(to.fields)\"><div class=\"input-group sortable-element\"><div class=\"btn-primary bg-primary input-group-addon\" sv-handle=\"\">{{$index + 1}}.</div><div><div class=\"panel panel-default\"><div class=\"panel-heading clearfix\" ng-show=\"{{to.panel.header.show}}\"><h4 class=\"panel-title pull-left\" style=\"padding-top: 7.5px;\"><span ng-show=\"{{to.panel.header.orderNum}}\" ng-bind-html=\"getPanelHeader($index)\"></span></h4><button type=\"button\" ng-click=\"element.open = !element.open\" class=\"btn btn-link pull-right\"><span class=\"glyphicon icon\" ng-class=\"{\'glyphicon-chevron-up\':element.open,\'glyphicon-chevron-down\':!element.open}\"></span></button></div><div class=\"panel-body\" ng-show=\"element.open || {{!to.panel.header.show}}\"><formly-form fields=\"fields\" model=\"element\" form=\"form\"></formly-form><div style=\"margin-bottom:20px;\" class=\"{{to.removeBtn.className}}\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"removeItem($index)\"><span class=\"{{to.removeBtn.spanClassName}}\">{{to.removeBtn.text}}</span></button></div></div></div></div></div></div></div><p class=\"AddNewButton\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNew()\">{{to.addBtnText}}</button></p></div></fieldset></div>");
$templateCache.put("/src/templates/spinner.html","<div class=\"form-group\"><input nsl-touchspin=\"\" class=\"form-control text-center\" type=\"text\" ng-model=\"model[options.key]\" data-min=\"to.data.min\" data-max=\"to.data.max\" data-step=\"to.data.step\" data-stepinterval=\"to.data.stepInterval\" data-decimals=\"to.data.decimals\" data-boost-at=\"to.data.boostAt\" data-max-boosted-step=\"to.data.maxBoostedStep\" data-prefix=\"to.data.prefix\" data-postfix=\"to.data.postfix\" data-vertical-buttoms=\"to.data.verticalButtons\"></div>");
$templateCache.put("/src/templates/static.html","<div class=\"form-group\"><p class=\"form-control-static\">{{model[options.key]}}</p></div>");
$templateCache.put("/src/templates/switch.html","<input type=\"checkbox\" class=\"js-switch\" ui-switch=\"\" ng-disabled=\"{{to.readOnly || to.disabled}}\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\">");
$templateCache.put("/src/templates/tags.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"option for option in to.options track by option\" data-tags=\"true\" multiple=\"multiple\"></select>");
$templateCache.put("/src/templates/textarea.html","<textarea class=\"form-control\" rows=\"{{options.templateOptions.rows? options.templateOptions.rows: \'5\'}}\" placeholder=\"{{options.templateOptions.placeholder}}\" ng-model=\"model[options.key]\"></textarea>");}]);