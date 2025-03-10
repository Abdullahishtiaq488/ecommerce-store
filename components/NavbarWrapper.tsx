import { getCollections } from "@/lib/actions/actions";
import EnhancedNavbar from "./EnhancedNavbar";
import { cache } from 'react';

const fetchCollections = cache(async () => {
    return await getCollections();
});

const NavbarWrapper = async () => {
    // Fetch collections from the backend using cached function
    const collections = await fetchCollections();

    // Pass collections to the client component
    return <EnhancedNavbar collections={collections} />;
};

export default NavbarWrapper; 