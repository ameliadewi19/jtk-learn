import React from "react";
import Swal from "sweetalert2";

const MelihatMateri = ({ activeMateri, handleMateriNext }) => {
  return (
    <div
        className="content-box position-relative p-4 w-100"
        style={{ maxWidth: "1300px" }}
      >
        {activeMateri ? (
          <>
            <h3 className="position-absolute material-title">
              {activeMateri.name}
            </h3>

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                height: "70vh",
              }}
            >
              {activeMateri.mat_type === "teks" ? (
                <iframe
                  src={activeMateri.content}
                  title="PDF Viewer"
                  style={{
                    width: "90%",
                    height: "100%",
                    border: "none",
                  }}
                  onError={() =>
                    Swal.fire("Error", "File PDF doesn't exist.", "error")
                  }
                ></iframe>
              ) : (
                <video
                  controls
                  style={{
                    width: "90%",
                    maxWidth: "1200px",
                    height: "auto",
                    backgroundColor: "#000",
                  }}
                  title="Video Player"
                >
                  <source src={activeMateri.content} type="video/mp4" />
                  Browser Anda tidak mendukung video.
                </video>
              )}
            </div>

            <button
              className="btn position-absolute course-next-button d-flex align-items-center"
              onClick={handleMateriNext}
            >
              Next
              <span className="next-button">&gt;</span>
            </button>
          </>
        ) : (
          <p>Pilih materi dari sidebar untuk memulai.</p>
        )}
      </div>
  );
};

export default MelihatMateri;
