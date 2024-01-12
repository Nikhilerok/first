({
    handleInit: function(component, event, helper) {
        var caseId = component.get("v.caseId");
        if (caseId) {  
            // Trigger the Apex method to update the Case status
            var action = component.get("c.createRecord");
            action.setParams({ caseId: caseId });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    // Handle the success response, if needed
                    console.log('Case status updated successfully');
                } else if (state === "ERROR") {
                    // Handle the error response, if needed
                    var errors = response.getError();
                    console.error('Error updating Case status:', errors);
                }
            });
            $A.enqueueAction(action);
        }
    }
})