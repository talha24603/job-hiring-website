'use server';

import prisma from "@/prismaClient";

export async function POST(req: Request) {
  try {
    const {
      id,
      userId,
      jobTitle,
      experience,
      salary,
      category,
      jobType,
      address,
      details,
      companyName,
    } = await req.json();
    console.log(userId, jobTitle, experience, salary, category, jobType, address, details, companyName);

    let job_post;
    if (id) {
      // Update existing job post if an id is provided
      job_post = await prisma.jobPost.update({
        where: { id: id as string },
        data: {
          title: jobTitle as string,
          experience: experience as string,
          salary: salary as string,
          category: category as string,
          jobType: jobType as string,
          location: address as string,
          details: details as string,
          company: companyName as string,
        },
      });
    } else {
      // Create a new job post if no id is provided
      job_post = await prisma.jobPost.create({
        data: {
          title: jobTitle as string,
          experience: experience as string,
          salary: salary as string,
          category: category as string,
          jobType: jobType as string,
          location: address as string,
          details: details as string,
          company: companyName as string,
          user: { connect: { id: userId } },
        },
      });
    }
    return new Response(JSON.stringify({ job_post }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "something went wrong" }), { status: 500 });
  }
}
