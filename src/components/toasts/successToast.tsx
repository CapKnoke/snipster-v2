type SuccessToastProps = {
  successMessage: string;
};

export default function SuccessToast({ successMessage }: SuccessToastProps) {
  return (
    <div className="alert alert-success">
      <div>
        <span>{successMessage}</span>
      </div>
    </div>
  );
}
