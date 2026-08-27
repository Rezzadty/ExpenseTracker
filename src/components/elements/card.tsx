// Pure presentational card container with surface color depth support.
import { useExpenses } from "@/hooks/use-expenses";
import { View, type ViewProps } from "react-native";

type Surface = "background" | "surface" | "surfaceRaised";

export type CardProps = ViewProps & {
  surface?: Surface;
};

export default function Card({
  style,
  surface = "surface",
  ...props
}: CardProps) {
  const { colors } = useExpenses();
  return (
    <View
      style={[{ backgroundColor: colors[surface] }, style, { backgroundColor: colors[surface] }]}
      {...props}
    />
  );
}
