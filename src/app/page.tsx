import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/NavBar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import Image from "next/image";

const categories = [
  { title: "Frontend Developer", skills: "React, Vue, Angular, HTML, CSS, JavaScript" },
  { title: "Backend Development", skills: "Node.js, Django, Spring Boot, Ruby on Rails" },
  { title: "Full Stack Developer", skills: "MERN, MEAN, LAMP Stack" },
  { title: "Mobile App Developer", skills: "React Native, Flutter, Swift, Kotlin" },
  { title: "DevOps Engineer", skills: "CI/CD, AWS, Docker, Kubernetes" },
  { title: "Software Engineer", skills: "General software development roles" },
  { title: "Game Developer", skills: "Unity, Unreal Engine, C#" },
  { title: "AI/ML Engineer", skills: "TensorFlow, PyTorch, NLP, Data Science" },
  { title: "Cybersecurity Engineer", skills: "Penetration Testing, Ethical Hacking" },
  { title: "Data Engineer", skills: "Big Data, SQL, ETL Pipelines" },
  { title: "Database Administrator", skills: "MongoDB, PostgreSQL, MySQL, Firebase" },
  { title: "Cloud Engineer", skills: "AWS, Azure, Google Cloud" },
];

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  // Server-side role check and redirect
  if (user?.role === "UNASSIGNED") {
    redirect("/select-role");
  }
  return (
    <>
      <Navbar  user={user} />
      <div className="p-8 min-h-screen bg-white">
        <h1 className="text-4xl font-bold text-left mb-6 ml-4 text-gray-900">Job Categories</h1>
        <p className="text-lg text-gray-700 ml-4 mb-8">
          Explore various career paths and find the right role that fits your skills and interests.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {categories.map((category, index) => {
            const slug = category.title.toLowerCase().replace(/ /g, "-"); // Convert title to slug
            return (
              <Link key={index} href={`coming-soon`}>
                <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-102 hover:shadow-2xl">
                  <div className="relative w-full h-48">
                    <Image
                      src={`/images/${category.title}.png`}
                      alt={`${category.title} image`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 ">
                      {category.title}
                    </h2>
                    <p className="mt-2 text-gray-600">{category.skills}</p>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Join our platform to explore job opportunities, connect with recruiters, and advance your career.
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
