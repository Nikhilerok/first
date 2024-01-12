import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpportunities from '@salesforce/apex/opportunitiescontroller.getOpportunities';

const columns = [
    { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
];

export default class Opportunities extends LightningElement {
    opportunities;
    columns = columns;
    showLoadingSpinner = true;

    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        this.showLoadingSpinner = false; // Hide the loading spinner once data is fetched
        if (data) {
            this.opportunities = data;
        } else if (error) {
            this.opportunities = undefined; // Set opportunities to undefined on error to handle gracefully
        }
    }

    refreshData() {
        this.showLoadingSpinner = true; // Show the loading spinner when refreshing data
        return refreshApex(this.opportunities);
    }
}