interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ label, error, children }: Props) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between">
      <label className="font-medium text-sm">{label}</label>
      {error && <p className="text-danger-500 text-sm">{error}</p>}
    </div>
    {children}
  </div>
);

export default FormField;
