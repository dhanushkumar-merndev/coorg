import type { IconBaseProps } from "react-icons";
import { LuArrowRight, LuMountainSnow } from "react-icons/lu";

export function ArrowIcon(props: IconBaseProps) {
  return <LuArrowRight size={20} strokeWidth={1.3} aria-hidden="true" {...props} />;
}

export function MountainMark(props: IconBaseProps) {
  return <LuMountainSnow size={43} strokeWidth={1.1} aria-hidden="true" {...props} />;
}
