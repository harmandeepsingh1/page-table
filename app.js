var pageTableApp = angular.module("page-table", []);
pageTableApp.filter('startFrom', function() {
	return function(input, start) {
		if(input){
			return input.slice(parseInt(start, 10));
		}
		return [];
	}
});
pageTableApp.directive("pageTable", function(filterFilter, orderByFilter){
	return{
		scope:{
			list: "=",
			search: "=",
			headers: "=",
			selfheaders: "=",
			sno: "=",
			pageRange: "=",
			clickCb: "&",
			initialSort: "@"
		},
		link: function(scope, elements, attribute){
			scope.filteredList = null;
			scope.currentPage = 0;
			scope.numberOfItemsPerPage = scope.pageRange?scope.pageRange[0]:9999999;
			scope.numberOfPages = 0;
			scope.orderByVariableBefore = scope.initialSort?scope.initialSort:scope.headers[0];
			scope.orderByDsc = true;
			scope.setPageNumber = function(pageNumber){
				scope.currentPage = pageNumber-1;
			}
			scope.range = function(){
				var a = [];
				for(var i = 1; i<=scope.numberOfPages; i++)
					a.push(i);
				return a;
			};
			scope.decrementPage = function(){
				if(scope.currentPage>0)
					scope.currentPage--;
			}
			scope.incrementPage = function(){
				if(scope.currentPage<scope.numberOfPages-1)
					scope.currentPage++;
			}
			scope.initialize = function(){
				$timeout(function() {
					scope.numberOfPages = Math.ceil(scope.list.length/scope.numberOfItemsPerPage);
				}, 0);
			};
			scope.clickCbWrapper = function(row, head){
				if(attribute.clickCb===undefined)
					return;
				scope.clickCb()(row, head);
			}
			scope.setActive = function(n){
				if(n-1==scope.currentPage)
					return "active";
				return "";
			}
			scope.$watch('list', function(term){
				scope.numberOfPages = Math.ceil(scope.list.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			}, true);
			scope.$watch('search', function(term){
				scope.filteredList = (filterFilter(scope.list, term));
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('pageRange', function(term){
				scope.numberOfItemsPerPage = scope.pageRange?scope.pageRange[0]:9999999;
				scope.currentPage = 0;
			}, true);
			scope.$watch('numberOfItemsPerPage', function(term){
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('orderByVariableBefore', function(term){
				scope.orderByVariable = "\u0022"+scope.orderByVariableBefore+"\u0022";
			});
		},
		template: [
			'<div ng-show="filteredList.length" style="width:100%;">',
				'<div style="padding-bottom:1cm;" ng-show="pageRange">',
					'<div style="float:left;">',
						'<label>No. of items per page:</label>',
						'<select class = "form-control" ng-model="numberOfItemsPerPage" style="width:250px">',
							'<option ng-repeat = "val in pageRange" value = {{val}}>{{val}}</option>',
						'</select>',
					'</div>',
					'<ul class= "pagination" style="width:60%;margin:0 auto;padding-left: 2cm;">',
						'<li><a href="#" ng-click="decrementPage()">&laquo;</a></li>',
						'<li ng-repeat="n in range()" ng-class="setActive(n)">',
							'<a href="#" ng-click="setPageNumber(n)">{{n}}</a>',
						'</li>',
						'<li><a href="#" ng-click="incrementPage()">&raquo;</a></li>',
					'</ul>',
				'</div>',
				'<table class="table table-condensed">',
					'<tr ng-hide = "selfheaders.length" ng-click="orderByDsc=!orderByDsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in headers" ng-click="$parent.orderByVariableBefore=attribute">{{attribute}}</th>',
					'<tr>',
					'<tr ng-show = "selfheaders.length"  ng-click="orderByDsc=!orderByDsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in selfheaders"  ng-click="$parent.orderByVariableBefore=headers[$index]">{{attribute}}</th>',
					'<tr>',
					'<tr ng-repeat = "person in filteredList | orderBy: orderByVariable: orderByDsc | startFrom: (currentPage*numberOfItemsPerPage) | limitTo:numberOfItemsPerPage">',
						'<td ng-show="sno">{{$index+1+currentPage*numberOfItemsPerPage}}</td>',
						'<td ng-repeat="attribute in headers" ng-click="clickCbWrapper(person, attribute)">{{person[attribute]}}</td>',
					'</tr>',
				'</table>',
			'<div>'
		].join('')
	}
});
