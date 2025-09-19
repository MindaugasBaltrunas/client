import { useState, useEffect } from "react";
import usePackageMutations from "./usePackageMutations";
import { PackageStatus } from "../../domains/packageStatus/packageStatus";
import { Package } from "../../domains/package/package";

interface UsePackageFilterProps {
  onFilterChange?: (selectedStatus: PackageStatus | null) => void;
  onClear?: () => void;
}

interface UsePackageFilterReturn {
  selectedFilter: PackageStatus | null;
  searchQuery: number | null;
  
  packages?: Package[]; 
  isLoading: boolean;
  error: any;
  isError: boolean;
  
  handleSubmit: (values: { selectedStatus: string }) => void;
  handleCancel: () => void;
  
  getValidStatuses: () => string[];
  getStatusOptions: () => { value: PackageStatus; label: string }[];
}

const getStatusOptions = () => {
  return [
    { value: PackageStatus.Created, label: "Created" },
    { value: PackageStatus.Sent, label: "Sent" },
    { value: PackageStatus.Accepted, label: "Accepted" },
    { value: PackageStatus.Returned, label: "Returned" },
    { value: PackageStatus.Cancelled, label: "Cancelled" },
  ];
};

export const usePackageFilter = ({ 
  onFilterChange, 
  onClear 
}: UsePackageFilterProps = {}): UsePackageFilterReturn => {
  const [selectedFilter, setSelectedFilter] = useState<PackageStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState<number | null>(null);

  const { usePackageFilter: usePackageFilterAPI } = usePackageMutations();
  
  const {
    data: packages,
    isLoading,
    error,
    isError,
  } = usePackageFilterAPI(searchQuery as number);

  useEffect(() => {
    if (selectedFilter !== null) {
      setSearchQuery(selectedFilter);
    } else {
      setSearchQuery(null);
    }
  }, [selectedFilter]);

  const getValidStatuses = () => {
    return getStatusOptions().map((option) => option.label);
  };

  const handleSubmit = (values: { selectedStatus: string }) => {
    const statusOption = getStatusOptions().find(
      (option) => option.label === values.selectedStatus
    );
    
    if (!statusOption) {
      console.error("Invalid status selected:", values.selectedStatus);
      return;
    }
    
    const statusValue = statusOption.value;
    setSelectedFilter(statusValue);
    onFilterChange?.(statusValue);
  };

   const handleCancel = () => {
    setSelectedFilter(null);
    onFilterChange?.(null);
    onClear?.();
  };

  return {
    selectedFilter,
    searchQuery,
    
    packages,
    isLoading,
    error,
    isError,
    
    handleSubmit,
    handleCancel,
    
    getValidStatuses,
    getStatusOptions,
  };
};

export default usePackageFilter;