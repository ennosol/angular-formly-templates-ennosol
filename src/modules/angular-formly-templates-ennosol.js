angular.module('formlyEnnosol', ['formly'], function configFormlyEnnosol(formlyConfigProvider) {
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
});