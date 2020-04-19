/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO({ description, lang, meta, title, image, url }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            realName
            siteUrl
          }
        }
      }
    `
  );

  const metadata = site.siteMetadata;
  const metaDescription = description || metadata.description;
  const metaImage = image || `${url}/ferry-suhandri.jpg`;
  const metaUrl = url || metadata.siteUrl;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${metadata.realName}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: metaUrl,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:image:type`,
          content: "metaImage/jpg",
        },
        {
          property: `og:image:width`,
          content: "338",
        },
        {
          property: `og:image:height`,
          content: "463",
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: metadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:image`,
          content: metaImage,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `fb:admins`,
          content: `7sferry`,
        },
        {
          property: `fb:app_id`,
          content: `2050507281848079`,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
};

export default SEO;

// todo delete keywords
