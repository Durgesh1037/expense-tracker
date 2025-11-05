// Utility to get a cookie value by name
// export function getCookieToken(tokenName: string): string | null {
//   if (typeof document === "undefined") return null;

//   // Escape special regex characters in tokenName (for safety)
//   const safeTokenName = tokenName.replace(/([.*+?^${}()|\[\]\\])/g, "\\$1");

//   const regex = new RegExp(`(?:^|; )${safeTokenName}=([^;]*)`);
//   const match = document.cookie.match(regex);
//   console.log(document.cookie);

//   return match ? decodeURIComponent(match[1]) : null;
// }

export function setCookie(
  data: { [key: string]: string },
  expiresIn = 18000000
): void {
  const date = new Date();
  date.setTime(new Date().getTime() + expiresIn * 1000);
  const expires = `expires=${date.toUTCString()}`;
  Object.keys(data).forEach((key) => {
    const value = data[key];
    document.cookie = `${key}=${value};${expires};path=/;`;
  });
}

export function getCookieToken(cookieName: string): string {
  const decodedCookie = decodeURIComponent(document.cookie);
  console.log("decodeCookie",document.cookie);

  const cookie = decodedCookie
    .split(";")
    .filter((cookieString) => cookieString.indexOf("=") >= 0)
    .map((cookieString) => cookieString.split("="))
    .find((cookieParts) => cookieParts[0].trim() === cookieName);

  return cookie! && cookie[1];
}

// Utility to remove a cookie by name (sets expiry in the past)
export function removeCookieToken(tokenName: string): void {
	if (typeof document === 'undefined') return;
	document.cookie = `${tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
