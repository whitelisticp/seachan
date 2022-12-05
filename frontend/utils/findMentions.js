export function findMentions(string, boardAbbreviation) {
    var mentions = []
    var quotePattern = /(>>[0-9]+)/g; // >>0 line starts with double >> and a number
    var stringMatch = string.match(quotePattern)
    if (stringMatch?.length > 0) { mentions.push.apply(mentions, stringMatch) }
    mentions = mentions.map(i => i.replace('>>', ''))
    return mentions
}