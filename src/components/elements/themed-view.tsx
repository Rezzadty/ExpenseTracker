// Pure presentational themed container surface view.
import { Colors } from "@/constants/theme";
import { View, type ViewProps } from "react-native";

type Surface = "background" | "surface" | "surfaceRaised";

export type ThemedViewProps = ViewProps & {
  surface?: Surface;
};

export default function ThemedView({
  style,
  surface = "background",
  ...props
}: ThemedViewProps) {
  return (
    <View
      style={[{ backgroundColor: Colors[surface] }, style]}
      {...props}
    />
  );
}
