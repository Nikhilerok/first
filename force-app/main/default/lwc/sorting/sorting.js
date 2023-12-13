import { LightningElement, track } from 'lwc';
import getContactss from '@salesforce/apex/ContactController.getContactss';

export default class Sorting extends LightningElement {
    @track data = [];
    @track columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true },
        { label: 'Email', fieldName: 'Email', type: 'email', sortable: true }
    ];
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy = 'Name';
    @track searchTerm = '';
    @track pageNumber = 1;
    @track totalPages = 1;
    @track dataToDisplay = [];
    @track totalRecords = 0;
    @track pageSizeOptions = [ 10, 25, 50, 75, 100];
    @track pageSize = 10; // Set your desired page size
    @track selectedColumns = ['Name']; // Set "Name" as the default selected column

    get bDisableFirst() {
        return this.pageNumber === 1;
    }

    get bDisableLast() {
        return this.pageNumber === this.totalPages;
    }

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        getContactss({ pageNumber: this.pageNumber, pageSize: this.pageSize, searchTerm: this.searchTerm })
            .then(result => {
                this.data = result.map(contact => ({
                    id: contact.Id,
                    Name: contact.Name,
                    Phone: contact.Phone,
                    Email: contact.Email
                }));
                this.calculateTotalPages();
            })
            
            .catch(error => {
                console.error('Error fetching contacts: ', error);
            });
    }

get options() {
        return [
            { label: 'Name', value: 'Name' },
            { label: 'Phone', value: 'Phone' },
            { label: 'Email', value: 'Email' },
        ];
    }

    handleDualListboxChange(event) {
        this.selectedColumns = event.detail.value;
        this.loadDataTable(); // Reload the data table with selected fields
    }

    loadDataTable() {
        // Construct columns dynamically based on selectedColumns
        this.tableColumns = this.columns.filter(column =>
            this.selectedColumns.includes(column.fieldName)
        );
        // Load the data based on selectedColumns
        this.loadData();
    }
    calculateTotalPages() {
        this.totalRecords = this.data.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateDataToDisplay();
    }

    updateDataToDisplay() {
        const startIndex = (this.pageNumber - 1) * this.pageSize;
        this.dataToDisplay = this.data.slice(startIndex, startIndex + this.pageSize);
    }

    onHandleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;
        this.sortData(fieldName, sortDirection);
    }

    sortData(field, direction) {
        const isReverse = direction === 'desc' ? -1 : 1;
        this.data.sort((a, b) => {
            return isReverse * ((a[field] > b[field]) - (b[field] > a[field]));
        });
        this.updateDataToDisplay();
    }

    handleRecordsPerPage(event) {
        this.pageSize = parseInt(event.target.value, 10);
        this.pageNumber = 1;
        this.calculateTotalPages();
    }

    previousPage() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.updateDataToDisplay();
        }
    }

    nextPage() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.updateDataToDisplay();
        }
    }

    firstPage() {
        this.pageNumber = 1;
        this.updateDataToDisplay();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.updateDataToDisplay();
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.pageNumber = 1;
        this.loadData();
    }

    clearSearch() {
        this.searchTerm = ''; // Clear the search term
        this.pageNumber = 1; // Reset pagination to the first page
        this.loadData(); // Load data without the search term
    }
    
}