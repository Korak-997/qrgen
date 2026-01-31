import { ref } from 'vue'

/**
 * Composable for downloading canvas content as PNG files.
 * Handles the conversion from canvas → blob → file download.
 */
export function useDownload() {
  const isDownloading = ref(false)
  const downloadError = ref<string | null>(null)

  /**
   * Downloads a canvas element as a PNG file.
   * @param canvas - The canvas element to download
   * @param filename - The name for the downloaded file (without extension)
   */
  async function downloadCanvas(
    canvas: HTMLCanvasElement | null,
    filename = 'qrcode'
  ): Promise<boolean> {
    if (!canvas) {
      downloadError.value = 'No QR code to download'
      return false
    }

    isDownloading.value = true
    downloadError.value = null

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0)
      })

      if (!blob) {
        throw new Error('Failed to create image')
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.png`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      downloadError.value = error instanceof Error ? error.message : 'Download failed'
      return false
    } finally {
      isDownloading.value = false
    }
  }

  function clearError() {
    downloadError.value = null
  }

  return {
    isDownloading,
    downloadError,
    downloadCanvas,
    clearError
  }
}
