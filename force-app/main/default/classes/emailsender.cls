public with sharing class emailsender {
    // Method to send an email using a template from a Case and create an EmailMessage record
    @AuraEnabled
    public static void sendEmailToCase(Id caseId, Id templateId) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTargetObjectId(caseId); // Set the target Case
        email.setTemplateId(templateId); // Set the email template Id
        email.setSaveAsActivity(true); // Set to true to save the email as an activity

        // Debug log
        System.debug('Sending email from case with ID: ' + caseId + ', Template ID: ' + templateId);

        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
    }
    
    // Method to send an email using a template from a Contact and create an EmailMessage record
    @AuraEnabled
    public static void sendEmailToContact(Id contactId, Id templateId) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTargetObjectId(contactId); // Set the target Contact
        email.setTemplateId(templateId); // Set the email template Id
        email.setSaveAsActivity(true); // Set to true to save the email as an activity

        // Debug log
        System.debug('Sending email from contact with ID: ' + contactId + ', Template ID: ' + templateId);

        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
    }
}