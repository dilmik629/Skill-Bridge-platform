import { Component } from 'react'
import ServerError from '../../pages/errors/ServerError'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ServerError message={this.state.message} />
    }
    return this.props.children
  }
}

export default ErrorBoundary