import * as React from 'react'
import Link from 'gatsby-link'

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

export default class extends React.Component<IndexPageProps, {}> {
  constructor(props: IndexPageProps, context: any) {
    super(props, context)
  }
  public render() {
    return (
      <div>
        <h1>Hi people</h1>
        <p>
          Welcome to your new{' '}
          <strong>{this.props.data.site.siteMetadata.title}</strong> site.
        </p>
        <p>Now go build something great.</p>
        <Link to="/page-2/">Go to page 2</Link>
      </div>
    )
  }
}
