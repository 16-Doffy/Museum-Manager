// Minimal ambient module shims to satisfy local type-check.
// Real types are provided by apps via peerDependencies at integration time.

declare module '@museum-manager/query-foundation' {
  export class BaseCacheKeyFactory {
    protected prefix: string;
    constructor(prefix: string);
  }

  export type QueryKey = any[];
  export type APIResponse<T = any> = any;
  export type PaginatedResponse<T = any> = any;
  export type UploadProgress = any;
  export enum UploadStatus {
    PENDING = 'PENDING',
    UPLOADING = 'UPLOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
  }
  export type CustomMutationOptions<T = any, TError = any> = any;
  export type APIError = any;

  export function useQuery<T = any>(...args: any[]): T;
  export function useMutation<T = any>(...args: any[]): T;
  export function useUploadMutation<T = any>(...args: any[]): T;
  export function getQueryClient(): { invalidateQueries: (opts: any) => void };
  export function getHttpClient<T = any>(): any;
}

declare module '@museum-manager/ui-core' {
  export const Button: any;
  export const Dialog: any;
  export const DialogContent: any;
  export const DialogDescription: any;
  export const DialogFooter: any;
  export const DialogHeader: any;
  export const DialogTitle: any;
  export const ScrollArea: any;
  export function cn(...args: any[]): string;
}

// Wildcard subpath shims for ui-core components (declare the names we use)
declare module '@museum-manager/ui-core/*' {
  export const Button: any;
  export const Form: any;
  export const FormField: any;
  export const FormItem: any;
  export const FormLabel: any;
  export const FormControl: any;
  export const FormDescription: any;
  export const FormMessage: any;
  export const Input: any;
  export const Switch: any;
  export const ScrollArea: any;
  export const Separator: any;
  export const Popover: any;
  export const PopoverContent: any;
  export const PopoverTrigger: any;
  export const Dialog: any;
  export const DialogContent: any;
  export const DialogHeader: any;
  export const DialogTitle: any;
  export const DialogDescription: any;
  export const DialogFooter: any;
  export const Badge: any;
  export const Card: any;
  export const CardContent: any;
  export const cn: (...args: any[]) => string;
}

declare module 'sonner' {
  export const toast: any;
}

declare module 'lodash/get' {
  const get: any;
  export default get;
}

declare module 'class-variance-authority' {
  export const cva: any;
}


