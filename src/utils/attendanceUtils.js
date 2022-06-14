import store from "../redux/store";
import dayjs from 'dayjs'

const getEmployeeList = () => {
    const state = store.getState()
  return state?.employeeList?.employeeList;
}

const attendanceWithAbsenceInfo = ( attendanceList ) => {
    const employeeList = getEmployeeList()
    let dates = []
    if(attendanceList && attendanceList.length){
        attendanceList.forEach(data => {
            dates.push(dayjs(data.enter_time).format("DD/MM/YYYY"))
        })
    }
    
    const uniqueDates = [...new Set(dates)]

    let attendance = []
    for (let i in uniqueDates ){
        for(let j in employeeList){
            const currentAttendance = attendanceList.filter( a => dayjs(a.enter_time)
                .format("DD/MM/YYYY") === uniqueDates[i])
                .find( a => a.user_id === employeeList[j].id 
                )
            if(currentAttendance){
                attendance = [
                    {...currentAttendance,
                        is_absent:0
                    }, ...attendance]
            }
            else{
                const emp = employeeList[j]
                const a = {
                    is_absent:1,
                    user_id:emp?.id,
                    name:emp?.name,
                    id:emp?.id+uniqueDates[i],
                    date: uniqueDates[i],
                    created_at: uniqueDates[i]
                }
                if(a){
                    attendance = [a, ...attendance]
                }
                
            }
            
        }
    }
    return attendance
}

export { attendanceWithAbsenceInfo }