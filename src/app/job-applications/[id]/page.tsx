// 'use client'
// import React, { useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';

// import Navbar from '@/components/navbar/NavBarComponent';
// import ShowApplications from '@/components/ShowApplications';
// import { auth } from '@/auth';



// interface Application {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: Date;
//   identityCardUrl: string;
//   resumeUrl: string;
//   jobPostId: string;
// }

// export default async function Page() {
  
//   const session = await auth();
//   const user = session?.user;
//   const params = useParams();
//   const [applications, setApplications] = useState<Application[]>([]);

//   // useEffect(() => {
//   //   const getApplications = async () => {

//       try {
//              const { data } = await axios.get<Application[]>(`/api/job-applications/${params?.id}`);
//              setApplications(data);
//            } catch (error) {
//              console.error("Error fetching applications:", error);
//            }
//   //   };
    
//   //   if (params.id) getApplications();
//   // }, [params.id]);


//   return (
//     <div className='mt-20 '>
//       <Navbar user = {user}/>
//       <ShowApplications applications={applications} />
//     </div>
//   );
// }