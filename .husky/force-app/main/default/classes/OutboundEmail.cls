global class OutboundEmail {
    public void sendEmailToLeadsCreatedToday() {
        EmailTemplate emailTemplate = [SELECT Id FROM EmailTemplate WHERE DeveloperName ='forleads'];
        
        List<Lead> leadsToday = [SELECT Id FROM Lead WHERE CreatedDate = TODAY];
        
        List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();
        
        for (Lead lead : leadsToday) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setTemplateId(emailTemplate.Id);
            email.setTargetObjectId(lead.Id);
            emailMessages.add(email);
        }
        
        Messaging.sendEmail(emailMessages);
    }
}