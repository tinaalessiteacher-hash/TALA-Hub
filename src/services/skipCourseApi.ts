import { demoEnabled } from "./authService";
import { demoStudentAdapter } from "./demoAdapter";
import type { StudentAdapter } from "./serviceTypes";

// Integration boundary: map a confirmed backend response to our view model here.
// No URL, credentials, production schema or provisioning API has been assumed.
export const skipCourseApi: StudentAdapter = demoEnabled
  ? demoStudentAdapter
  : {
      async getOverview() {
        throw new Error(
          "SkipCourse is not connected. The team is awaiting the API contract.",
        );
      },
    };
