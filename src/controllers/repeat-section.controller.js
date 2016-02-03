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
