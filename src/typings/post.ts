import { ArticleInfo } from './markdown'
import { PostPreviewData } from './post-preview'

export interface PostImageFile {
  id: string
  childImageSharp: {
    fluid: {
      src: string
    }
  }
}

export interface PostData {
  markdownRemark: ArticleInfo
  allFile: {
    nodes: PostImageFile[]
  }
}

export interface PostPageContext {
  slug: string
  tags: string[]
  next: Nulled<PostPreviewData>
  prev: Nulled<PostPreviewData>
  prevImageFileId?: string
  nextImageFileId?: string
}
