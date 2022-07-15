export default function (selectedLang = '', action) {
  if (action.type === 'changeLang') {
    return action.selectedLang
  } else {
    return selectedLang
  }
}
