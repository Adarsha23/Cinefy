import Navbar from "./components/Navbar";

export const metadata = {
  title: "Cinefy - Movie Booking",
  description: "Book your favorite movie tickets online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#0a0a0a', color: 'white' }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
