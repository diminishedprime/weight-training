import Barbell, { BarbellProps } from ".";

const BarbellThumbnail: React.FC<BarbellProps> = (props) => {
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: 80,
      }}>
      <Barbell {...props} hidePlateNumbers />
    </span>
  );
};

export default BarbellThumbnail;
