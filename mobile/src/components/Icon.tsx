import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T } from '../theme';

export type IconName =
  | 'home' | 'box' | 'chat' | 'user' | 'pin' | 'arrow' | 'clock' | 'star'
  | 'spark' | 'shield' | 'plus' | 'search' | 'dot' | 'chevR' | 'menu' | 'bell' | 'check' | 'arrowUR';

export function Icon({
  name,
  size = 24,
  color = T.ink,
  stroke = 2,
}: {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  const p = {
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<IconName, React.ReactNode> = {
    home: (<><Path {...p} d="M3 11.5 12 4l9 7.5" /><Path {...p} d="M5.5 10v9.5h13V10" /></>),
    box: (<><Path {...p} d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><Path {...p} d="M3 8l9 5 9-5M12 13v8" /></>),
    chat: <Path {...p} d="M4 5h16v11H9l-5 4V5Z" />,
    user: (<><Circle {...p} cx={12} cy={8} r={3.6} /><Path {...p} d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" /></>),
    pin: (<><Path {...p} d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.8 7 11Z" /><Circle {...p} cx={12} cy={10} r={2.4} /></>),
    arrow: <Path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    clock: (<><Circle {...p} cx={12} cy={12} r={8.5} /><Path {...p} d="M12 7.5V12l3 2" /></>),
    star: <Path fill={color} stroke={color} strokeWidth={1} d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z" />,
    spark: (<><Path {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4" /><Path {...p} d="M7 7l2.5 2.5M14.5 14.5 17 17M17 7l-2.5 2.5M9.5 14.5 7 17" /></>),
    shield: (<><Path {...p} d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z" /><Path {...p} d="m9 12 2 2 4-4" /></>),
    plus: <Path {...p} d="M12 5v14M5 12h14" />,
    search: (<><Circle {...p} cx={11} cy={11} r={7} /><Path {...p} d="m20 20-3.5-3.5" /></>),
    dot: <Circle cx={12} cy={12} r={4} fill={color} />,
    chevR: <Path {...p} d="m9 6 6 6-6 6" />,
    menu: <Path {...p} d="M4 7h16M4 12h16M4 17h16" />,
    bell: (<><Path {...p} d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><Path {...p} d="M10 20a2 2 0 0 0 4 0" /></>),
    check: <Path {...p} d="M5 12.5 10 17l9-10" />,
    arrowUR: <Path {...p} d="M7 17 17 7M8 7h9v9" />,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths[name]}
    </Svg>
  );
}

// Truck silhouette — size variants s/m/l (van / box truck / big truck).
export function Truck({
  size = 'm',
  color = T.ink,
  w = 46,
}: {
  size?: 's' | 'm' | 'l';
  color?: string;
  w?: number;
}) {
  const cfg = {
    s: { body: [14, 8, 18, 12], cab: [2, 12, 12, 8], wheels: [9, 26] },
    m: { body: [12, 5, 22, 15], cab: [2, 11, 10, 9], wheels: [8, 28] },
    l: { body: [10, 3, 28, 17], cab: [1, 10, 9, 10], wheels: [7, 21, 32] },
  }[size];
  return (
    <Svg width={w} height={w * 0.62} viewBox="0 0 44 28">
      <Rect x={cfg.cab[0]} y={cfg.cab[1]} width={cfg.cab[2]} height={cfg.cab[3]} rx={2.5} fill={color} />
      <Rect x={cfg.body[0]} y={cfg.body[1]} width={cfg.body[2]} height={cfg.body[3]} rx={2.5} fill={color} opacity={0.92} />
      {cfg.wheels.map((x, i) => (
        <Circle key={i} cx={x} cy={25} r={3.4} fill={color} />
      ))}
    </Svg>
  );
}
