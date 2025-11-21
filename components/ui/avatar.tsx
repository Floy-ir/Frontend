import Image, { type ImageProps } from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"

type AvatarProps = React.HTMLAttributes<HTMLDivElement>

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="avatar"
      className={cn(
        "bg-Gray-N100 text-Gray-N600 relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = "Avatar"

type AvatarImageProps = Omit<ImageProps, "width" | "height">

const AvatarImage = ({ className, alt, ...props }: AvatarImageProps) => {
  return (
    <Image
      alt={alt ?? ""}
      width={40}
      height={40}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}
AvatarImage.displayName = "AvatarImage"

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "bg-Gray-N200 flex h-full w-full items-center justify-center rounded-full text-[10px] font-medium",
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
