type ErrorToastProps = {
  errorMessage: string;
};

export default function ErrorToast({ errorMessage }: ErrorToastProps) {
  return (
    <div className="alert alert-error">
      <div>
        <span>{errorMessage}</span>
      </div>
    </div>
  );
}
