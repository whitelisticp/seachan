import { compareValues } from "./compareValues"
import { isAdmin } from "./isAdmin"

export async function getThreads(actor, abbreviation, sortDesc, sortBy, user) {
  var threads = await actor.listThreads(abbreviation)
  var threadsFiltered = threads.filter(
    (thread) => thread.hidden == false || isAdmin(user),
  )

  var stickiesSorted = threadsFiltered
    .filter((thread) => thread.stickied == true)
    .sort(compareValues("timeStamp", "asc"))
  var nonStickiesSorted = threadsFiltered
    .filter((thread) => thread.stickied == false)
    .sort(compareValues(sortBy, sortDesc))
  return stickiesSorted.concat(nonStickiesSorted)
}
