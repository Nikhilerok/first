global class EmailService implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();

        try {
            Case newCase = new Case();
            newCase.Subject = email.subject;
            newCase.Description = email.plaintextbody;
            
            insert newCase;

            if (email.binaryAttachments != null && email.binaryAttachments.size() > 0) {
                List<Attachment> att = new List<Attachment>();
                for (Integer i = 0; i < email.binaryAttachments.size(); i++) {
                    Attachment attachment = new Attachment();
                    attachment.ParentId = newCase.Id;
                    attachment.Name = email.binaryAttachments[i].filename;
                    attachment.Body = email.binaryAttachments[i].body;
                    att.add(attachment);
                }
                insert att;
            }
            
            result.success = true;
        } catch (Exception e) {
            result.success = false;
            result.message = 'An error occurred: ' + e.getMessage();
        }
        
        return result;
    }
}