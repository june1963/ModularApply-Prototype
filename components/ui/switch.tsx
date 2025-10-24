import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[#10B981] data-[state=unchecked]:bg-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-5 rounded-full ring-0 shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
