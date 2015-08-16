angular.module('formlyEnnosol', ['formly'], function configFormlyEnnosol(formlyConfigProvider) {
    'use strict';

    // WRAPPERS
    formlyConfigProvider.setWrapper([
        {
            name: 'label',
            templateUrl: 'templates/label.html'
        }
    ]);

    // TYPES
    formlyConfigProvider.setType([
        {
            name: 'checkbox',
            templateUrl: 'templates/checkbox.html',
            wrapper: ['label']
        },
        {
            name: 'input',
            templateUrl: 'templates/input.html',
            wrapper: ['label']
        },
        {
            name: 'radio',
            templateUrl: 'templates/radio.html'
        },
        {
            name: 'range',
            templateUrl: 'templates/range.html'
        },
        {
            name: 'textarea',
            templateUrl: 'templates/textarea.html'
        },
        {
            name: 'toggle',
            templateUrl: 'templates/toggle.html'
        },
        {
            name: 'select',
            templateUrl: 'templates/select.html'
        }
    ]);

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