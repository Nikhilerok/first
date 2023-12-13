import { LightningElement } from 'lwc';
 
const data = [
    { id: 1, name: 'Alex Mike', age: 29, email: 'alexmike@w3web.net' },
    { id: 2, name: 'Tina Roy', age: 38, email: 'tinaroy@w3web.net' },
    { id: 3, name: 'Michael Jackson', age: 20, email: 'michaelJackson@w3web.net' },
    { id: 4, name: 'Madan Mohan', age: 18, email: 'madanmohan@w3web.net',},
    { id: 5, name: 'Suresh Mehta', age: 27, email: 'sureshmehta@w3web.net',},
    { id: 6, name: 'Madhusudan Roy', age: 35, email: 'madhusudanroy@w3web.net',},
    { id: 7, name: 'Vijay Kumar', age: 39, email: 'vijaykumar@w3web.net',},
    { id: 8, name: 'Dharmendra Kapoor', age: 21, email: 'dharmendrakapoor@w3web.net',},
];
 
const columns = [
    { label: 'Name', fieldName: 'name',type: 'text',
    sortable: true,
    cellAttributes: { alignment: 'left' }, },
    {
        label: 'Age',
        fieldName: 'age',
        type: 'number',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
    { label: 'Email', fieldName: 'email', type: 'email' ,
    sortable: true,
    cellAttributes: { alignment: 'left' },},
];
 
export default class lwcDatatableSortableColm extends LightningElement {
    data = data;
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
 
    // Used to sort the 'Age' column
    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };
 
        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
 
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];
 
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}