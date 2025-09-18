interface AlertMessageProps {
  type: 'success' | 'error';
  message: string;
}

const AlertMessage = ({ type, message }: AlertMessageProps) => (
  <div className={`mb-4 p-4 rounded-md ${
    type === 'success' 
      ? 'bg-green-100 border border-green-400 text-green-700' 
      : 'bg-red-100 border border-red-400 text-red-700'
  }`}>
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default AlertMessage;