import { useEffect, useContext } from "react";
import Swal from "sweetalert2";
import api from "../services/api";
import { UserContext } from "../components/UserContext";

const MelihatMateri = ({ activeMateri }) => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (activeMateri && user) {
            const lastAccessedMateri = localStorage.getItem("lastAccessedMateri");
            
            if(lastAccessedMateri !== activeMateri.id){
                const saveHistoryMateri = async () => {
                    try {
    
                        const response = await api.put(
                            `/materials/${user.userData.id_pelajar}/${activeMateri.id}`,
                            { waktu_akses: new Date().toISOString() },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
        
                        console.log("Response:", response.data);
                    } catch (error) {
                        console.error("Failed to upsert history materi:", error);
                    }
                };
                saveHistoryMateri();
            }
        }
    }, [activeMateri, user]);

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
                    height: "90%",
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
          </>
        ) : (
          <p>Pilih materi dari sidebar untuk memulai.</p>
        )}
      </div>
  );
};

export default MelihatMateri;
