export function getCondensedPrincipal(principal) {
    if (principal.length > 10) {
        return principal.split("-")[0] + "..." + principal.split("-").at(-1);
    }
    else {
        return principal;
    }
}