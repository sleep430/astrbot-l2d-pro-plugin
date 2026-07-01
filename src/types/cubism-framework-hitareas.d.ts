import type { CubismIdHandle } from '@cubism-framework/id/cubismid'

declare module '@cubism-framework' {
  interface ICubismModelSetting {
    getHitAreaId(index: number): string & CubismIdHandle
    getHitAreaName(index: number): string
  }
}
