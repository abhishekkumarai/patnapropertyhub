a.This is a real estate website where the agent is supposed to clone the website "https://www.mypropertymap.com/" and write an architecture.md and readme.md on building it and make sure to integrate all the services needed. This will be built be next.js and later hosted over vercel.com. You have access to the vercel.com via cli.
b.Make sure you have all the requirements clear before building it and it should be built in asap.

c. add the below urls for easily finding the other social pages and extract location and number details from it and add it to the website
1. https://www.facebook.com/pphub/
2. https://www.instagram.com/propertyhubpatna1/
3. Address: 408, Pragati tower, Saguna Khagaul Rd, opposite St. karen's secondary school, Balaji Nagar, Patna, Bihar 801503
4. 09472969648
5. Reviews from : https://www.google.com/maps/place/Patna+property+hub/@25.6108534,85.039093,777m/data=!3m1!1e3!4m6!3m5!1s0x39ed57b4c109f9fd:0xa5140fcadd2a6683!8m2!3d25.6108486!4d85.0416679!16s%2Fg%2F11c74ck7s7?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D
6. Use this brand logo: https://scontent-bom5-1.cdninstagram.com/v/t51.2885-19/26157438_538588449841354_5761569507982180352_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby43NjguYzIifQ&_nc_ht=scontent-bom5-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gHq6Ct_40-eQPp3UO2-f97H0GHnz9EAlPrK635HKOarNnsHmU7S0ZyyaEABUBwbDj_d8_sZiLiXKmzmY_ugmYxW&_nc_ohc=d85tMrfDlQsQ7kNvwFWvq_l&_nc_gid=QRk7CPVFdr_A73oN4YiGuQ&edm=APoiHPcBAAAA&ccb=7-5&oh=00_Af45r3PuiSjwboHy6qwjhQAebBXWGzp4faV2q61L9kM86A&oe=6A1E0950&_nc_sid=22de04
7. https://www.facebook.com/photo/?fbid=419891173487564&set=a.419891123487569 as the background image for the hero-section.
8. Change the color theme based on these images.
9. Add whatsapp link:https://api.whatsapp.com/send?phone=%2B919472969648&token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyNSJ9.eyJleHAiOjE3ODAwNjMzMjgsInBob25lIjoiKzkxOTQ3Mjk2OTY0OCIsImNvbnRleHQiOiJBZmo1YnFBUlVZX3hIN25HbHJJeHlyYjBaZ2V0Y2JzenRPSjk5bmlRV2VHM3dnZlZtTGFnZDFuRnNpZzljVm9jVmRjc0RWWDZfMVVpQ0gxMm1MRzFqejN3ekxVYktENU9mRTdnRXV6cVgtaGRSUHRQa0FaejJEZXMwdG84ZVB2bV82aFJuV3R4Tm4zY0dGd25rX2tGM0cxczhnIiwic291cmNlIjoiRkJfUGFnZSIsImFwcCI6ImZhY2Vib29rIiwiZW50cnlfcG9pbnQiOiJwYWdlX2N0YSJ9.BAfLdiCH-8s58n_zmJMJ_wfA-SNikphsS3j9aeWEO3ysqCju_-hqdhFvFvLtPHLO6wrzDiJtLs6GOf1RNDSUgQ&fbclid=IwY2xjawSFLFpleHRuA2FlbQIxMABicmlkETFtaHZTYVFJd1RQTGNYU2hVc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHgufSmQA9e5bX9KK2wEuMSMPyBXTBk0pTF3OkqjZ_2E1wWmxVeCKxenTJVXZ_aem_n9hCPD213_JgBrn69QXPmg
10. Push all the changes to the github under the patnapropertyhub repo, by creating the repo first. You have access to the github token classic version.

11. Adding GIS Maps with the Existing Layout:
   * To add custom GIS vector layers (e.g., Cadastral/LULC/DP/TP maps):
     - Convert shapefiles (.shp/.dbf) or KML files into GeoJSON format using GIS tools (like QGIS or online converters).
     - Save the GeoJSON file under `src/data/` (e.g., `src/data/cadastral_map.json`).
     - Import the JSON data in [MapComponent.tsx](file:///c:/Users/abhi3/Documents/work/aditya/patnapropertyhub/src/app/imap/MapComponent.tsx) and render them using Leaflet's GeoJSON handler:
       ```typescript
       import cadastralGeoJson from "@/data/cadastral_map.json";
       // Inside Leaflet initialisation:
       L.geoJSON(cadastralGeoJson, {
         style: { color: "#d97706", weight: 2, fillOpacity: 0.2 },
         onEachFeature: (feature, layer) => {
           layer.bindPopup(`Plot No: ${feature.properties.plot_no}`);
         }
       }).addTo(cadastralLayerGroupRef.current);
       ```
   * To connect a GIS Web Map Service (WMS) layer from Geoserver/ArcGIS:
     - Use Leaflet's native WMS loader:
       ```typescript
       L.tileLayer.wms("https://your-geoserver.com/geoserver/wms", {
         layers: "patna:cadastral_layer",
         format: "image/png",
         transparent: true,
         attribution: "Patna Property Hub GIS"
       }).addTo(cadastralLayerGroupRef.current);
       ```

12. Incrementally Adding New Plots for Sale:
   * Open the listings data registry at [properties.ts](file:///c:/Users/abhi3/Documents/work/aditya/patnapropertyhub/src/data/properties.ts).
   * Define and append a new plot object into the `PROPERTIES` array conforming to the `Property` interface:
     - **surveyNo**: Enter the unique survey registration number.
     - **latlng**: Set the center coordinates `[latitude, longitude]` where the map pin should drop.
     - **polygon**: Draw the boundaries of the plot as an array of coordinate pairs: `[[lat1, lng1], [lat2, lng2], [lat3, lng3], [lat4, lng4]]`. (Ensure the polygon vertices are ordered sequentially to avoid rendering visual self-intersections).
     - **zone**: Assign the plot zoning type (`"Residential" | "Commercial" | "Agricultural" | "Industrial"`). The map will automatically tint the boundary using the standard zoning color theme.
     - Fill in structural listing details: `price` (in INR), `size` (in Katha or Bigha), `sizeSqFt`, `pricePerKatha`, `verified` state, `brokerName`, `brokerPhone`, and document identifier references.
   * Save the file. The map listings sidebar and interactive spatial layer will update automatically on hot-reloading.