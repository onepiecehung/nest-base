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
  USER_NOT_COMPLETED_REGISTRATION: 1034,
  VERIFICATION_PASS_APP_FAILED: 1035,
  MERCHANT_UID_NOT_MATCH: 1036,
  PHONE_NUMBER_IS_ALREADY_VERIFY_PASS_APP: 1037,
  IMP_UID_USED: 1038,
  SESSION_FORGOT_PASSWORD_END: 1039,
  PASSWORD_NOT_SAME_OLD_PASSWORD: 1040,
  CANNOT_FOLLOW_UR_SELF: 1041,
  CANNOT_BLOCK_UR_SELF: 1042,
  CANNOT_SEND_MESSAGE_TO_UR_SELF: 1043,
  NOT_HAVE_RELATIONSHIP: 1044,
  HAVE_BEEN_BLOCK_OR_BLOCKED: 1045,
  USER_ID_REQUIRED: 1046,

  // TODO: JWT
  JWT_GENERATE_ERROR: 1101,
  TOKEN_EXPIRED_OR_IS_UNAVAILABLE: 1102,
  TOKEN_EXPIRED: 1103,
  USER_ALREADY_LOGIN_EMAIL: 1104,
  USER_ALREADY_VERIFIED_EMAIL: 1105,

  // TODO: File
  FILE_NOT_FOUND: 1200,
  FILE_IS_REQUIRED: 1201,

  // TODO: Pet
  PET_NOT_FOUND: 1300,
  PET_MEDICAL_NOT_FOUND: 1301,
  PET_MEDICAL_REPLY_NOT_FOUND: 1302,
  PET_DISEASE_ICON_NOT_FOUND: 1303,

  // TODO: Post
  POST_NOT_FOUND: 1400,
  CANNOT_REPORT_UR_POST: 1401,
  POST_REPORT_NOT_FOUND: 1402,

  // TODO: Cmt
  CMT_NOT_FOUND: 1500,
  CMT_P_NOT_FOUND: 1501,

  // TODO: Permission
  PERMISSION_DENIED: 1600,

  // TODO: Product
  PRODUCT_NOT_FOUND: 1700,

  // TODO: Product review
  PRODUCT_REVIEW_NOT_FOUND: 1800,
  PRODUCT_REVIEW_ALREADY_EXISTS: 1801,

  // TODO: Room
  ROOM_NOT_FOUND: 1900,

  // TODO:Date
  DATE_TOO_LONG: 2000,

  // TODO: Banner
  BANNER_NOT_FOUND: 2100,
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
  [MESSAGE_CODE.USER_NOT_COMPLETED_REGISTRATION]:
    'User has not completed registration',
  [MESSAGE_CODE.VERIFICATION_PASS_APP_FAILED]: `Verification PassApp failed`,
  [MESSAGE_CODE.MERCHANT_UID_NOT_MATCH]: `merchantUid bot belongs to impUid`,
  [MESSAGE_CODE.PHONE_NUMBER_IS_ALREADY_VERIFY_PASS_APP]: `Phone number is already verified on the PassApp`,
  [MESSAGE_CODE.IMP_UID_USED]: `impUid is already used`,
  [MESSAGE_CODE.SESSION_FORGOT_PASSWORD_END]: `Forgot password session has ended or expired`,
  [MESSAGE_CODE.PASSWORD_NOT_SAME_OLD_PASSWORD]: `Password must not be the same as the old password`,
  [MESSAGE_CODE.CANNOT_FOLLOW_UR_SELF]: `You can't follow yourself`,
  [MESSAGE_CODE.CANNOT_BLOCK_UR_SELF]: `You can't block yourself`,
  [MESSAGE_CODE.CANNOT_SEND_MESSAGE_TO_UR_SELF]: `You cannot send messages to yourself`,
  [MESSAGE_CODE.NOT_HAVE_RELATIONSHIP]: `You are not having a relationship with this user (following, follower)`,
  [MESSAGE_CODE.HAVE_BEEN_BLOCK_OR_BLOCKED]: `You have been blocked by this user or you have blocked this user`,
  [MESSAGE_CODE.USER_ID_REQUIRED]: `User ID is required`,

  // TODO: JWT
  [MESSAGE_CODE.JWT_GENERATE_ERROR]:
    process.env.JWT_GENERATE_ERROR || `Can't generate token`,
  [MESSAGE_CODE.TOKEN_EXPIRED_OR_IS_UNAVAILABLE]:
    process.env.TOKEN_EXPIRED_OR_IS_UNAVAILABLE ||
    `Token has expired or is unavailable`,
  [MESSAGE_CODE.TOKEN_EXPIRED]:
    process.env.TOKEN_EXPIRED || `Token has expired`,
  [MESSAGE_CODE.USER_ALREADY_LOGIN_EMAIL]: `This user is already registered with the email, please login with the email and password.`,

  // TODO: File
  [MESSAGE_CODE.FILE_NOT_FOUND]: `File not found`,
  [MESSAGE_CODE.FILE_IS_REQUIRED]: `Field files are required`,

  // TODO: Pet
  [MESSAGE_CODE.PET_NOT_FOUND]: `Pet not found`,
  [MESSAGE_CODE.PET_MEDICAL_NOT_FOUND]: `Pet medical not found`,
  [MESSAGE_CODE.PET_MEDICAL_REPLY_NOT_FOUND]: `Medical reply not found`,
  [MESSAGE_CODE.PET_DISEASE_ICON_NOT_FOUND]: `Disease icon not found`,

  // TODO: POST
  [MESSAGE_CODE.POST_NOT_FOUND]: `Post not found`,
  [MESSAGE_CODE.CANNOT_REPORT_UR_POST]: `You cannot report your post`,
  [MESSAGE_CODE.POST_REPORT_NOT_FOUND]: `Post report not found`,

  // TODO: CMT
  [MESSAGE_CODE.CMT_NOT_FOUND]: `Comment not found`,
  [MESSAGE_CODE.CMT_P_NOT_FOUND]: `Comment parent not found`,

  // TODO: Permission
  [MESSAGE_CODE.PERMISSION_DENIED]: `Permission denied`,

  // TODO: Product
  [MESSAGE_CODE.PRODUCT_NOT_FOUND]: `Product not found`,

  // TODO: Product review
  [MESSAGE_CODE.PRODUCT_REVIEW_NOT_FOUND]: `Product review not found`,
  [MESSAGE_CODE.PRODUCT_REVIEW_ALREADY_EXISTS]: `Product review already exists`,

  // TODO: Room
  [MESSAGE_CODE.ROOM_NOT_FOUND]: `Room not found`,

  // TODO: DATE
  [MESSAGE_CODE.DATE_TOO_LONG]: `Date range is too long`,

  // TODO: Banner
  [MESSAGE_CODE.BANNER_NOT_FOUND]: `Banner not found`,
};
