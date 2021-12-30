import React from "react";
import { Link, graphql } from "gatsby";
import parse from "html-react-parser";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";

import "../css/predefined-formatting.scss";

import { PostTemplateParams, Post } from "../types";

const PostTemplate = ({ data: { previous, next, post } }: PostTemplateParams) => {

  return (
    <Layout>
      <Seo title={post.title} description={post.excerpt} />

      <article
        className="post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{parse(post.title)}</h1>

          <p>{post.date}</p>

          {/* if we have a featured image for this post let's display it */}
          {/*post.additionalFields?.featuredimage && (
            <img
              src={post.additionalFields.featuredimage}
              alt="Featured image"
              style={{ marginBottom: 50 }}
            />
          )*/}
        </header>

        <section itemProp="articleBody">
          <div className="articleContent" dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.additionalFields.scripts &&
            <script>{post.additionalFields.scripts}</script>
          }
          {post.additionalFields.styles &&
            <style>{post.additionalFields.styles}</style>
          }
        </section>

        <hr />

        <footer>
          {post.additionalFields.authors ? post.additionalFields.authors.map((author, i) =>
            <Bio author={author} key={i} />
          ) : <Bio author={post.author} />}
        </footer>
      </article>

      <nav className="post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.uri} rel="prev">
                ← {parse(previous.title)}
              </Link>
            )}
          </li>

          <li>
            {next && (
              <Link to={next.uri} rel="next">
                {parse(next.title)} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default PostTemplate;

/*
localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
              )
            }
          }
*/
export const pageQuery = graphql`
  query PostById(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      date(formatString: "MMMM DD, YYYY", locale: "fi")
      author {
        node {
          firstName
          description
          avatar {
            url
          }
        }
      }
      additionalFields {
        authors {
          firstName
          description
          avatar {
            url
          }
        }
        featuredimage,
        scripts,
        styles,
        theme
      }
    }
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`;
