import { Text, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';

export type IconName =
  | 'close'
  | 'arrow_forward'
  | 'arrow_back'
  | 'check'
  | 'check_circle'
  | 'volume_up'
  | 'play_arrow'
  | 'settings'
  | 'person'
  | 'home'
  | 'translate'
  | 'flag'
  | (string & {});

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
};

export function Icon({ name, size = 24, color = Colors.icon.default, style }: IconProps) {
  return (
    <Text
      style={[
        { fontFamily: 'MaterialSymbols-Rounded', fontSize: size, lineHeight: size, color },
        style,
      ]}
    >
      {name}
    </Text>
  );
}
