import '../../styles/components/loader.css'

const Loader = ({ size = 'md', fullPage = false, text = '', overlay = false }) => {

  if (fullPage) {
    return (
      <div className={`loader-fullpage ${overlay ? 'loader-overlay' : ''}`}>
        <div className="loader-content">
          <div className={`loader-spinner loader-spinner--${size}`} />
          {text && <p className="loader-text">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="loader-inline">
      <div className={`loader-spinner loader-spinner--${size}`} />
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader