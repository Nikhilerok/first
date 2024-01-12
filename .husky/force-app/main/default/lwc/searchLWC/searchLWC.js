import { LightningElement, track } from 'lwc';
import searchObjects from '@salesforce/apex/searchlwc.searchObjects';
import searchRecords from '@salesforce/apex/searchlwc.searchRecords';

export default class SearchLWC extends LightningElement {
    @track searchTerm = '';
    @track objectList;
    @track selectedObject;
    @track recordList;
    @track searchText = '';

    handleObjectSearch(event) {
        this.searchTerm = event.target.value;
        if (!this.searchTerm) {
            this.objectList = null; // Reset objectList when search term is empty
            return;
        }
        searchObjects({ searchText: this.searchTerm })
            .then((result) => {
                this.objectList = result;
            })
            .catch((error) => {
                console.error('Error retrieving objects:', error);
            });
    }

    handleObjectSelection(event) {
        event.preventDefault();
        this.selectedObject = event.target.dataset.object;
        this.searchTerm = this.selectedObject;
        this.recordList = null;
        this.objectList = null; // Reset objectList to null when an object is selected
    }

    handleRecordSearch(event) {
        this.searchText = event.target.value;
        if (!this.searchText) {
            this.recordList = null;
        } else {
            this.searchRecords();
        }
    }

    searchRecords() {
        if (!this.selectedObject || !this.searchText) {
            this.recordList = null;
            return;
        }

        searchRecords({ selectedObject: this.selectedObject, searchText: this.searchText })
            .then((result) => {
                this.recordList = result.map((record) => {
                    return {
                        ...record,
                        RecordURL: '/' + record.Id
                    };
                });
            })
            .catch((error) => {
                console.error('Error retrieving records:', error);
            });
    }
}