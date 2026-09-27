import type { EnrollmentDraft } from "./enrollmentService";
export function RegistrationReview({
  draft,
  onEdit,
}: {
  draft: EnrollmentDraft;
  onEdit: (step: number) => void;
}) {
  const rows: [label: string, value: string, step: number][] = [
    ["Parent", `${draft.parentName} · ${draft.parentEmail}`, 0],
    ["Student", `${draft.studentName} · ${draft.studentEmail}`, 1],
    [
      "Enrollment",
      `${draft.intent} · ${draft.learningMode} · ${draft.timeBlock}`,
      2,
    ],
    ["Documents", "Checklist pending; nothing uploaded", 3],
    ["Funding", `${draft.funding} · no payment`, 4],
  ];
  return (
    <>
      <p>Check the details before completing this demonstration.</p>
      <dl className="review-list">
        {rows.map(([label, value, index]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
            <button
              type="button"
              className="text-link"
              onClick={() => onEdit(index)}
            >
              Edit {label}
            </button>
          </div>
        ))}
      </dl>
      <p className="small">
        Completing this demo does not submit an application. AWAITING BACKEND —
        account creation, billing verification and SkipCourse provisioning.
      </p>
    </>
  );
}
