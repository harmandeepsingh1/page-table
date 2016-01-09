var app = angular.module("pageApp", []);
app.controller("pageCtrl", ["$scope", "$timeout",function($scope, $timeout){
	$scope.userList = [];
	$scope.headers = ["0-4", "age"];
	$scope.selfheaders = ["0-4", "Age"];
	$scope.pageRange = [10, 50, 100, 200];
	$scope.generateArray = function(){
		for(var i = 0; i<100; i++){
			var temp = {};
			//$scope.userList.push({name: "Harman"+i, age: Math.floor(Math.random()*100+1)});
			for(var j = 0; j<$scope.headers.length; j++)
				temp[$scope.headers[j]] = Math.floor(Math.random()*100+1);
			$scope.userList.push(temp);
		}
	}
	$scope.passedFunction = function(param, index){
		alert(JSON.stringify(param)+ " "+ index);
		//alert("Passed Function");
	};
}]);
app.filter('startFrom', function() {
	return function(input, start) {
		if(input){
			return input.slice(parseInt(start, 10));
		}
		return [];
	}
});
app.directive("pageTable", function(filterFilter, orderByFilter){
	return{
		scope:{
			list: "=",
			search: "=",
			headers: "=",
			selfheaders: "=",
			sno: "=",
			pageRange: "=",
			clickCb: "&"
		},
		link: function(scope, elements, attribute){
			scope.filteredList = null;
			scope.currentPage = 0;
			scope.numberOfItemsPerPage = 10;
			scope.numberOfPages = 10;
			scope.orderByVariable = scope.headers[0];
			scope.orderByAsc = false;
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
				scope.clickCb()(row, head);
			}
			scope.$watch('list', function(term){
				scope.numberOfPages = Math.ceil(scope.list.length/scope.numberOfItemsPerPage);
			}, true);
			scope.$watch('search', function(term){
				scope.filteredList = (filterFilter(scope.list, term));
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('numberOfItemsPerPage', function(term){
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('orderByVariable2', function(term){
				scope.orderByVariable = "\u0022"+scope.orderByVariable2+"\u0022";
			});
		},
		template: [
			//'<button ng-click = "myclick()">Click for checking</button>',
			'<div ng-show="filteredList.length" style="width:100%;">',
				'<select ng-model="numberOfItemsPerPage" >',
					'<option ng-repeat = "val in pageRange" value = {{val}}>{{val}}</option>',
				'</select>',
				'<div style="width:60%;margin:0 auto;">',
					'<ul class= "pagination">',
						'<li><a href="#" ng-click="decrementPage()">&laquo;</a></li>',
						'<li ng-repeat="n in range()">',
							'<a href="#" ng-click="setPageNumber(n)">{{n}}</a>',
						'</li>',
						'<li><a href="#" ng-click="incrementPage()">&raquo;</a></li>',
					'</ul>',
				'</div>',
				'<table class="table table-condensed">',
					'<tr ng-hide = "selfheaders.length" ng-click="orderByAsc=!orderByAsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in headers" ng-click="$parent.orderByVariable2=attribute">{{attribute}}</th>',
					'<tr>',
					'<tr ng-show = "selfheaders.length"  ng-click="orderByAsc=!orderByAsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in selfheaders"  ng-click="$parent.orderByVariable2=headers[$index]">{{attribute}}</th>',
					'<tr>',
					'<tr ng-repeat = "person in filteredList | orderBy: orderByVariable: orderByAsc | startFrom: (currentPage*numberOfItemsPerPage) | limitTo:numberOfItemsPerPage">',
						'<td ng-show="sno">{{$index+1+currentPage*numberOfItemsPerPage}}</td>',
						'<td ng-repeat="attribute in headers" ng-click="clickCbWrapper(person, attribute)">{{person[attribute]}}</td>',
					'</tr>',
				'</table>',
			'<div>'
		].join('')
	}
});