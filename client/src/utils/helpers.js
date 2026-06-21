import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'MMM d, yyyy')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num?.toString() || '0'
}

export const getFileTypeFromUrl = (url) => {
  if (!url) return 'other'
  const ext = url.split('.').pop()?.toLowerCase()
  const map = {
    pdf: 'pdf', docx: 'docx', doc: 'doc',
    pptx: 'pptx', ppt: 'ppt',
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
    zip: 'zip'
  }
  return map[ext] || 'other'
}

export const truncate = (str, length = 100) => {
  if (!str) return ''
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const sanitizeFilename = (filename) => {
  // Remove or replace invalid characters for filenames
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid chars with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .trim()
}

export const generateGravatarUrl = (name, size = 200) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=6366f1&color=fff&rounded=true`
}

export const getRatingStars = (rating) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating ? 'full' : i - 0.5 <= rating ? 'half' : 'empty')
  }
  return stars
}

export const downloadFile = async (url, filename) => {
  try {
    // Extract extension from the URL if filename doesn't have one
    const urlExtension = url.split('.').pop().split('?')[0].toLowerCase()
    const hasExtension = filename.includes('.')
    
    // Sanitize and add extension to filename if missing
    let finalFilename = sanitizeFilename(filename)
    if (!hasExtension && urlExtension) {
      finalFilename = `${finalFilename}.${urlExtension}`
    }
    
    // For Cloudinary URLs or external URLs, try to download via blob
    const response = await fetch(url, { mode: 'cors' })
    
    if (!response.ok) {
      throw new Error('Download failed')
    }
    
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = finalFilename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    }, 100)
  } catch (error) {
    console.error('Download error:', error)
    // Fallback: Open in new tab if blob download fails (for CORS issues)
    window.open(url, '_blank')
  }
}

export const getBranchColor = (branch) => {
  const colors = {
    IT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    AIDS: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    Electronics: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Mechanical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    Civil: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Electrical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  }
  return colors[branch] || colors.Other
}
