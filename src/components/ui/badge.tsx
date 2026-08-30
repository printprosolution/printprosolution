import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
