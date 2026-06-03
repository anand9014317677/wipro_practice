import withAuth from "../hoc/withAuth";

import Admin from "./Admin";
import Employee from "./Employee";
import Courses from "./Courses";

export const ProtectAdmin = withAuth(Admin);

export const ProtectEmployee = withAuth(Employee);

export const ProtectCourses = withAuth(Courses);