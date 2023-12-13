import { LightningElement } from 'lwc';
import createContactAndCase from '@salesforce/apex/CreateRecordFormController.createRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateRecord extends LightningElement {
    contactLastName;
    email;

    handleContactLastNameChange(event) {
        this.contactLastName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    createContactAndCase() {
        createContactAndCase({
            contactLastName: this.contactLastName,
            email: this.email,
            caseSubject: 'Subject for the Case' // Provide a subject for the Case
        })
            .then((result) => {
                this.handleSuccess(result);
                this.sendEmail(); //
                this.showSuccessToast();
                this.clearFields();
            })
            .catch((error) => {
                this.handleError(error);
            });
    }

    sendEmail() {
        
    }

    handleSuccess(result) {
    }

    showSuccessToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Contact and Case created successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    clearFields() {
        this.contactLastName = '';
        this.email = '';
    }
}