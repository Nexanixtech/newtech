"use client"

import type React from "react"

import { useState } from "react"

export default function WhatsAppFloat() {
  const [showModal, setShowModal] = useState(false)
  const [showBubble, setShowBubble] = useState(true)

  const handleButtonClick = () => {
    setShowModal(true)
    setShowBubble(false)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowBubble(true)
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowModal(false)
      setShowBubble(true)
    }
  }

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="whatsapp-float">
        {showBubble && <div className="thought-bubble">Contact us for Custom Robots</div>}

        <button className="whatsapp-button" onClick={handleButtonClick}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
          </svg>
        </button>
      </div>

      {/* WhatsApp Modal */}
      {showModal && (
        <div className="whatsapp-modal active" onClick={handleOutsideClick}>
          <div className="whatsapp-modal-content">
            <div className="whatsapp-modal-header">
              <div className="whatsapp-profile">
                <div className="whatsapp-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#25d366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                  </svg>
                </div>
                <div className="whatsapp-profile-info">
                  <h3>Technovation</h3>
                  <p>Online</p>
                </div>
              </div>
              <button className="close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="whatsapp-modal-body">
              <p>Hi! How can we help you today?</p>
            </div>
            <div className="whatsapp-modal-footer">
              <a
                href="https://wa.me/917339224811"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-chat-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                </svg>
                Start Chat
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }

        .thought-bubble {
          position: absolute;
          right: 70px;
          bottom: 35px;
          width: 140px;
          height: auto;
          background-color: white;
          border: 2px solid #075e54;
          border-radius: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          text-align: center;
          padding: 10px 12px;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #075e54;
          font-weight: 600;
        }

        .thought-bubble::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -10px;
          width: 10px;
          height: 10px;
          background-color: white;
          border-right: 2px solid #075e54;
          border-bottom: 2px solid #075e54;
          transform: rotate(-45deg) translateY(-50%);
        }

        .whatsapp-button {
          width: 60px;
          height: 60px;
          background-color: #25d366;
          border-radius: 50%;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          color: white;
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
        }

        .whatsapp-modal {
          display: none;
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 300px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .whatsapp-modal.active {
          display: block;
        }

        .whatsapp-modal-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .whatsapp-modal-header {
          background-color: #075e54;
          color: white;
          padding: 15px;
          border-radius: 10px 10px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .whatsapp-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .whatsapp-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .whatsapp-profile-info h3 {
          margin: 0;
          font-size: 16px;
        }

        .whatsapp-profile-info p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .close-modal {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .whatsapp-modal-body {
          padding: 15px;
          background-color: #ece5dd;
          flex-grow: 1;
        }

        .whatsapp-modal-body p {
          margin: 0;
          color: #075e54;
          font-size: 14px;
        }

        .whatsapp-modal-footer {
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 0 0 10px 10px;
        }

        .whatsapp-chat-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #25d366;
          color: white;
          padding: 12px 20px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .whatsapp-chat-button:hover {
          background-color: #128c7e;
        }

        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
          }

          .whatsapp-button {
            width: 50px;
            height: 50px;
          }

          .thought-bubble {
            right: 60px;
            bottom: 30px;
            width: 120px;
            font-size: 12px;
          }

          .whatsapp-modal {
            bottom: 80px;
            right: 20px;
            width: 280px;
          }
        }
      `}</style>
    </>
  )
}
