import PackageDetail from './PackageDetail';

interface PersonCardProps {
  title: string;
  person: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
}

const PersonCard = ({ title, person }: PersonCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <dl className="space-y-2">
      <PackageDetail label="Name" value={person.name} />
      <PackageDetail label="Phone" value={person.phone} />
      <PackageDetail label="Address" value={person.address} />
    </dl>
  </div>
);

export default PersonCard;