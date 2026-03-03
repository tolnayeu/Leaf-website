export type ConfigValueType = string | number | boolean | (string | number | boolean)[]

export interface ConfigValueNode {
  default: ConfigValueType
  desc?: string
}

export interface ConfigSectionNode {
  __desc__?: string
  [key: string]: ConfigSectionNode | ConfigValueNode | string | undefined
}

export type ConfigRoot = {
  [key: string]: ConfigSectionNode | ConfigValueNode
}
