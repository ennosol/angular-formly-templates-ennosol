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
