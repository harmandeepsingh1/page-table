# page-table
A angular.js module for creating client side pagination

## How to use:-
1. Include the app.js file in the html.  
2. In your module add the dependency as `page-table`.  
3. Create a tag `<page-table></page-table>` which can have the following attributes:-  
  1. `list`: mandatory: Provide your array of dicts to this attribute
  2. `headers`: mandatory: List of headers(same as keys from the list) in the order in which you want to display the table columns.
  3. `selfheaders`: optional: List of headers(can be different from the list), if provided, will be displayed inplace of the headers list
  4. `search`: optional: A scope variable which will act as a search text in the `ng-filter`.
  5. `sno`: optional: If marked as true, then the table will contain the S. No. column.
  6. `page-range`: optional: List of numbers, each will be added to a dropdown for user to select the number of items to visible in one page.
  7. `click-cb`: optional: If provided, will call the provided function, with first parameter as the clicked object(from the list provided) and second one as the key which was clicked(from the headers list).

