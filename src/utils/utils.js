import dayjs from 'dayjs'
import axios from 'axios'
import { API } from '../App.config'


export const getReverseGeoAddress = (params) => {  
  // Get Auth Token
  // const token = getAuthToken()
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9oci5ibWFwc2JkLmNvbVwvYXBpXC9sb2dpbiIsImlhdCI6MTY1NjMxNDg3MywiZXhwIjoxNjU3NTI0NDczLCJuYmYiOjE2NTYzMTQ4NzMsImp0aSI6IjFBT1BiMDRtNzhzc2RNbm0iLCJzdWIiOjIwLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.sGoYTMvPeOUNHnQjsYsklnoS39FL-OfdA6p-fLx0CxI"
  return axios.get(API.REVERSEGEO, { headers: { Authorization: `Bearer ${token}` }, params })      
      .then(res => {
          return res.data
      })
      .catch(err => {
          throw err
      })
}
