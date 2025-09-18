interface PackageDetailProps {
  label: string;
  value: string | undefined;
}

const PackageDetail = ({ label, value }: PackageDetailProps) => (
  <div className="mb-3">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-base text-gray-900">{value || 'N/A'}</dd>
  </div>
);

export default PackageDetail;