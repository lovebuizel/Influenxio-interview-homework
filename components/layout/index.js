import React from "react";
import { Box, Container } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box className="vh" w="full" overflow="auto">
      <Container minH="100%" maxW="100%" p={{ md: "4", base: "2" }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
