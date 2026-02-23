import * as React from "react";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

interface Props {
    children: React.ReactNode;
}

export default function EmailLayout({ children }: Props) {
    return (
        <Html>
            <Head />
            <Body style={body}>
                <Container style={container}>
                    {/* Brand Header */}
                    <Section style={{ textAlign: "center", marginBottom: 20 }}>
                        <Text style={brandTitle}>🎬 A+ MovieShop</Text>
                    </Section>

                    {/* Email Content */}
                    {children}

                    {/* Footer */}
                    <Section style={{ textAlign: "center", marginTop: 30 }}>
                        <Text style={footerText}>Follow us</Text>

                        <Text style={footerLinks}>Instagram | Facebook | Twitter</Text>

                        <Text style={copyright}>© {new Date().getFullYear()} A+ MovieShop</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const body = {
    backgroundColor: "#f4f6f8",
    padding: "40px 0",
    fontFamily: "Arial, sans-serif",
};

const container = {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "0 auto",
};

const brandTitle = {
    fontSize: "20px",
    fontWeight: "bold",
};

const footerText = {
    fontSize: "12px",
    color: "#888",
};

const footerLinks = {
    fontSize: "12px",
    color: "#2563eb",
};

const copyright = {
    fontSize: "12px",
    color: "#aaa",
    marginTop: "10px",
};
