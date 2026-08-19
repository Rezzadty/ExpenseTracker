// Themed view — picks background color from surface depth layer (background / surface / surfaceRaised).
import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

type Surface = 'background' | 'surface' | 'surfaceRaised';

export type ThemedViewProps = ViewProps & {
  surface?: Surface;
};

export function ThemedView({ style, surface = 'background', ...props }: ThemedViewProps) {
  return <View style={[{ backgroundColor: Colors[surface] }, style]} {...props} />;
}
