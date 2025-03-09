import { getCollections } from "@/lib/actions/actions";
import Footer from "./Footer";

const FooterWrapper = async () => {
    // Fetch collections from the backend
    const collections = await getCollections();

    // Pass collections to the client component
    return <Footer collections={collections} />;
};

export default FooterWrapper; 