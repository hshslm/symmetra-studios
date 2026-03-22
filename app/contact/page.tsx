import { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch. Let's build your next scene.",
};

export default function Contact(): React.ReactElement {
  return <ContactPage />;
}
