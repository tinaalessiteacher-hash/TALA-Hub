// Frontend view models only. These are NOT a confirmed SkipCourse API schema.
export type CommunityRole = "Student" | "Parent" | "Alumni" | "Staff";
export interface DemoSession {
  role?: CommunityRole;
  representing?: string;
  studentName?: string;
  studentEmail?: string;
  mode: "demo";
  name: string;
  email: string;
}
export type DemoScenario = "success" | "empty" | "error" | "loading";
export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  completed: number;
  lessons: string[];
  color: "blue" | "yellow" | "green";
}
export interface StudentProject {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "In progress" | "Ready to share";
}
export interface StudentOverview {
  focus: string;
  courses: Course[];
  projects: StudentProject[];
}
export interface AuthAdapter {
  login(
    email: string,
    password: string,
    name?: string,
    simulateError?: boolean,
  ): Promise<DemoSession>;
}
export interface StudentAdapter {
  getOverview(
    scenario: DemoScenario,
    signal: AbortSignal,
  ): Promise<StudentOverview>;
}
