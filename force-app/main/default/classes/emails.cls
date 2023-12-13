public with sharing class emails {
    @AuraEnabled(cacheable=true)
    public static List<EmailWrapper> getSentEmails(Id accountId) {
        List<Contact> relatedContacts = [SELECT Id FROM Contact WHERE AccountId = :accountId LIMIT 10];
        List<Case> relatedCases = [SELECT Id FROM Case WHERE AccountId = :accountId LIMIT 10];
        
        Set<Id> contactIds = new Set<Id>();
        Set<Id> caseIds = new Set<Id>();
        
        for (Contact contact : relatedContacts) {
            contactIds.add(contact.Id);
        }
        for (Case relatedCase : relatedCases) {
            caseIds.add(relatedCase.Id);
        }
        
        List<EmailMessage> emailMessages = new List<EmailMessage>();
        
        if (!contactIds.isEmpty() || !caseIds.isEmpty()) {
            emailMessages.addAll([SELECT Subject, TextBody, CreatedDate, RelatedToId, FromAddress
                                  FROM EmailMessage
                                  WHERE (RelatedToId IN :contactIds OR RelatedToId IN :caseIds)
                                  ORDER BY CreatedDate DESC LIMIT 10]);
        }
        
        Map<Id, String> contactIdToNameMap = new Map<Id, String>();
        Map<Id, String> caseIdToNameMap = new Map<Id, String>();
        
        // Populate Contact Name map
        List<Contact> contacts = [SELECT Id, Name FROM Contact WHERE Id IN :contactIds];
        for (Contact contact : contacts) {
            contactIdToNameMap.put(contact.Id, contact.Name);
        }
        
        // Populate Case Number map
        List<Case> cases = [SELECT Id, CaseNumber FROM Case WHERE Id IN :caseIds];
        for (Case relatedCase : cases) {
            caseIdToNameMap.put(relatedCase.Id, relatedCase.CaseNumber);
        }
        
        List<EmailWrapper> emailList = new List<EmailWrapper>();
        
        // Add emails related to Contacts or Cases with their respective names
        for (EmailMessage message : emailMessages) {
            String relatedToName = '';
            if (contactIdToNameMap.containsKey(message.RelatedToId)) {
                relatedToName = contactIdToNameMap.get(message.RelatedToId);
            } else if (caseIdToNameMap.containsKey(message.RelatedToId)) {
                relatedToName = caseIdToNameMap.get(message.RelatedToId);
            }
            
            emailList.add(new EmailWrapper(message, relatedToName, message.FromAddress));
        }

        return emailList;
    }

    public class EmailWrapper {
        @AuraEnabled
        public String subject { get; set; }
        @AuraEnabled
        public String textBody { get; set; }
        @AuraEnabled
        public DateTime createdDate { get; set; }
        @AuraEnabled
        public String relatedTo { get; set; }
        @AuraEnabled
        public String sender { get; set; } // Add sender field
        
        public EmailWrapper(EmailMessage message, String relatedToName, String senderEmail) {
            this.subject = message.Subject;
            this.textBody = message.TextBody;
            this.createdDate = message.CreatedDate;
            this.relatedTo = relatedToName;
            this.sender = senderEmail; // Set sender field
        }
    }
}