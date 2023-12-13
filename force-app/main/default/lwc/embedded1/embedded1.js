import BaseChatMessage from 'lightningsnapin/baseChatMessage';
    import { track } from 'lwc';
    
    const CHAT_CONTENT_CLASS = 'chat-content';
    const AGENT_USER_TYPE = 'agent';
    const CHASITOR_USER_TYPE = 'chasitor';
    const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];
    
    /**
     * Displays a chat message that replaces links with custom text.
     */
    export default class Embedded1 extends BaseChatMessage {
        @track messageStyle = '';
        @track text = '';
    
        isSupportedUserType(userType) {
            return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
        }
    
        connectedCallback() {
            if (this.isSupportedUserType(this.userType)) {
                // Set our messageStyle class to decorate the message based on the user.
                this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;
                
                // Create a temporary element to strip out markup from the message.
                let element = document.createElement("div");
                element.innerHTML = this.messageContent.value;
                
                // Replace links with shortened versions.
                // Specific URLs can be specially handled in the anonymous function.
                // URL regex adapated from: https://github.com/component/regexps/blob/master/index.js#L3
                this.text = element.innerText
                    .replace( // innerText or textContent
                        /(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?/g,
                        function(imgUrl) {
                            // Only switch out to specific shortened urls if the agent is the user.
                            if(this.userType === AGENT_USER_TYPE) {
                                // If the url is a specific link, then return a custom shortened link.
                                if(imgUrl === "https://www.test.com/specificLink" || imgUrl === "https://www.test.com/anotherSpecificLink") {
                                    return `<a target="_blank" href="${imgUrl}">View Link</a>`;
                                }
                                // Otherwise just shorten to a generic link "View Article".
                                return `<a target="_blank" href="${imgUrl}">View Article</a>`;
                            }
                            return imgUrl;
                        }.bind(this)
                    );
            } else {
                throw new Error(`Unsupported user type passed in: ${this.userType}`);
            }
        }
    }