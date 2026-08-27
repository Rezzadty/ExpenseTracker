// Pure presentational themed container surface view.
import { useExpenses } from "@/hooks/use-expenses";
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
  const { colors } = useExpenses();
  return (
    <View
      style={[{ backgroundColor: colors[surface] }, style, { backgroundColor: colors[surface] }]}
      {...props}
    />
  );
}
