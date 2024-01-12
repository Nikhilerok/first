public class CreateRecordFormController {
    @AuraEnabled
    public static void createRecords(String contactFirstName, String contactLastName, String caseSubject, String email) {
        // Create Contact 
        Contact newContact = new Contact();
        newContact.FirstName = contactFirstName;
        newContact.LastName = contactLastName;
        newContact.Email = email;
        insert newContact;

        // Create Case 
        Case newCase = new Case();
        newCase.ContactId = newContact.Id;
        newCase.Status = 'Pending';
        newCase.Subject = caseSubject; // Set the Case Subject
        insert newCase;

        // Get Case Number
        String caseNumber = [SELECT CaseNumber FROM Case WHERE Id = :newCase.Id].CaseNumber;

        // Render the email template and pass Case information
        Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
        emailMessage.setTemplateId('00X5g000000yn0cEAA');
        emailMessage.setTargetObjectId(newContact.Id);
        emailMessage.setSaveAsActivity(false);

        String emailBody = 'Click the link below to set the Case status to In-Progress:\n';
        emailBody += '<a href="https://techbook2-dev-ed.my.site.com/services/apexrest/casestatus?caseId=' + newCase.Id + '&status=In-Progress">Update Case Status</a>';

        emailMessage.setPlainTextBody(emailBody);
        emailMessage.setHtmlBody(emailBody);

        // Send email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { emailMessage });
    }
}