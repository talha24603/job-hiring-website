import { auth } from '@/auth';
import axios from 'axios';
import React from 'react'
import EmployeeProfile from './profile';

export default async function page() {
  const session = await auth();
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const user = session?.user;
  
  let data = null;
  try {
    const response = await axios.get(`${url}/api/employee-profile`, {
      params: { email: user?.email },
    });
    data = response.data.employeeProfile;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Profile doesn't exist yet, this is expected
      console.log("No profile found for user, will show create profile form");
    } else {
      console.error("Error fetching profile:", error);
    }
  }

  return (
    <div>
      <EmployeeProfile data={data}/>
    </div>
  )
}
