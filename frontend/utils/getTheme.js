export function getTheme() {
    const theme = localStorage.getItem('theme') || "dark";
    localStorage.setItem('theme',theme);
    return theme
}