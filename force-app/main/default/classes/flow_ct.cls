public with sharing class flow_ct {

    @AuraEnabled
    public static void updateCaseStatus(Id chatTranscriptId) {
        // Query the chat transcript record
        LiveChatTranscript chatTranscript = [
            SELECT Id, CaseId
            FROM LiveChatTranscript
            WHERE Id = :chatTranscriptId
            LIMIT 1
        ];

        // If chat transcript is associated with a case, update the case status to "In Progress"
        if (chatTranscript.CaseId != null) {
            Case chatCase = new Case(
                Id = chatTranscript.CaseId,
                Status = 'In-Progress'
            );
            update chatCase;
        }
    }
}