"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/me");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div style={{ color: "white", padding: "100px", textAlign: "center" }}>
        Loading your tickets...
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        padding: "4rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            marginBottom: "2rem",
            borderLeft: "5px solid #e50914",
            paddingLeft: "1rem",
          }}
        >
          My Tickets
        </h1>

        {bookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              backgroundColor: "#111",
              borderRadius: "15px",
            }}
          >
            <p style={{ color: "#666", fontSize: "1.2rem" }}>
              You haven't booked any movies yet.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                marginTop: "1.5rem",
                backgroundColor: "#e50914",
                color: "#fff",
                border: "none",
                padding: "10px 25px",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  backgroundColor: "#111",
                  borderRadius: "15px",
                  overflow: "hidden",
                  display: "flex",
                  border: "1px solid #222",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {/* Movie Poster Thumbnail */}
                <div style={{ width: "150px", flexShrink: 0 }}>
                  <img
                    src={booking.show.movie.posterUrl}
                    alt="poster"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Ticket Details */}
                <div
                  style={{
                    padding: "1.5rem",
                    flexGrow: 1,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>
                      {booking.show.movie.title}
                    </h2>
                    <span style={{ color: "#e50914", fontWeight: "bold" }}>
                      #CNF-{booking.id}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      color: "#aaa",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 5px 0",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Theater
                      </p>
                      <p
                        style={{ color: "#fff", fontWeight: "bold", margin: 0 }}
                      >
                        {booking.show.theater.name}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 5px 0",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Showtime
                      </p>
                      <p
                        style={{ color: "#fff", fontWeight: "bold", margin: 0 }}
                      >
                        {new Date(booking.show.startTime).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 5px 0",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Seats
                      </p>
                      <p
                        style={{
                          color: "#e50914",
                          fontWeight: "bold",
                          margin: 0,
                        }}
                      >
                        {booking.seats.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 5px 0",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Total Amount
                      </p>
                      <p
                        style={{ color: "#fff", fontWeight: "bold", margin: 0 }}
                      >
                        NPR {booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic Ticket "Cut" */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#0a0a0a",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
