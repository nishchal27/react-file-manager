/*purpose of this component is to wrap a component with a max-width,
all pages will be the same from right hand side and left hand side*/

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/*here in tailwind css the class order matters b'coz we're using
tw-merge function but normally the order is not important */

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
