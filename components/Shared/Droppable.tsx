import { useEffect, useState } from "react";
import {
  Droppable as NonStrictDroppable,
  DroppableProps,
} from "react-beautiful-dnd";

export default function Droppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <NonStrictDroppable {...props}>{children}</NonStrictDroppable>;
}
