import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Cinefy | Premium Movie Booking",
  description: "Book your favorite movie tickets online with our cinematic experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Netflix Sans, Helvetica, Arial, sans-serif', background: '#0a0a0a', color: 'white' }}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
