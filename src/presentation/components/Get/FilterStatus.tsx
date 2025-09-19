import React, { FC, useEffect } from "react";
import StatusForm from "../Status/StatusForm";
import { PackageStatus } from "../../../domains/packageStatus/packageStatus";
import { usePackageFilter } from "../../hooks/usePackageFilter";
import { Package } from "../../../domains/package/package";

interface FilterStatusProps {
  onFilterChange?: (selectedStatus: PackageStatus | null) => void;
  onClear?: () => void;
  showAll?: boolean;
  callBackFilteredData?: (packages: Package[]) => void;
}

const FilterStatus: FC<FilterStatusProps> = ({
  callBackFilteredData,
  onFilterChange,
  onClear,
}) => {
  const {
    getValidStatuses,
    handleSubmit,
    handleCancel,
    isLoading,
    packages,
    isError,
    error,
  } = usePackageFilter({ onFilterChange, onClear });

   useEffect(() => {
    if (packages && callBackFilteredData) {
      callBackFilteredData(packages);
    }
  }, [packages, callBackFilteredData]);

  return (
    <div>
      <StatusForm
        validStatuses={getValidStatuses()}
        isDisabled={isLoading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        customClass={"hidden"}
        buttonName={"filter"}
      />
      {isLoading && <div>Loading packages...</div>}
      {isError && <div>Error loading packages: {error?.message}</div>}
    </div>
  );
};

export default FilterStatus;