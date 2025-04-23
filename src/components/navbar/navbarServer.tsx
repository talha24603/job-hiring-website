// In a page component or server component with request context:
import { auth } from "@/auth";
import NavbarComponent from "./NavBarComponent";
export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <div>
      <NavbarComponent user={user} />
      
    </div>
  );
}
