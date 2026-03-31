import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

import Dashboard from './superadmin/Dashboard'
import Salon from './superadmin/Salon'
import Users from './superadmin/Users'
import Requests from './superadmin/Requests'
import Setting from './superadmin/Setting'
import Layout from './superadmin/Layout'
import LayoutSalon from './salonadmin/LayoutSalon'
import DashboardSalon from './salonadmin/DashboardSalon'
import AllBooking from './salonadmin/AllBooking'
import SettingSalon from './salonadmin/SettingSalon'
import StaffSalon from './salonadmin/StaffSalon'
import LayoutEmp from './employee/LayoutEmp'
import MySchedule from './employee/MySchedule'
import SettingEmp from './employee/SettingEmp'
import LayoutCustomer from './customer/LayoutCustomer'
import BookAppointment from './customer/BookAppointment'
import MyBookings from './customer/MyBookings'
import AboutUs from './customer/AboutUs'
import Contact from './customer/Contact'
import Terms from './customer/Terms'
import Privacy from './customer/Privacy'
import ApplySalon from './pages/ApplySalon'
import ApplyJob from './pages/ApplyJob'
import SalonStatus from './pages/salonstatus'
import Saloncheck from './pages/Saloncheck'
import ApplicationCheck from './pages/ApplicationCheck'
import ApplicationStatus from './pages/ApplicationStatus'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='applysalon' element={<ApplySalon />} />
      <Route path='applyjob' element={<ApplyJob />} />
      <Route path="/salonstatus" element={<SalonStatus />} />
      <Route path="/applicationcheckform" element={<ApplicationCheck />} />
      <Route path="/salonstatuscheck" element={<Saloncheck />} />
      <Route path="/applicationcheck" element={<ApplicationStatus />} />
      <Route path="/superadmin" element={<Layout />}>

        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="salon" element={<Salon />} />
        <Route path="users" element={<Users />} />
        <Route path="request" element={<Requests />} />
        <Route path="setting" element={<Setting />} />
      </Route>
      <Route path='/salonadmin' element={<LayoutSalon />} >
        <Route index element={<DashboardSalon />} />
        <Route index path="dashboardsalon" element={<DashboardSalon />} />
        <Route path='allbooking' element={<AllBooking />} />

        <Route path='settingsalon' element={<SettingSalon />} />
        <Route path='staffsalon' element={<StaffSalon />} />
      </Route>
      <Route path='/employee' element={<LayoutEmp />}>
        <Route index element={<MySchedule />} />

        <Route path='myshedule' element={<MySchedule />} />
        <Route path='settingemp' element={<SettingEmp />} />

      </Route>
      <Route path='/customer' element={<LayoutCustomer />}>
        <Route index element={<BookAppointment />} />

        <Route path='bookappointment' element={<BookAppointment />} />
        <Route path='mybookings' element={<MyBookings />} />
        <Route path='aboutus' element={<AboutUs />} />
        <Route path='contact' element={<Contact />} />
        <Route path='terms' element={<Terms />} />
        <Route path='privacy' element={<Privacy />} />



      </Route>
    </Routes >
  )
}

export default App
