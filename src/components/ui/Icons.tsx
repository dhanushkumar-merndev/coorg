import type { IconBaseProps } from "react-icons";
import { LuArrowRight } from "react-icons/lu";

export function ArrowIcon(props: IconBaseProps) {
  return <LuArrowRight size={20} strokeWidth={1.3} aria-hidden="true" {...props} />;
}
