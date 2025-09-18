interface PackageHeaderProps {
  trackingNumber: string;
  status: string;
}

const PackageHeader = ({ trackingNumber, status }: PackageHeaderProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Package Details
          </h1>
          <p className="text-gray-600">
            Tracking Number: <span className="font-mono font-medium">{trackingNumber}</span>
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackageHeader;