angular.module('formlyEnnosol', ['formly'], ["formlyConfigProvider", function configFormlyEnnosol(formlyConfigProvider) {
    'use strict';

    // WRAPPERS
    formlyConfigProvider.setWrapper([{
        name: 'label',
        templateUrl: 'templates/label.html'/*,
        apiCheck: function(check) {
            return ({
                templateOptions: {
                    label: check.string,
                    required: check.bool.optional
                }
            });
        }*/
    }]);

    // TYPES
    formlyConfigProvider.setType({
        name: 'checkbox',
        templateUrl: 'templates/checkbox.html'
    });
    formlyConfigProvider.setType({
        name: 'input',
        templateUrl: 'templates/input.html',
        wrapper: ['label']
    });
    formlyConfigProvider.setType({
        name: 'radio',
        templateUrl: 'templates/radio.html'
    });
    formlyConfigProvider.setType({
        name: 'range',
        templateUrl: 'templates/range.html'
    });
    formlyConfigProvider.setType({
        name: 'textarea',
        templateUrl: 'templates/textarea.html'
    });
    formlyConfigProvider.setType({
        name: 'toggle',
        templateUrl: 'templates/toggle.html'
    });
    formlyConfigProvider.setType({
        name: 'select',
        templateUrl: 'templates/select.html'
    });

    // MISC
    formlyConfigProvider.templateManipulators.preWrapper.push(function ariaDescribedBy(template, options, scope) {
        if (options.templateOptions && angular.isDefined(options.templateOptions.description) &&
            options.type !== 'radio' && options.type !== 'checkbox') {
            var el = angular.element('<a></a>');
            el.append(template);
            var modelEls = angular.element(el[0].querySelectorAll('[ng-model]'));
            if (modelEls) {
                el.append(
                    '<p id="' + scope.id + '_description"' +
                    'class="help-block"' +
                    'ng-if="options.templateOptions.description">' +
                    '{{options.templateOptions.description}}' +
                    '</p>'
                );
                modelEls.attr('aria-describedby', scope.id + '_description');
                return el.html();
            } else {
                return template;
            }
        } else {
            return template;
        }
    });
}]);
angular.module("formlyEnnosol").run(["$templateCache", function($templateCache) {$templateCache.put("templates/checkbox.html","<ion-checkbox ng-model=\"model[options.key]\">{{options.templateOptions.label}}</ion-checkbox>");
$templateCache.put("templates/input.html","<input class=\"form-control\" ng-model=\"model[options.key]\" type=\"{{options.templateOptions.type}}\" placeholder=\"{{options.templateOptions.placeholder}}\">");
$templateCache.put("templates/label.html","<div><label for=\"{{id}}\" class=\"control-label\" ng-if=\"to.label\">{{to.label}} {{to.required ? \'*\' : \'\'}}</label><formly-transclude></formly-transclude></div>");
$templateCache.put("templates/radio.html","<ion-radio ng-repeat=\"item in options.templateOptions.options\" icon=\"{{item.icon? item.icon: \'ion-checkmark\'}}\" ng-value=\"item.value\" ng-model=\"model[options.key]\">{{ item.text }}</ion-radio>");
$templateCache.put("templates/range.html","<div class=\"item range\" ng-class=\"\'range-\' + options.templateOptions.rangeClass\"><span>{{options.templateOptions.label}}</span> <i class=\"icon\" ng-if=\"options.templateOptions.minIcon\" ng-class=\"options.templateOptions.minIcon\"></i> <input type=\"range\" min=\"{{options.templateOptions.min}}\" max=\"{{options.templateOptions.max}}\" step=\"{{options.templateOptions.step}}\" value=\"{{options.templateOptions.value}}\" ng-model=\"model[options.key]\"> <i class=\"icon\" ng-if=\"options.templateOptions.maxIcon\" ng-class=\"options.templateOptions.maxIcon\"></i></div>");
$templateCache.put("templates/select.html","<label class=\"item item-input item-select\"><div class=\"input-label\">{{to.label}}</div><select ng-model=\"model[options.key]\" ng-options=\"option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options\"></select></label>");
$templateCache.put("templates/textarea.html","<label class=\"item item-input\"><textarea rows=\"{{options.templateOptions.rows? options.templateOptions.rows: \'5\'}}\" placeholder=\"{{options.templateOptions.placeholder}}\" ng-model=\"model[options.key]\"></textarea></label>");
$templateCache.put("templates/toggle.html","<ion-toggle ng-model=\"model[options.key]\" toggle-class=\"toggle-{{options.templateOptions.toggleClass}}\">{{options.templateOptions.label}}</ion-toggle>");}]);