import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class DualListboxSelected extends LightningElement {
    @track options = [
        { label: 'Name', value: 'Name' },
        { label: 'Phone', value: 'Phone' },
        { label: 'Email', value: 'Email' }
    ];
    @track selectedFields = ['Name'];
    @track tableData = [];
    @track error; 

    @wire(getContacts, { pageNumber: 1, pageSize: 10, searchTerm: '' })
    contactsData({ error, data }) {
        if (data) {
            this.tableData = data;
            this.error = null; // Clear any previous errors
        } else if (error) {
            this.error = error; // Set the error message
            this.tableData = []; // Clear the data  tableColumns
        }
    }

    handleFieldSelection(event) {
        this.selectedFields = event.detail.value;
    }

    get tableColumns() {
        return this.selectedFields.map((field) => {
            return {
                label: field,
                fieldName: field,
                type: field === 'Email' ? 'email' : 'text',
            };
        });
    }
}