const VERSION_NUMBER = '3.0.0';

// HEADERS
export const reqHeaders = {
  INDEX: 'fc17213512c8ad4719ca291335b19e5f35c694ef',
  SESSION_ID: 'bda8639dea42f85f388245dbadaa86dbc1411235',
  AUTH: 'b82a3f4babf1c80d75ece02a2f5bb2525225e11e',
};

// COOKIES
export const cookies = {
  MERCHANTID: '0a40d85ed57583470c3c9754f4f6c8bd9637d104',
  USERID: '6e9ee642d1f0568bb93e62d420e6b97896d040c4',
  SESSIONID: 'bda8639dea42f85f388245dbadaa86dbc1411235',
  NAME: 'a9d371451b6909ac85117130b9153a96499a362c',
  USERTYPE: 'eed00f35768e67d8dc5ef303d80e5d062ec6c7bf',
  ROUTECODE: 'b0c697853e52369ae4dae56ddd396ae9697cd9ce',
};

/**
 * ASSETS URL
 */
export const assetsUrl = '../../../assets/img/';
export const goodKreditLogo =
  'https://bustrackerv2.goodkredit.com/assets/uploads/img/gk_logo.svg';

/**
 * TODAY'S DATE
 */
export const currentDate = new Date();

/**
 * Regex for Number Pattern
 */
export const numberPattern = /^[0-9]*$/;
export const dateRegex =
  /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
