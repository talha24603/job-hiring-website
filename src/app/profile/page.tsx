import { auth } from '@/auth';
import axios from 'axios';
import React from 'react'
import EmployeeProfile from './profile';

export default async function page() {
  const session = await auth();
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const user = session?.user;
  const response = await axios.get(`${url}/api/employee-profile`, {
            params: { email: user?.email },
          })
  
          const data = response.data.employeeProfile
          console.log("Employee Profile Data:", data);
  

  return (
    <div>
      <EmployeeProfile data={data}/>
    </div>
  )
}
