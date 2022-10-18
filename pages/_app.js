import { useEffect, useRef } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import "../styles/main.scss";

function MyApp({ Component, pageProps }) {
  const ref = useRef(null);

  useEffect(() => {
    const setHeight = function () {
      let windowsVH = window.innerHeight / 100;
      ref.current?.style.setProperty("--vh", windowsVH + "px");
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div ref={ref}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </div>
  );
}

export default MyApp;
