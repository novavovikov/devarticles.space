import React from 'react'
import { graphql } from 'gatsby'
import { PostData, PostPageContext } from '../../typings/post'
import Page from '../../components/page'
import Post from '../../components/post'
import { getPostImageUrl } from './utils'
import PostPreview from '../../components/post-preview'
import { LINKS } from '../../constants/links'
import s from './post.module.css'

interface Props {
  pageContext: PostPageContext
  data: PostData
}

export default function PostPage(props: Props) {
  const {
    slug,
    prev,
    prevImageFileId,
    next,
    nextImageFileId
  } = props.pageContext

  const { markdownRemark, allFile } = props.data
  const { title, description, cover } = markdownRemark.frontmatter

  const prevPostImage = getPostImageUrl(allFile.nodes, prevImageFileId)
  const nextPostImage = getPostImageUrl(allFile.nodes, nextImageFileId)

  return (
    <Page
      seoProps={{
        title,
        description,
        image: cover?.childImageSharp.fluid.src
      }}>
      <Post githubLink={`${LINKS.gh}${slug}`} article={markdownRemark} />

      <div className={s.PostPreview}>
        <h3 className={s.PostPreview__title}>Читать ещё:</h3>

        <div className={s.PostPreview__content}>
          <div>
            {prev && <PostPreview {...prev} imageUrl={prevPostImage} />}
          </div>
          <div>
            {next && <PostPreview inverse {...next} imageUrl={nextPostImage} />}
          </div>
        </div>
      </div>
    </Page>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String
    $prevImageFileId: String
    $nextImageFileId: String
  ) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        date
        title
        description
        tags
        cover {
          id
          childImageSharp {
            fluid(maxWidth: 400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    allFile(filter: { id: { in: [$prevImageFileId, $nextImageFileId] } }) {
      nodes {
        id
        childImageSharp {
          fluid(maxWidth: 200) {
            src
          }
        }
      }
    }
  }
`
