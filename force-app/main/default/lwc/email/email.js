import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Email extends LightningElement {
    caseId;

    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        this.caseId = urlParams.get('caseId');
    }

    @wire(getRecord, { recordId: '$caseId', fields: ['Case.Status'] })
    caseRecord;

    updateCaseStatus() {
        const newStatus = 'In-Progress'; // Set the desired status here
        const url = `/services/apexrest/updateCaseStatus?caseId=${this.caseId}&status=${newStatus}`;

        // Make an HTTPS request to update the Case status
        fetch(url, { method: 'GET' })
        .then((response) => response.text())
        .then((result) => {
            // Handle the response and display success/error message
            this.showToastMessage('Success', result, 'success');
        })
        .catch((error) => {
            this.showToastMessage('Error', error, 'error');
        });
    }

    showToastMessage(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }
}