export interface Property {
  id: number;
  surveyNo: string;
  title: string;
  locality: string;
  price: number; // in Lakhs/Crores INR
  size: string; // e.g. "5 Katha", "12 Katha", "1 Bigha"
  sizeSqFt: number;
  pricePerKatha: number; // in Lakhs
  zone: "Residential" | "Commercial" | "Agricultural" | "Industrial";
  verified: boolean;
  brokerName: string;
  brokerPhone: string;
  description: string;
  latlng: [number, number]; // Center coordinate
  polygon: [number, number][]; // Boundary coordinates for Leaflet
  documents: {
    record712: string; // Mock URL or hash ID
    khata: string;
    ferfar: string;
  };
}

export const PROPERTIES: Property[] = [
  {
    id: 1,
    surveyNo: "BR-PAT-BIH-001",
    title: "Premium Commercial Plot near Bihta IIT Road",
    locality: "Bihta",
    price: 4500000, // 45 Lakhs
    size: "6 Katha",
    sizeSqFt: 8160,
    pricePerKatha: 7.5,
    zone: "Commercial",
    verified: true,
    brokerName: "Rakesh Ranjan",
    brokerPhone: "+91 94312 04567",
    description: "East facing commercial plot situated right on the main Bihta-Sarmera 4-lane highway, very close to IIT Patna campus. Highly suitable for commercial warehousing, offices, or commercial showrooms. Direct road access, ready for mutation.",
    latlng: [25.5458, 84.8625],
    polygon: [
      [25.5463, 84.8618],
      [25.5465, 84.8632],
      [25.5453, 84.8631],
      [25.5451, 84.8619]
    ],
    documents: {
      record712: "712-PAT-BIH-2025-01",
      khata: "KH-PAT-BIH-8A-421",
      ferfar: "FF-PAT-BIH-6A-110"
    }
  },
  {
    id: 2,
    surveyNo: "BR-PAT-BIH-002",
    title: "Agricultural Land suitable for Warehouse/Forming",
    locality: "Bihta",
    price: 8500000, // 85 Lakhs
    size: "1.5 Bigha",
    sizeSqFt: 40500,
    pricePerKatha: 4.25,
    zone: "Agricultural",
    verified: true,
    brokerName: "Vikram Kumar Singh",
    brokerPhone: "+91 70043 19283",
    description: "Fertile agricultural land located in Amhara, Bihta. Close to major logistics centers. Excellent connectivity to both Bihta railway station and National Highway. Direct borewell connectivity, single owner, clear title.",
    latlng: [25.5682, 84.8851],
    polygon: [
      [25.5695, 84.8835],
      [25.5698, 84.8865],
      [25.5670, 84.8867],
      [25.5667, 84.8838]
    ],
    documents: {
      record712: "712-PAT-BIH-2025-99",
      khata: "KH-PAT-BIH-8A-812",
      ferfar: "FF-PAT-BIH-6A-304"
    }
  },
  {
    id: 3,
    surveyNo: "BR-PAT-DAN-001",
    title: "Residential Plot in Gola Road, Danapur",
    locality: "Danapur",
    price: 9500000, // 95 Lakhs
    size: "3 Katha",
    sizeSqFt: 4080,
    pricePerKatha: 31.6,
    zone: "Residential",
    verified: true,
    brokerName: "Abhishek Choudhary",
    brokerPhone: "+91 99340 88219",
    description: "Premium residential plot in a highly developed colony off Gola Road, Danapur. Ready for immediate house construction. Situated in a secured gated society with 20 ft wide internal roads. Water and electricity connections available.",
    latlng: [25.6205, 85.0482],
    polygon: [
      [25.6209, 85.0475],
      [25.6212, 85.0488],
      [25.6201, 85.0489],
      [25.6198, 85.0476]
    ],
    documents: {
      record712: "712-PAT-DAN-2026-44",
      khata: "KH-PAT-DAN-8A-190",
      ferfar: "FF-PAT-DAN-6A-501"
    }
  },
  {
    id: 4,
    surveyNo: "BR-PAT-DAN-002",
    title: "Commercial Plot near G.D. Goenka School",
    locality: "Danapur",
    price: 18000000, // 1.8 Cr
    size: "5 Katha",
    sizeSqFt: 6800,
    pricePerKatha: 36.0,
    zone: "Commercial",
    verified: true,
    brokerName: "Abhishek Choudhary",
    brokerPhone: "+91 99340 88219",
    description: "Prime location commercial land near Saguna-Danapur main road, adjacent to G.D. Goenka school. High footfall area suitable for school building, commercial hospital, or high-rise residential apartment block. Clear boundary walls already constructed.",
    latlng: [25.6368, 85.0315],
    polygon: [
      [25.6375, 85.0305],
      [25.6377, 85.0325],
      [25.6360, 85.0326],
      [25.6358, 85.0306]
    ],
    documents: {
      record712: "712-PAT-DAN-2026-08",
      khata: "KH-PAT-DAN-8A-901",
      ferfar: "FF-PAT-DAN-6A-012"
    }
  },
  {
    id: 5,
    surveyNo: "BR-PAT-BAI-001",
    title: "Residential Plot Near Saguna More Main Highway",
    locality: "Bailey Road",
    price: 15000000, // 1.5 Cr
    size: "4 Katha",
    sizeSqFt: 5440,
    pricePerKatha: 37.5,
    zone: "Residential",
    verified: true,
    brokerName: "Manoj Kumar",
    brokerPhone: "+91 82103 44921",
    description: "Prime residential plot behind R.P.S. More, Bailey Road. Direct connectivity to Patna-Danapur bypass. Surrounded by premium high-rises and schools. Frontage of 45 ft facing a 30 ft wide wide metalled road.",
    latlng: [25.6095, 85.0545],
    polygon: [
      [25.6101, 85.0538],
      [25.6103, 85.0552],
      [25.6089, 85.0551],
      [25.6087, 85.0537]
    ],
    documents: {
      record712: "712-PAT-BAI-2025-17",
      khata: "KH-PAT-BAI-8A-332",
      ferfar: "FF-PAT-BAI-6A-404"
    }
  },
  {
    id: 6,
    surveyNo: "BR-PAT-PHU-001",
    title: "Industrial Plot near Phulwari Sharif AIIMS",
    locality: "Phulwari Sharif",
    price: 24000000, // 2.4 Cr
    size: "10 Katha",
    sizeSqFt: 13600,
    pricePerKatha: 24.0,
    zone: "Industrial",
    verified: false,
    brokerName: "Sanjay Kumar Sinha",
    brokerPhone: "+91 93081 22894",
    description: "Industrial zoned land situated in the proximity of AIIMS Patna. Ideal for medical equipment storage, oxygen plant, warehousing, or pharmaceutical distribution warehouse. Fully fenced, three-phase electricity connection active.",
    latlng: [25.5768, 85.0745],
    polygon: [
      [25.5776, 85.0735],
      [25.5778, 85.0755],
      [25.5760, 85.0754],
      [25.5758, 85.0734]
    ],
    documents: {
      record712: "712-PAT-PHU-2025-05",
      khata: "KH-PAT-PHU-8A-515",
      ferfar: "FF-PAT-PHU-6A-201"
    }
  },
  {
    id: 7,
    surveyNo: "BR-PAT-KAN-001",
    title: "Premium Commercial Land in Kankarbagh Bypass",
    locality: "Kankarbagh",
    price: 32000000, // 3.2 Cr
    size: "8 Katha",
    sizeSqFt: 10880,
    pricePerKatha: 40.0,
    zone: "Commercial",
    verified: true,
    brokerName: "Vikram Kumar Singh",
    brokerPhone: "+91 70043 19283",
    description: "Highly visible commercial corner plot right on the busy Kankarbagh bypass main road. Extreme marketing visibility. Perfect for brand showrooms, corporate offices, hotels, or banking centers. Boundary wall done, instant register booking.",
    latlng: [25.5925, 85.1582],
    polygon: [
      [25.5932, 85.1572],
      [25.5935, 85.1592],
      [25.5918, 85.1591],
      [25.5915, 85.1571]
    ],
    documents: {
      record712: "712-PAT-KAN-2026-110",
      khata: "KH-PAT-KAN-8A-899",
      ferfar: "FF-PAT-KAN-6A-725"
    }
  }
];
