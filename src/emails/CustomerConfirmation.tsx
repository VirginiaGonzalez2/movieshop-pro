import { Heading, Text, Section } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";

interface Props {
    name: string;
}

export default function CustomerConfirmation({ name }: Props) {
    return (
        <EmailLayout>
            <Heading>🎬 Thank You for Contacting A+ MovieShop</Heading>

            <Section>
                <Text>Hi {name},</Text>

                <Text>
                    We have received your message and our team will respond within 24 hours.
                </Text>

                <Text>If your request is urgent, please reply directly to this email.</Text>
            </Section>
        </EmailLayout>
    );
}
