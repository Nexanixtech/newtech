import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <>
      <footer className="tech-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tech%20Logo%20%28W%29-Photoroom-bZCRSNI8eibNROSrznxn4tcyQPr4vS.png"
                alt="Technovation"
                width={200}
                height={60}
              />
            </div>
            <p className="footer-description">
              With over a decade of experience, we are proud to deliver innovative robotic solutions to clients around
              the globe.
            </p>
            <div className="footer-contact-info">
              <p className="contact-item">
                <i className="fa-solid fa-map-marker-alt contact-icon"></i>
                Tamil nadu - 627416
              </p>
              <p className="contact-item">
                <i className="fa-solid fa-envelope contact-icon"></i>
                techtechnovation@gmail.com
              </p>
              <p className="contact-item">
                <i className="fa-solid fa-phone contact-icon"></i>
                7339224811
              </p>
            </div>
          </div>
          <div className="footer-right">
            <h2 className="footer-section-title">Sections</h2>
            <div className="footer-divider"></div>
            <ul className="footer-links">
              <li>
                <i className="fa-solid fa-chevron-right arrow-icon"></i>
                <Link href="/">Home</Link>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right arrow-icon"></i>
                <Link href="/#products">Products</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="footer-navbar">
        <div className="copyright">
          © Copyright -{" "}
          <a href="https://technovationpvtltd.com/" className="company-link">
            Technovation
          </a>
        </div>
      </div>
    </>
  )
}
