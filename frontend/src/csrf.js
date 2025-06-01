// src/csrf.js
export function getCSRFToken() {
  const name = 'csrftoken=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}
