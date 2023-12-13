import { LightningElement, track } from 'lwc';
import searchCases from '@salesforce/apex/searchlwcobject.searchCases';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
    { label: 'Subject', fieldName: 'Subject', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Priority', fieldName: 'Priority', type: 'text' }
];

export default class CaseSearch extends LightningElement {
    @track searchText = '';
    @track cases;
    @track error;

    columns = columns;

    handleSearchTextChange(event) {
        this.searchText = event.target.value;
    }

    searchCases() {
        if (this.searchText) {
            searchCasesApex({ searchText: this.searchText })
                .then((result) => {
                    this.cases = result;
                    this.error = null;
                })
                .catch((error) => {
                    this.cases = null;
                    this.error = 'Error retrieving cases: ' + error.body.message;
                });
        } else {
            this.cases = null;
            this.error = null;
        }
    }
}