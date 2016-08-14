angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2', 'angular-cron-jobs'], ['formlyConfigProvider', function configFormlyEnnosol(formlyConfigProvider) {
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
        template: '<formly-form model="model[options.key]" fields="options.fieldGroup"></formly-form>'
    }, {
        name: 'button',
        templateUrl: '/src/templates/button.html'
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
        name: 'time',
        templateUrl: '/src/templates/time.html',
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
        name: 'img',
        templateUrl: '/src/templates/img.html',
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
    }, {
        name: 'cron',
        templateUrl: '/src/templates/cron.html',
        wrapper: ['label']
    }]);
}]);

angular.module('formlyEnnosol')
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

angular.module('formlyEnnosol')
    .controller('RepeatSectionController', ['$scope', '$timeout', function($scope, $timeout) {
        var unique = 1;
        var uniqueFieldsArray = [];

        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.removeItem = removeItem;
        $scope.copyFields = copyFields;
        $scope.getPanelHeader = getPanelHeader;
        $scope.getSelectValue = getSelectValue;

        function copyFields(fields) {
            // Pointer to templateoptions fields
            $scope.toFields = fields;

            // ng-repeat creates own scope for every repeat-item.
            // This watch will refresh all sub-scopes when the main $scope.fields changed
            $scope.$watch('toFields', function() {
                angular.forEach(uniqueFieldsArray, function(fields) {
                    angular.merge(fields, $scope.toFields);
                });
            }, true);

            var uniqueFields = angular.copy($scope.toFields);
            addRandomIds(uniqueFields);
            uniqueFieldsArray.push(uniqueFields);

            return uniqueFields;
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

        function getPanelHeader(idx) {
            var params = [];
            var dottedValue;

            //console.log('$scope.options.templateOptions', $scope.options.templateOptions);
            angular.forEach($scope.options.templateOptions.panel.header.captionFields, function(field, index) {
                // Call custom function
                if (field.substr(0, 1) === '@') {
                    // Replace variables
                    field = field.replace("$idx", idx);

                    // Call function
                    params.push($scope.$eval(field.substr(1)));
                // Get model value by dot-format key
                } else {
                    dottedValue = getValueByDottedKey($scope.model[$scope.options.key][idx], field);
                    if (typeof dottedValue !== 'undefined') {
                        params.push(dottedValue);
                    }
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

        function getSelectValue(fieldIdx, idx) {
            var options = $scope.options.templateOptions.fields[fieldIdx].templateOptions.options;
            var keyName = $scope.options.templateOptions.fields[fieldIdx].key;
            var keyValue = getValueByDottedKey($scope.model[$scope.options.key][idx], keyName);

            return options[keyValue] || '';
        }

        function getValueByDottedKey(o, s) {
            if (typeof s !== 'undefined') {
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
            }

            return o;
        }
    }]);

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

angular.module("formlyEnnosol").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/addons.html","<div ng-class=\"{\'input-group\': to.addonLeft || to.addonRight}\"><div class=\"input-group-addon {{to.addonLeft.bgClassName}}\" ng-if=\"to.addonLeft\" ng-style=\"{cursor: to.addonLeft.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonLeft.onClick(options, this)\"><i class=\"{{to.addonLeft.className}}\" ng-if=\"to.addonLeft.className\"></i> <span ng-if=\"to.addonLeft.text\" ng-bind-html=\"to.addonLeft.text\"></span></div><formly-transclude></formly-transclude><div class=\"input-group-addon {{to.addonRight.bgClassName}}\" ng-if=\"to.addonRight\" ng-style=\"{cursor: to.addonRight.onClick ? \'pointer\' : \'inherit\'}\" ng-click=\"to.addonRight.onClick(options, this)\"><i class=\"{{to.addonRight.className}}\" ng-if=\"to.addonRight.className\"></i> <span ng-if=\"to.addonRight.text\" ng-bind-html=\"to.addonRight.text\"></span></div></div>");
$templateCache.put("/src/templates/button.html","<div class=\"form-group\" ng-hide=\"to.hide\"><button type=\"button\" title=\"{{to.title}}\" ng-class=\"to.className\" ng-disabled=\"to.disabled\" ng-click=\"to.click(id)\" id=\"{{id}}\" ng-bind-html=\"to.text\"></button></div>");
$templateCache.put("/src/templates/checkbox.html","<div class=\"checkbox clip-check check-primary\" ng-hide=\"to.hide\"><input type=\"checkbox\" ng-disabled=\"to.readOnly || to.disabled\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\"> <label for=\"{{id}}-chk\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label></div>");
$templateCache.put("/src/templates/coordinate.html","<div class=\"input-group\" ng-hide=\"to.hide\"><input class=\"form-control text-center\" id=\"{{id}}_lat\" name=\"{{id}}_lat\" ng-model=\"model[options.key][\'lat\']\" placeholder=\"{{to.placeholder.lat}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;border-right:0;border-left:0;min-height:34px;{{to.separator.style}}\" ng-click=\"to.separator.click(id)\" title=\"{{to.separator.title}}\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control text-center\" id=\"{{id}}_lng\" name=\"{{id}}_lng\" ng-model=\"model[options.key][\'lng\']\" placeholder=\"{{to.placeholder.lng}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" type=\"text\"></div>");
$templateCache.put("/src/templates/cron.html","<div ng-hide=\"to.hide\"><cron-selection class=\"nslFormlyCron\" output=\"cronOutput\" config=\"to.cronConfig\" init=\"to.initData\" ng-disabled=\"to.readOnly || to.disabled\" ng-model=\"model[options.key]\"></cron-selection></div>");
$templateCache.put("/src/templates/date.html","<div class=\"form-group\" ng-hide=\"to.hide\"><input type=\"text\" class=\"form-control show text-center nslFormlyDatepicker\" placeholder=\"{{to.placeholder}}\" data-provide=\"{{to.readOnly || to.disabled ? \'\' : \'datepicker\'}}\" ng-model=\"model[options.key]\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\" data-date-start-view=\"{{to.datepicker.startView}}\" data-date-min-view-mode=\"{{to.datepicker.minViewMode}}\" data-date-max-view-mode=\"{{to.datepicker.maxViewMode}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/daterange.html","<div class=\"form-group\" ng-hide=\"to.hide\"><div class=\"input-daterange input-group\" data-provide=\"datepicker\" data-date-format=\"{{to.datepicker.format || \'yyyy-mm-dd\'}}\" data-date-language=\"{{to.datepicker.language}}\" data-date-weekstart=\"{{to.datepicker.weekStart}}\"><input class=\"form-control show nslFormlyDatepicker\" name=\"start\" ng-model=\"model[options.key][\'start\']\" placeholder=\"{{to.placeholder.start}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" type=\"text\"> <span class=\"input-group-addon {{to.separator.bgClassName}}\" style=\"min-width:38px;min-height:34px;\"><i class=\"{{to.separator.className}}\" ng-if=\"to.separator.className\"></i> <span ng-if=\"to.separator.text\">{{to.separator.text}}</span></span> <input class=\"form-control show nslFormlyDatepicker\" name=\"end\" ng-model=\"model[options.key][\'end\']\" placeholder=\"{{to.placeholder.end}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" type=\"text\"></div></div>");
$templateCache.put("/src/templates/error.html","<div nsl-error=\"\" class=\"validation-tooltip-container\" ng-if=\"options.validation.errorExistsAndShouldBeVisible\"><div class=\"validation-tooltip-pos\"><div ng-messages=\"fc.$error\" class=\"validation-tooltip-message message error-messages\"><div ng-message=\"{{ ::name }}\" ng-repeat=\"(name, message) in ::options.validation.messages\" class=\"message\">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div></div><div class=\"validation-tooltip-triangle\"></div></div></div><formly-transclude></formly-transclude>");
$templateCache.put("/src/templates/fieldset.html","<fieldset><legend>{{to.label}} {{to.required ? \'*\' : \'\'}}</legend><formly-transclude></formly-transclude></fieldset>");
$templateCache.put("/src/templates/img.html","<div class=\"form-group\" ng-hide=\"to.hide\"><img ng-src=\"{{model[options.key]}}\" style=\"{{to.style}}\"></div>");
$templateCache.put("/src/templates/input.html","<div class=\"form-group\" ng-hide=\"to.hide\"><input class=\"form-control\" ng-model=\"model[options.key]\" placeholder=\"{{to.placeholder}}\" ng-readonly=\"{{to.readOnly}}\" ng-disabled=\"to.disabled\" type=\"{{to.password ? \'password\' : (to.type ? to.type : \'text\')}}\"> <span class=\"{{to.feedback.className}} form-control-feedback\">{{to.feedback.text}}</span></div>");
$templateCache.put("/src/templates/label.html","<div class=\"form-group\" ng-hide=\"to.hide\"><label for=\"{{id}}\" class=\"control-label\" ng-show=\"to.label\"><span ng-bind-html=\"to.label\"></span> <span ng-if=\"to.required\" class=\"required-field\">*</span></label><div><formly-transclude></formly-transclude></div><em id=\"{{id}}_description\" class=\"help-block\" ng-if=\"options.templateOptions.description\" style=\"opacity:0.6\">{{options.templateOptions.description}}</em></div>");
$templateCache.put("/src/templates/multiselect.html","<div ng-hide=\"to.hide\"><select ts-select2=\"to.config\" ng-change=\"to.ngChange()\" ng-model=\"model[options.key]\" multiple=\"multiple\"><option value=\"{{key}}\" ng-repeat=\"(key, value) in to.options\">{{value | translate}}</option></select></div>");
$templateCache.put("/src/templates/radio-inline.html","<div class=\"radio-group\" ng-hide=\"to.hide\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio-inline\"><label><input type=\"radio\" ng-disabled=\"to.disabled\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/radio.html","<div class=\"radio-group\" ng-hide=\"to.hide\"><div ng-repeat=\"(key, option) in to.options\" class=\"radio margin-right-20\"><label><input type=\"radio\" ng-disabled=\"to.readOnly || to.disabled\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'id\']\" ng-model=\"model[options.key]\">{{option[to.labelProp || \'text\']}}</label></div></div>");
$templateCache.put("/src/templates/repeat-section.html","<div ng-hide=\"to.hide\"><fieldset><legend>{{to.label}}</legend><div class=\"{{hideRepeat}}\"><div class=\"repeatsection\" ng-repeat=\"element in model[options.key]\" ng-init=\"fields = copyFields(to.fields)\"><formly-form fields=\"fields\" model=\"element\" form=\"form\"></formly-form><div style=\"margin-bottom:20px;\" class=\"{{to.removeBtn.className}}\"><button type=\"button\" title=\"{{to.removeBtn.title}}\" class=\"btn btn-danger btn-o\" ng-click=\"removeItem($index)\"><span class=\"{{to.removeBtn.spanClassName}}\"></span>{{to.removeBtn.text}}</button></div><hr></div><p><button ng-repeat=\"button in to.buttons\" type=\"button\" ng-class=\"button.className\" ng-click=\"button.click($event)\" ng-bind-html=\"button.text\" title=\"{{button.title}}\" class=\"btn\"></button></p></div></fieldset></div>");
$templateCache.put("/src/templates/search.html","<select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-hide=\"to.hide\" data-text-field=\"to.textField\" data-text-fn=\"to.textFn\"></select>");
$templateCache.put("/src/templates/select.html","<div ng-hide=\"to.hide\"><select ts-select2=\"to.config\" ng-change=\"to.ngChange()\" ng-model=\"model[options.key]\" ng-options=\"key as value | translate for (key, value) in to.options\"></select></div>");
$templateCache.put("/src/templates/sortable-repeat-section.html","<div ng-hide=\"to.hide\"><fieldset><legend>{{to.label}}</legend><div class=\"{{hideRepeat}}\"><div class=\"sortable-container\" sv-root=\"\" sv-on-sort=\"\" sv-part=\"model[options.key]\"><div class=\"repeatsection\" ng-repeat=\"element in model[options.key]\" sv-element=\"opts\" ng-init=\"fields = copyFields(to.fields)\"><div class=\"input-group sortable-element\"><div class=\"input-group-addon {{to.handler.className}}\" sv-handle=\"\">{{$index + 1}}.</div><div><div class=\"panel panel-default\"><div class=\"panel-heading clearfix\" ng-show=\"{{to.panel.header.show}}\"><h4 class=\"panel-title pull-left\" style=\"padding-top: 7.5px;\"><span ng-show=\"{{to.panel.header.orderNum}}\" ng-bind-html=\"getPanelHeader($index)\"></span></h4><button type=\"button\" ng-click=\"element.open = !element.open\" class=\"btn btn-link pull-right\"><span class=\"glyphicon icon\" ng-class=\"{\'glyphicon-chevron-up\':element.open,\'glyphicon-chevron-down\':!element.open}\"></span></button></div><div class=\"panel-body\" ng-show=\"element.open || {{!to.panel.header.show}}\"><formly-form fields=\"fields\" model=\"element\" form=\"form\"></formly-form><div style=\"margin-bottom:20px;\" class=\"{{to.removeBtn.className}}\"><button type=\"button\" title=\"{{to.removeBtn.title}}\" class=\"btn btn-danger btn-o\" ng-click=\"removeItem($index)\"><span class=\"{{to.removeBtn.spanClassName}}\"></span>{{to.removeBtn.text}}</button></div></div></div></div></div></div></div><p><button ng-repeat=\"button in to.buttons\" type=\"button\" ng-class=\"button.className\" ng-click=\"button.click($event)\" ng-bind-html=\"button.text\" title=\"{{button.title}}\" class=\"btn\"></button></p></div></fieldset></div>");
$templateCache.put("/src/templates/spinner.html","<div class=\"form-group\" ng-hide=\"to.hide\"><input nsl-touchspin=\"\" class=\"form-control text-center\" type=\"text\" ng-model=\"model[options.key]\" data-min=\"to.data.min\" data-max=\"to.data.max\" data-step=\"to.data.step\" data-stepinterval=\"to.data.stepInterval\" data-decimals=\"to.data.decimals\" data-boost-at=\"to.data.boostAt\" data-max-boosted-step=\"to.data.maxBoostedStep\" data-prefix=\"to.data.prefix\" data-postfix=\"to.data.postfix\" data-vertical-buttoms=\"to.data.verticalButtons\"></div>");
$templateCache.put("/src/templates/static.html","<div class=\"form-group\" ng-hide=\"to.hide\"><p class=\"form-control-static\">{{model[options.key]}}</p></div>");
$templateCache.put("/src/templates/switch.html","<input type=\"checkbox\" class=\"js-switch\" ui-switch=\"\" ng-disabled=\"to.readOnly || to.disabled\" ng-hide=\"to.hide\" id=\"{{id}}-chk\" ng-model=\"model[options.key]\">");
$templateCache.put("/src/templates/tags.html","<div ng-hide=\"to.hide\"><select ts-select2=\"to.config\" ng-model=\"model[options.key]\" ng-options=\"option for option in to.options track by option\" data-tags=\"true\" multiple=\"multiple\"></select></div>");
$templateCache.put("/src/templates/textarea.html","<textarea class=\"form-control\" rows=\"{{options.templateOptions.rows? options.templateOptions.rows: \'5\'}}\" placeholder=\"{{options.templateOptions.placeholder}}\" ng-disabled=\"to.disabled\" ng-hide=\"to.hide\" ng-model=\"model[options.key]\"></textarea>");
$templateCache.put("/src/templates/time.html","<div class=\"form-group\" ng-hide=\"to.hide\"><div class=\"input-group clockpicker nslFormlyTimepicker\"><input type=\"text\" class=\"form-control\" value=\"08:00\" ng-model=\"model[options.key]\" ng-disabled=\"to.disabled\"> <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-time\"></span></span></div></div>");}]);