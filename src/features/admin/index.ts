export type {
  AdminConfig,
  AdminSession,
  BlogPost,
  Lead,
  LeadStatus,
  LeadTipo,
  SiteContent,
  SiteMedia,
  NavLabels,
} from '@/features/admin/types'

export { STORAGE_KEYS, loadJson, saveJson } from '@/features/admin/storage'
export { createDefaultSiteContent } from '@/features/admin/defaults/siteContent'
export { HOME_DEFAULTS, NAV_DEFAULTS, mergeSiteContent } from '@/features/admin/defaults/siteContent'
export {
  COMO_DEFAULTS,
  PORQUE_DEFAULTS,
  ALIBRA_DEFAULTS,
  PARCEIROS_DEFAULTS,
} from '@/features/admin/defaults/siteContent'
export { usePageField } from '@/features/admin/hooks/usePageField'
export { createDefaultBlogPosts } from '@/features/admin/defaults/blogPosts'

export { ytId } from '@/features/admin/utils/ytId'
export { slugify } from '@/features/admin/utils/slugify'
export { formatPlainText } from '@/features/admin/utils/formatPlainText'
export { formatBlogBody, blocksToPlainText } from '@/features/admin/utils/formatBlogBody'
export { createId } from '@/features/admin/utils/id'

export {
  AdminProvider,
  useAdmin,
  useSiteContent,
  useBlogPosts,
  useLeads,
} from '@/features/admin/AdminProvider'

export {
  ApiError,
  getApiBase,
  isApiEnabled,
  resolveMediaUrl,
  uploadImage,
  uploadVideo,
} from '@/features/admin/api/client'

export {
  listPostsPublic,
  getPostBySlug,
  listPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} from '@/features/admin/api/blog'

export { EditBar } from '@/features/admin/components/EditBar'
export { AdminFlash } from '@/features/admin/components/AdminFlash'
export { AdminGuard, AdminLogin } from '@/features/admin/components/AdminGuard'
export { EditableText } from '@/features/admin/components/EditableText'
export { EditableImage } from '@/features/admin/components/EditableImage'
export { VideoSlot } from '@/features/admin/components/VideoSlot'
export { PolicyPasteModal } from '@/features/admin/components/PolicyPasteModal'
export { PolicyDocument } from '@/features/admin/components/PolicyDocument'
export { BlogPanel } from '@/features/admin/components/BlogPanel'
export { LeadsPanel } from '@/features/admin/components/LeadsPanel'
export { ConfigPanel } from '@/features/admin/components/ConfigPanel'
