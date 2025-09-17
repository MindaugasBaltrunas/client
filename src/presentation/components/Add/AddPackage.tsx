import { CreatePackage } from "../../../domains/package/createPackage";
import usePackageMutations from "../../hooks/usePackageMutations";
import { uuid } from "zod";

interface AddPackageProps {
  sender: string;
  recipient: string;
}

const AddPackage = ({ sender, recipient }: AddPackageProps) => {
  const { useCreatePackage } = usePackageMutations();
  const createPackageMutation = useCreatePackage();





  // if (!sender.length && !recipient.length) {
  //     createPackageMutation.mutate(cratePackage)
  // }


  return <div>{/* use ids.sender / ids.recipient here */}</div>;
};

export default AddPackage;
