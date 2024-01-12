// datatable1.js
import { LightningElement, wire, track } from 'lwc';
import getleavesummary from '@salesforce/apex/datatablecontroller.mycases';

import PaginationComponent from 'c/pagination';

const PAGE_SIZE = 10;

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber', type: 'text', sortable: true, cellAttributes: { alignment: 'center' } },
    { label: 'Status', fieldName: 'Status', type: 'text', sortable: true, cellAttributes: { alignment: 'center' } },
    { label: 'Subject', fieldName: 'Subject', sortable: true, cellAttributes: { alignment: 'center' } },
];

export default class Datatable1 extends LightningElement {
    columns = columns;
    error;

    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy = '';

    @wire(getleavesummary)
    cases;

    @track currentPage = 1;
    @track disableFirst = true;
    @track disableLast = false;
    @track totalRecords = 0;

    get pageNumber() {
        return this.currentPage;
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / PAGE_SIZE);
    }

    get pagedData() {
        const start = (this.currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return this.cases.data ? this.cases.data.slice(start, end) : [];
    }

    handlePrevious() {
        this.currentPage -= 1;
        this.updatePaginationButtons();
    }

    handleNext() {
        this.currentPage += 1;
        this.updatePaginationButtons();
    }

    updatePaginationButtons() {
        this.disableFirst = this.currentPage === 1;
        this.disableLast = this.currentPage * PAGE_SIZE >= (this.cases.data ? this.cases.data.length : 0);
    }

    onHandleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;
        this.sortData(fieldName, sortDirection);
    }

    sortData(field, direction) {
        const isReverse = direction === 'desc' ? -1 : 1;
        this.cases.data = [...this.cases.data].sort((a, b) => {
            return isReverse * ((a[field] > b[field]) - (b[field] > a[field]));
        });
    }
}