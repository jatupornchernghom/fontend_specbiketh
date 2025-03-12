import Header from "./Header";
import FixedButton from "./FixedButton";
import Footer from "./Footer";

export default function LayoutComapare({ children }) {
  return (
    <div >
      <Header />
      <FixedButton />
      <div >
        {children}
      </div>
      <Footer />
    </div>
  );
}
