import { EquipmentType } from "@/common-types";
import Image from "next/image";
import { useMemo } from "react";

interface DisplayEquipmentThumbnailProps {
  equipmentType: EquipmentType;
  size?: number;
}

const DisplayEquipmentThumbnail: React.FC<DisplayEquipmentThumbnailProps> = (
  props,
) => {
  const { size = 32 } = props;
  const api = useDisplayEquipmentThumbnailAPI(props.equipmentType);
  return (
    <Image
      src={api.src}
      alt={props.equipmentType}
      width={size}
      height={size}
      unoptimized
    />
  );
};

export default DisplayEquipmentThumbnail;

const useDisplayEquipmentThumbnailAPI = (equipmentType: EquipmentType) => {
  const src = useMemo(() => {
    switch (equipmentType) {
      case "dumbbell":
        return "/dumbell.svg";
      case "barbell":
        return "/barbell.svg";
      case "kettlebell":
        return "/kettlebell.svg";
      case "machine":
        return "/machine-stack.svg";
      case "bodyweight":
        return "/bodyweight.svg";
      case "plate_stack":
        return "/plate-stack.svg";
      default:
        return "";
    }
  }, [equipmentType]);
  return { src };
};
