export function downloadExport(content, fileName) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(
      JSON.stringify(content, function (key, value) {
        if (
          typeof value === "bigint" ||
          key === "ownerPrincipal" ||
          key === "principal"
        ) {
          return value.toString()
        } else if (key === "reporterPrincipals") {
          var convertedReporterPrincipals = []
          var reporterPrincipals = value
          reporterPrincipals.forEach((reporterPrincipal) => {
            convertedReporterPrincipals.push(reporterPrincipal.toString())
          })
          return convertedReporterPrincipals
        } else {
          return value
        }
      }),
    )
  var dlAnchorElem = document.getElementById("downloadAnchorElem")
  dlAnchorElem.setAttribute("href", dataStr)
  dlAnchorElem.setAttribute("download", fileName)
  dlAnchorElem.click()
}
