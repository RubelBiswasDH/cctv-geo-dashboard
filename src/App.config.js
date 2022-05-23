// export const BASE_URL = 'http://192.168.161.4:8192'
export const BASE_URL = 'http://hr.bmapsbd.com'

// Auth Configs
export const AUTH = {
  REGISTER_API: `${BASE_URL}/api/register`,
  LOGIN_API: `${BASE_URL}/api/login`,
  GET_USER_API: `${BASE_URL}/api/auth/user`
}

// API Endpoints
export const API = {
  GET_ALL_TASKS: `${BASE_URL}/api/v1/get-all-task`,
  GET_ALL_SND: `${BASE_URL}/api/v1/snd`,
  GET_TASK_TIMELINE: `${BASE_URL}/api/v1/get-task-update-by-task/`,
  UPDATE_TASK: `${BASE_URL}/api/v1/update-task/`,
  GET_ALL_TASK_UPDATES: `${BASE_URL}/api/v1/get-all-task-update`,
  GET_QUERY_CATEGORIES: `${BASE_URL}/api/v1/get-query-categories`,
  GET_ANALYTICS: `${BASE_URL}/api/v1/get-statistics-dms`,
  SEND_TASK_CLICK_COUNT: `${BASE_URL}/api/v1/dms-open-task/`,
  REVERSEGEO: `https://barikoi.xyz/v1/api/search/reverse/Mjg5MTpGMDNaTU1HTjZU/geocode`,
  DELETE_TASK: `${BASE_URL}/api/v1/delete-task/`,
  
  GET_ALL_ATTENDANCE: `${BASE_URL}/api/get-attendance/`,
  GET_ALL_ANNOUNCEMENT: `${BASE_URL}/api/get-announcement/`,
  CREATE_USER: `${BASE_URL}/api/create-user`,
  CREATE_BULK_USER: `${BASE_URL}/api/create-bulk-user`,
  GET_USER_PROFILE: `${BASE_URL}/api/get-user-profile/`,
  SET_USER_PROFILE: `${BASE_URL}/api/set-user-profile/`,
  INVALID_LATE_ATTENDANCE: `${BASE_URL}/api/invalid-late-attendance/`,
  GET_USER: `${BASE_URL}/api/get-user/`,
  GET_USERS: `${BASE_URL}/api/get-users/`,
  GET_COMPANY_SETTINGS:  `${BASE_URL}/api/company-settings/`,
  SET_COMPANY_SETTINGS:  `${BASE_URL}/api/update-company-settings/`,
  SET_WORKING_DAYS: `${BASE_URL}/`,
  SET_LATE_TIME: `${BASE_URL}/`,
  SEND_ANNOUNCEMENT: `${BASE_URL}/api/send-announcement-dashboard`,
  AUTOCOMPLETE: 'https://api.bmapsbd.com/search/autocomplete/web?search=',

}

// SOCKET configs
export const SOCKET = {
  API_KEY: 'a1975a97bf741bbb1002',
  CLUSTER: 'ap1',
  WS_HOST: 'socket.bmapsbd.com',
  WS_PORT: 8005,
  AUTH_ENDPOINT: `${BASE_URL}/broadcasting/auth`,
  DMS_TASK_CHANNEL: 'private-user-notification',
  DMS_TASK_CREATE_EVENT: 'task-created',
  DMS_TASK_UPDATE_EVENT: 'task-updated',
  DMS_TASK_ASSIGN_EVENT: 'task-assigned',  
}

export const SOCKET_A = {
  PUSHER_APP_KEY: "a1975a97bf741bbb1005",
  PUSHER_APP_CLUSTER:'ap1',
  WS_HOST: 'socket.bmapsbd.com',
  WS_PORT: 8005,
  AUTH_ENDPOINT: `${BASE_URL}/broadcasting/auth`,

  CHANNEL: "private-user-notification.",

  ATTENDANCE_EVENT: 'user-attendance',
  ANNOUNCEMENT_EVENT: "user-announcement",
  PUSHER_APP_ID:1005,
  PUSHER_APP_SECRET: "7cfe0b6f0c4adbcd1005",
 
}


// Map Configs
export const MAP = {
  ACCESS_TOKEN: 'Mjg5MTpGMDNaTU1HTjZU',
  STYLES: [
    {
      title: 'Bangla',
      uri:'https://geoserver.bmapsbd.com/styles/barikoi-custom-bangla/style.json?key=Mjg5MTpGMDNaTU1HTjZU'
    },
    {
      title: 'Light',
      uri:'https://map.barikoi.com/styles/osm-liberty/style.json?key=Mjg5MTpGMDNaTU1HTjZU'
    },
    {
      title: 'Dark',
      uri:'https://map.barikoi.com/styles/barikoi-dark/style.json?key=Mjg5MTpGMDNaTU1HTjZU'
    }
  ],
}