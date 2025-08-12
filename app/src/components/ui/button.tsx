import * as React from "react"
import { twMerge } from "tailwind-merge"

function Button({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
    return (<button
        className={twMerge("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className)}
        {...props}
    />)
}

Button.displayName = "Button"

export { Button }