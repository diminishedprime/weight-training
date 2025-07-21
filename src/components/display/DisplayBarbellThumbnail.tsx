import DisplayBarbell, {
  DisplayBarbellProps,
} from "@/components/display/DisplayBarbell";

const DisplayBarbellThumbnail: React.FC<DisplayBarbellProps> = (props) => {
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: 80,
      }}>
      <DisplayBarbell {...props} hidePlateNumbers />
    </span>
  );
};

export default DisplayBarbellThumbnail;
