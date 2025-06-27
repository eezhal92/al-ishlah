export type Caption = {
  text: string
  /**
   * In milliseconds
   */
  startTime: number
  /**
   * In milliseconds
   */
  endTime: number
}

export type ContentMedia = {
  title: string
  youtubeID: string | null
  speakerName: string
  audioURL: string
  captions: Caption[]
  /**
   * Arabic captions
   */
  captionsAr?: Caption[] | null
}
