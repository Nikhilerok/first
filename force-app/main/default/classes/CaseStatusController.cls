public class CaseStatusController {
    public String objectId { get; set; }
    public String responseCode { get; set; }

    public CaseStatusController() {
        objectId = ApexPages.currentPage().getParameters().get('ObjectId');
        responseCode = ApexPages.currentPage().getParameters().get('ResponseCode');
    }

    public PageReference initPage() {
        List<Case> casesToUpdate = [SELECT Id, Status FROM Case WHERE Id = :objectId LIMIT 1];
        if (!casesToUpdate.isEmpty()) {
            casesToUpdate[0].Status = 'In-Progress';
            update casesToUpdate[0];
        }
        // Redirect to a thank you page or another appropriate page (optional)
        // return Page.ThankYouPage; // Replace 'ThankYouPage' with the name of your thank you page
        return null;
    }
}