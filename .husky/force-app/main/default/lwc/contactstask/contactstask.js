// contactstask.js
import { LightningElement, wire, track } from 'lwc';
import getContactss from '@salesforce/apex/ContactController.getContactss';

const columns = [
    { label: 'Name', fieldName: 'Name', sortable: true,
    cellAttributes: { alignment: 'left' } },
    
    // Add sortable attribute to each column
    { label: 'Email', fieldName: 'Email', sortable: true , 
    cellAttributes: { alignment: 'left' }},
    

    { label: 'Phone', fieldName: 'Phone',  sortable: true,
    cellAttributes: { alignment: 'left' }}
];

export default class Contactstask extends LightningElement {
    @track pageNumber = 1;
    @track pageSize = 10;
    @track contacts = [];
    @track searchTerm = '';
    @track sortBy = 'Name'; // Default sorting by Name
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy = 'Name'; // Default sorting column   pageNumber handleSearchTermChange

    @wire(getContactss, { pageNumber: '$pageNumber', pageSize: '$pageSize', searchTerm: '$searchTerm', sortBy: '$sortBy', sortDirection: '$sortDirection' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data.map((contact) => ({
                Id: contact.Id,
                Name: contact.Name,
                Email: contact.Email,
                Phone: contact.Phone
            }));
        } else if (error) { 
            // Handle error gracefully  
            console.error('Error fetching contacts:', error);
        }
    }

    handleSort(event) {
        const fieldName = event.detail.fieldName;
        if (fieldName === this.sortBy) {
            // If the same field is clicked again, reverse the sorting direction
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = fieldName;
            this.sortDirection = 'asc';
        }
        // Trigger a new wire call with the updated sorting parameters
        this.pageNumber = 1; // Reset pagination to the first page
    }
    
  



    handleNext() {
        this.pageNumber++;
    }

    handlePrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }

    handleSearch() {
        // Trigger a new wire call with the updated searchTerm
        this.pageNumber = 1; // Reset pagination to the first page
    }

    clearSearch() {
        this.searchTerm = '';
        this.pageNumber = 1; // Reset pagination to the first page
    }

}