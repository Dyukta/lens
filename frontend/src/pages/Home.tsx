import UploadBox from '../components/upload/UploadBox'

export default function Home() {
  return (
    <div className="page-center">
      <div className="hero">
        <h1 className="hero-title">
          See your data <span className="gradient-text">through Lens</span>
        </h1>
        <p className="hero-sub">
          Upload a CSV to generate charts, insights and chat instantly
        </p>
        <UploadBox />
      </div>
    </div>
  )
}