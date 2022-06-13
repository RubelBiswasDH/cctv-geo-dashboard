import store from "../redux/store";
import dayjs from 'dayjs'

const getEmployeeList = () => {
    const state = store.getState()
  return state?.employeeList?.employeeList;
}
const getUniqueDates = () => {
    const state = store.getState()
  return state?.attendanceList?.uniqueDates;
}

const attendanceWithAbsenceInfo = ( attendanceList ) => {
    const employeeList = getEmployeeList()
    const uniqueDates = getUniqueDates()
    let attendance = []
    for (let i in uniqueDates ){
        for(let j in employeeList){
            const currentAttendance = attendanceList.filter( a => dayjs(a.enter_time)
                .format("DD/MM/YYYY") === uniqueDates[i])
                .find( a => a.user_id === employeeList[j].id 
                )
            if(currentAttendance){
                attendance = [currentAttendance, ...attendance]
            }
            else{
                const emp = employeeList[j]
                const a = {
                    is_absent:1,
                    user_id:emp?.id,
                    name:emp?.name,
                }
                if(a){
                    attendance = [a, ...attendance]
                }
                
            }
            
        }
    }
}

export { attendanceWithAbsenceInfo }