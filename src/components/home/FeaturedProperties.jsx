import FeaturedPropertiesClient from "./FeaturedPropertiesClient";
import { getFeaturedProperties } from "@/lib/queries/properties";

export default async function FeaturedProperties() {
  const properties = await getFeaturedProperties(12);

  return <FeaturedPropertiesClient initialProperties={properties} />;
}

