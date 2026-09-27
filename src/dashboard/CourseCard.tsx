import type { Course } from "./learningTypes";
import { Icon } from "../shared/Icon";
export function CourseCard({ course }: { course: Course }) {
  const percent = Math.round((course.completed / course.lessons.length) * 100);
  return (
    <article className="course-card">
      <div className={`course-art ${course.color}`} aria-hidden="true">
        <Icon
          name={
            course.color === "blue"
              ? "sun"
              : course.color === "yellow"
                ? "voice"
                : "leaf"
          }
        />
      </div>
      <div className="course-copy">
        <p className="category">{course.category}</p>
        <h3>{course.title}</h3>
        <div className="progress-label">
          <span>
            {course.completed} of {course.lessons.length} sample lessons
          </span>
          <strong>{percent}%</strong>
        </div>
        <progress
          value={course.completed}
          max={course.lessons.length}
          aria-label={`${course.title} progress`}
        />
        <details className="course-details">
          <summary>View sample lessons</summary>
          <p>{course.description}</p>
          <ol>
            {course.lessons.map((lesson, index) => (
              <li key={lesson}>
                {lesson}{" "}
                {index < course.completed && (
                  <span className="lesson-done">— completed</span>
                )}
              </li>
            ))}
          </ol>
          <p className="small">
            Sample outline only. Real lessons and activity tracking will come
            from SkipCourse.
          </p>
        </details>
      </div>
    </article>
  );
}
