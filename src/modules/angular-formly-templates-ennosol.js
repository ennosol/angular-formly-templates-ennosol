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
        template: '<pre>{{options}}</pre><formly-form model="model[options.key]" fields="options.fieldGroup"></formly-form>'
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
