import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import sendEmailToCase from '@salesforce/apex/emailsender.sendEmailToCase';
import sendEmailToContact from '@salesforce/apex/emailsender.sendEmailToContact';

export default class CreateRecordComponent extends LightningElement {
  @track name = '';
  @track email = '';
  @track contact = {}; // Define contact at a higher scope

  handleNameChange(event) {
    this.name = event.target.value;
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  async createRecords() {
  try {
    // Create an Account record
    const accountInput = { Name: this.name };
    const account = await createRecord({ apiName: 'Account', fields: accountInput });

    // Create a Contact record
    const contactInput = {
      LastName: this.name,
      Email: this.email,
      AccountId: account.id
    };

    this.contact = await createRecord({ apiName: 'Contact', fields: contactInput });
    const templateIdContact = '00X5g000000yrQKEAY'; 

    // Create a Case record
    const caseInput = {
      Subject: `New Case of ${this.name}`,
      Description: `Hello ${this.name}`,
      SuppliedEmail: this.email,
      AccountId: account.id // Pass the Account Id to associate the Case with the Account
    };

    const createdCase = await createRecord({ apiName: 'Case', fields: caseInput });
    const templateIdCase = '00X5g000000yrQPEAY'; 

    // Send emails using Apex
    // Call the Apex methods to send emails and create EmailMessage records
    await sendEmailToContact({
      contactId: this.contact.id,
      templateId: templateIdContact,
      caseId: null // Pass null for caseId when sending from Contact
    });

    await sendEmailToCase({
      caseId: createdCase.id, // Pass the caseId when sending from Case
      templateId: templateIdCase,
    });

    // Reset the input fields
    this.name = '';
    this.email = '';

    // Provide feedback or handle other actions if needed
  } catch (error) {
    console.error('Error creating records and sending emails:', error);
    // Handle the error appropriately, e.g., show an error message to the user
    }
  }
}