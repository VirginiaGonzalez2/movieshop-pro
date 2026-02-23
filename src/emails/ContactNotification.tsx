import { Html, Head, Body, Container, Section, Text, Heading, Hr } from "@react-email/components";

interface ContactNotificationProps {
    name: string;
    email: string;
    message: string;
}

export default function ContactNotification({ name, email, message }: ContactNotificationProps) {
    return (
        <Html>
            <Head />
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    {/* Logo Section */}
                    <Section style={logoSection}>
                        <Heading style={brandTitle}>A+ MovieShop</Heading>
                    </Section>

                    <Hr />

                    {/* Title */}
                    <Heading style={headingStyle}>📩 New Contact Message</Heading>

                    {/* Content */}
                    <Text>
                        <strong>Name:</strong> {name}
                    </Text>
                    <Text>
                        <strong>Email:</strong> {email}
                    </Text>
                    <Text>
                        <strong>Message:</strong>
                    </Text>
                    <Text style={messageBox}>{message}</Text>

                    <Hr />

                    {/* Footer */}
                    <Text style={footerStyle}>
                        This message was sent from the A+ MovieShop contact form.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

/* ---------- Styles ---------- */

const bodyStyle = {
    backgroundColor: "#f4f4f7",
    fontFamily: "Arial, sans-serif",
    padding: "40px 0",
};

const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "0 auto",
};

const logoSection = {
    textAlign: "center" as const,
};

const brandTitle = {
    color: "#2563eb", // Primary brand color
};

const headingStyle = {
    fontSize: "20px",
    marginBottom: "20px",
};

const messageBox = {
    backgroundColor: "#f1f5f9",
    padding: "15px",
    borderRadius: "8px",
};

const footerStyle = {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
};
