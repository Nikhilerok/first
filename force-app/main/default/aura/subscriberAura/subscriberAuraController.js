({
    handleLMSMessage : function(component, message) {
      
        component.set("v.accountIDFromLMS",message.getParam("AccountId"));
        component.set("v.AdditionalInfo",message.getParam("AdditonalInfo"));
    }
})