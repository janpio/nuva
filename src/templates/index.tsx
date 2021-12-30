import React from "react";
import { Link, graphql } from "gatsby";
import parse from "html-react-parser";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { Post } from "../types";

const Index = ({
  data,
  pageContext: { nextPagePath, previousPagePath },
}) => {
  const posts: Post[] = data.allWpPost.nodes;

  if (!posts.length) {
    return (
      <Layout isHomePage={true}>
        <Seo title="Kaikki julkaisut" />
        <p>
          Ei julkaisuja.
        </p>
      </Layout>
    );
  }

  const firstPost: Post = posts[0];
  const nextPosts: Post[] = posts.slice(1, 4);
  const restOfPosts: Post[] = posts.slice(4);

  let featuredStyle = {
    backgroundImage: "url(" + firstPost.additionalFields.featuredimage + ")",
  };

  return (
    <Layout isHomePage={true}>
      <Seo title="Kaikki julkaisut" />

      <div className="allPosts">
        <div className="firstPost">
          <div className="featuredImage" style={featuredStyle}></div>
          <div className="firstPostText">
            <Link to={firstPost.uri} itemProp="url">
              <h2 itemProp="headline">{parse(firstPost.title)}</h2>
            </Link>
            {firstPost.additionalFields.authors ? <h4>{firstPost.additionalFields.authors.map((author, i) => {
              <span>{author.firstName} </span>
            })}</h4> : <h4>{firstPost.author.node.firstName}</h4>}
            <h5>{firstPost.date}</h5>
          </div>
        </div>

        <ol className="featuredPosts" style={{ listStyle: `none` }}>
          {nextPosts.map(post => {
            return (
              <li key={post.uri}>
                <Link to={post.uri} itemProp="url">
                  <h6 itemProp="headline">{parse(post.title)}</h6>
                </Link>
                {post.additionalFields.authors ? <span>{post.additionalFields.authors.map((author, i) => {
                  <span>{author.firstName} </span>
                })}</span> : <span>{post.author.node.firstName}</span>}
                <span>{post.date}</span>
              </li>
            );
          })}
        </ol>
        <ol className="allPosts" style={{ listStyle: `none` }}>
          {restOfPosts.map(post => {
            return (
              <li key={post.uri}>
                <Link to={post.uri} itemProp="url">
                  <span itemProp="headline">{parse(post.title)}</span>
                </Link>
                <span> </span>
                <span>{post.author.node.firstName}</span>
                <span> </span>
                <small>{post.date}</small>
              </li>
            );
          })}
        </ol>
      </div>

      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Edellinen sivu</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Seuraava sivu</Link>}
    </Layout>
  );
};

export default Index;

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        uri
        date(formatString: "MMMM DD, YYYY", locale: "fi")
        title
        excerpt
        author {
          node {
            firstName
          }
        }
        additionalFields {
          authors {
            firstName
          }
          featuredimage
        }
      }
    }
  }
`;
