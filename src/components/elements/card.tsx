// Pure presentational card container with surface color depth support.
import { View, type ViewProps } from "react-native";
import { Colors } from "@/constants/theme";

type Surface = "background" | "surface" | "surfaceRaised";

export type CardProps = ViewProps & {
  surface?: Surface;
};

export default function Card({
  style,
  surface = "surface",
  ...props
}: CardProps) {
  return (
    <View
      style={[{ backgroundColor: Colors[surface] }, style]}
      {...props}
    />
  );
}
