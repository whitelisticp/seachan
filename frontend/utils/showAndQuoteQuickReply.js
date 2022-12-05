export function showAndQuoteQuickReply(postId, minimizeQuickReplyForm, setMinimizeQuickReplyForm) {
    var quickreply = document.getElementById("quickreply")
    quickreply.classList.remove("hidden");
    if (minimizeQuickReplyForm) {
        setMinimizeQuickReplyForm(false)
    }
    var textarea = document.getElementById("quickreply-textarea")
    textarea.value += '>>' + postId + '\n';
    textarea.focus()
}