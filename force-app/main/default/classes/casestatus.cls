@RestResource(urlMapping='/casestatus/*')
global with sharing class casestatus {
    @HttpGet
    global static String casestatus() {
        String caseId = RestContext.request.params.get('caseId');
        String newStatus = RestContext.request.params.get('status');

        try {
            Case caseRecord = [SELECT Id FROM Case WHERE Id = :caseId];
            caseRecord.Status = newStatus;
            update caseRecord;
            return 'Case status updated to ' + newStatus + '.';
        } catch (Exception e) {
            return 'Error updating Case status: ' + e.getMessage();
        }
    }
}