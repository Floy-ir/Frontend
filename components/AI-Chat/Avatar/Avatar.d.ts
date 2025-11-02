import type { ReactElement } from "react"
import type { ChatComponentPropsChildrenRef, Size, UserStatus } from "../../types"

export interface AvatarProps {
  name?: string
  src?: string
  size?: Size
  status?: UserStatus
  active?: boolean
}

export declare const Avatar: (props: ChatComponentPropsChildrenRef<AvatarProps, "div">) => ReactElement

export default Avatar
