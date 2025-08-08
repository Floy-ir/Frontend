import { ReactElement } from "react"
import type { ChatComponentPropsChildren, EmptyProps } from "../../types"

export type InputToolboxOwnProps = EmptyProps
export type InputToolboxProps = ChatComponentPropsChildren<InputToolboxOwnProps, "div">

export declare const InputToolbox: (props: InputToolboxProps) => ReactElement

export default InputToolbox
