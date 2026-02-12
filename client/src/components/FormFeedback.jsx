export default function FormFeedback({
  error,
  status,
  errorClassName = "form-error",
  statusClassName = "form-note",
}) {
  return (
    <>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
      {status && (
        <p className={statusClassName} role="status">
          {status}
        </p>
      )}
    </>
  );
}
