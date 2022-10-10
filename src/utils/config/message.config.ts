export const MESSAGE_CODE = {
  // TODO HTTP
  SUCCESS: 0,
  // TODO: USER
  EMAIL_EXIST: 1001,
  USERNAME_EXIST: 1002,
  USERNAME_NOT_FOUND: 1003,
  EMAIL_NOT_FOUND: 1004,
  PASSWORD_INCORRECT: 1005,
  USER_HAS_BEEN_: 1006,
  USER_LOGIN_FAILED: 1007,
  YOUR_IP_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN: 1008,
  YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN: 1009,
  THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE: 1010,
  YOUR_DEVICE_HAS_BEEN_: 1011,
  USER_HAVE_BEEN_LOGGED_OUT: 1012,
  PASSWORD_HAVE_BEEN_CHANGED: 1013,
  USER_UPDATE_FAILED: 1014,
  USER_CREATE_FAILED: 1015,
  USER_NOT_FOUND: 1016,
  USER_UPDATE_SUCCEEDED: 1017,
  INVALID_USER_APPELLATION: 1018,
  PHONE_NUMBER_NOT_FOUND: 1019,
  PHONE_NUMBER_EXIST: 1020,
  BANK_ACC_NOT_FOUND: 1021,
  REF_USER_NOT_FOUND: 1023,
  CAN_NOT_DEACTIVATE_YOURSELF: 1029,
  USER_EXCHANGE_ALREADY_EXIST: 1031,
  USER_EXCHANGE_NOT_FOUND: 1032,
  UUID_EXPIRED: 1033,
  // TODO: JWT
  JWT_GENERATE_ERROR: 1101,
  TOKEN_EXPIRED_OR_IS_UNAVAILABLE: 1102,
  TOKEN_EXPIRED: 1103,
  USER_ALREADY_LOGIN_EMAIL: 1104,
  USER_ALREADY_VERIFIED_EMAIL: 1105,
};

export const MESSAGE_TEXT = {
  [MESSAGE_CODE.SUCCESS]: `Success`,
  // TODO: USER
  [MESSAGE_CODE.EMAIL_EXIST]: `This email address is already`,
  [MESSAGE_CODE.USERNAME_EXIST]: `This username is already`,
  [MESSAGE_CODE.USERNAME_NOT_FOUND]: `Username not found`,
  [MESSAGE_CODE.EMAIL_NOT_FOUND]: `Email not found`,
  [MESSAGE_CODE.PASSWORD_INCORRECT]: `Password incorrect`,
  [MESSAGE_CODE.USER_HAS_BEEN_]: `User has been `,
  [MESSAGE_CODE.USER_LOGIN_FAILED]: `User login failed`,
  [MESSAGE_CODE.YOUR_IP_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN]: `Your ip is not allowed to get access token`,
  [MESSAGE_CODE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN]: `Your device is not allowed to get access token or you've been logged out`,
  [MESSAGE_CODE.YOUR_DEVICE_HAS_BEEN_]: `Your device is not allowed to get access token or you've been logged out`,
  [MESSAGE_CODE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE]:
    'The new password cannot be the same as the old one',
  [MESSAGE_CODE.USER_HAVE_BEEN_LOGGED_OUT]: `You have been logged out`,
  [MESSAGE_CODE.PASSWORD_HAVE_BEEN_CHANGED]: 'Password have been changed',
  [MESSAGE_CODE.USER_UPDATE_FAILED]: 'Update user info failed',
  [MESSAGE_CODE.USER_CREATE_FAILED]: 'Create user info failed',
  [MESSAGE_CODE.USER_NOT_FOUND]: 'User not found',
  [MESSAGE_CODE.USER_UPDATE_SUCCEEDED]: 'User update succeeded',
  [MESSAGE_CODE.INVALID_USER_APPELLATION]: 'Invalid user appellation',
  [MESSAGE_CODE.USER_ALREADY_VERIFIED_EMAIL]:
    'User already verified the email.',
  [MESSAGE_CODE.PHONE_NUMBER_NOT_FOUND]: 'Phone number not found',
  [MESSAGE_CODE.PHONE_NUMBER_EXIST]: 'Phone number is already exists',
  [MESSAGE_CODE.REF_USER_NOT_FOUND]: 'Referral phone number not found',
  [MESSAGE_CODE.CAN_NOT_DEACTIVATE_YOURSELF]: 'Can not deactivate yourself',
  [MESSAGE_CODE.USER_EXCHANGE_ALREADY_EXIST]: 'User exchange already exists',
  [MESSAGE_CODE.USER_EXCHANGE_NOT_FOUND]: 'User exchange not found',
  [MESSAGE_CODE.UUID_EXPIRED]: 'UUID expired',
  // TODO: JWT
  [MESSAGE_CODE.JWT_GENERATE_ERROR]:
    process.env.JWT_GENERATE_ERROR || `Can't generate token`,
  [MESSAGE_CODE.TOKEN_EXPIRED_OR_IS_UNAVAILABLE]:
    process.env.TOKEN_EXPIRED_OR_IS_UNAVAILABLE ||
    `Token has expired or is unavailable`,
  [MESSAGE_CODE.TOKEN_EXPIRED]:
    process.env.TOKEN_EXPIRED || `Token has expired`,
  [MESSAGE_CODE.USER_ALREADY_LOGIN_EMAIL]: `This user is already registered with the email, please login with the email and password.`,
};