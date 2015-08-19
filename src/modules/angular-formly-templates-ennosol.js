angular.module('formlyEnnosol', ['formly', 'NgSwitchery'], function configFormlyEnnosol(formlyConfigProvider) {
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
        name: 'search',
        templateUrl: '/src/templates/search.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'select',
        templateUrl: '/src/templates/select.html',
        wrapper: ['addons', 'label']
    }]);
})

// select2 wrapper
.directive('formlyEnnosolSelect', function($compile) {
    return {
        scope: {
            sourceUrl: '@',
            minInputLength: '@',
            multiple: '@',
            placeholder: '@',
            templateResult: '=',
            processResults: '=',
            templateSelection: '=',
            escapeMarkup: '=',
            dataFn: '='
        },
        link: function(scope, element, attrs) {

            attrs.$observe('sourceUrl', function() {
                scope.update();
            });

            scope.setup = function() {
                return {
                    ajax: {
                        url: scope.sourceUrl,
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return scope.dataFn(params);
                        },
                        processResults: function(data, page) {
                            return scope.processResults(data, page);
                        },
                        cache: true
                    },
                    escapeMarkup: function(markup) {
                        return scope.escapeMarkup(markup) || markup;
                    },
                    minimumInputLength: scope.minInputLength || 1,
                    templateResult: function(data) {
                        return scope.templateResult(data);
                    },
                    templateSelection: function(data) {
                        return scope.templateSelection(data);
                    },
                    placeholder: scope.placeholder
                };
            };

            scope.update = function() {
                var sel = angular.element('<select id="' + attrs.id + '_select2" class="select2 form-control" ' + (scope.multiple ? ' multiple="multiple"' : '') + '></select>');
                element.append(sel);
                $compile(sel)(scope);

                $('#' + attrs.id + '_select2').select2(scope.setup());
            };
        }
    };
});
