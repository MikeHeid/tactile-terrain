import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Homepage content
  await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroTagline:
        "We design and fabricate 3D topographic maps to help people connect with the landscapes that matter to them.",
      introText:
        "These models allow us to see the Earth as if we were giants, reaching down to touch the sculpted surface of our world. 3D maps intuitively orient people to their environment, visualize information, and communicate narratives through interpretive design. We see maps as storytelling tools — works of art that draw people into the world around them.",
    },
  });

  // Team members
  const teamData = [
    { name: "James Tyrwhitt-Drake", role: "Cartographer, Founder", company: null, sortOrder: 0 },
    { name: "Doug Driediger", role: "Designer and Painter", company: "Metrographics Design Group", sortOrder: 1 },
    { name: "John Twaddle", role: "Project Manager", company: "Metrographics Design Group", sortOrder: 2 },
    { name: "Bryn Finer", role: "Designer and Fabricator", company: "Bryn Finer Studios", sortOrder: 3 },
    { name: "Nicolas de Cosson", role: "Designer and Fabricator", company: "Robot Cafe", sortOrder: 4 },
    { name: "Collin McManus", role: "Miniaturist", company: null, sortOrder: 5 },
    { name: "Michael Heid", role: "Lighting Engineer", company: "Sigma-1 Environments", sortOrder: 6 },
  ];

  for (const member of teamData) {
    await prisma.teamMember.upsert({
      where: { id: member.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") },
      update: member,
      create: {
        id: member.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        ...member,
      },
    });
  }

  // Site content blocks
  const siteContentData = [
    {
      key: "about_story",
      content: `Tactile Terrain is a collaborative project of artists, designers & fabricators who bring each map from a concept into a fully realized work of art.

Founded by cartographer James Tyrwhitt-Drake, the studio draws inspiration from the mountains and forests of the qathet region of coastal British Columbia. Our work spans interactive exhibits for national parks, environmental awareness installations, and private commissions that transform how people see and understand landscapes.

We see maps as storytelling tools — works of art that draw people into the world around them. Landscape models create vivid perspectives of any location; they can be used to orient visitors, plan expeditions, facilitate conservation, unite communities, market destinations, and manage resources.`,
    },
  ];

  for (const content of siteContentData) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: { content: content.content },
      create: content,
    });
  }

  // Gallery items with images
  const galleryData = [
    {
      title: "The Qathet Peninsula",
      slug: "qathet-peninsula",
      description:
        "A 3D topographic map of the qathet region between Toba and Jervis inlets on British Columbia's west coast. The area encompasses traditional territories of the Tla'amin and Sechelt peoples, including settlements at Lund, Tsi-sho-sum, Powell River, and Saltery Bay. The landscape features mountains, lakes, streams, and forests where coastal mountains meet the Salish Sea.",
      category: "Personal",
      scale: "1:40,000",
      year: "2022",
      location: "British Columbia",
      sortOrder: 0,
      featured: true,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2023/01/Qathet1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet7.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet6.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet5.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet4.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet3.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/01/qathet2.jpg",
      ],
    },
    {
      title: "The Eldred Valley",
      slug: "eldred-valley",
      description:
        "This valley is deep in the wilderness of the qathet region, about 50km north of Powell River BC. The Eldred is home to magnificent alpine regions, frozen lakes, deep forests and beautiful rivers and streams. The region features the Colin Arthur Dionne Memorial Climbers Camp at its center, surrounded by expansive granite rock formations.",
      category: "Personal",
      scale: "1:20,000",
      year: "2022",
      location: "British Columbia",
      sortOrder: 1,
      featured: true,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred7.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred6.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred5.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred4.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred3.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/Eldred2.jpg",
      ],
    },
    {
      title: "Waterton Lakes National Park",
      slug: "waterton-lakes",
      description:
        "This map of Waterton Lakes is on exhibit at the new visitor centre. It serves to orient visitors to the park, present them with information about the location, and facilitate their trip planning and daily activities. The map highlights key elements for Parks Canada and the Blackfoot First Nation. Features include decorative icons marking viewpoints, picnic locations, campsites, and special locations. Hiking trails display on raised lines with difficulty-based coloring. Historical Blackfoot trade routes are illustrated with trade good icons. Mountains and key locations include button-activated LEDs, with legends in English, French, and Blackfoot languages.",
      category: "Government",
      scale: "1:17,500",
      year: "2021",
      location: "Alberta",
      sortOrder: 2,
      featured: true,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-3.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-2.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-9.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-5.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/WT-4.jpg",
      ],
    },
    {
      title: "Waterton Lakes: Environmental Awareness",
      slug: "waterton-environmental",
      description:
        "Our first Luminous Cartograph is on display at the Waterton Lakes visitor centre. This is a special kind of map which provides a visual representation of the dynamic landscape. The map features seven visualizations showing elevation, geological strata, light and shadow movement throughout the day, a historical wildfire, simulated thunderstorms, and seasonal representations. Visitors interact with the display via touchscreen interface.",
      category: "Government",
      scale: "1:9,000",
      year: "2021",
      location: "Alberta",
      sortOrder: 3,
      featured: true,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2023/10/EA6B.webp",
        "https://tactileterrain.ca/wp-content/uploads/2022/04/EAV1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/EA4.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/04/EAV2.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/04/EAV4.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/04/EAV3.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/04/EAV6.jpg",
      ],
    },
    {
      title: "Ukkusiksalik National Park",
      slug: "ukkusiksalik",
      description:
        "A set of three similar map installations were produced for Ukkusiksalik National Park in the Canadian Arctic. These maps serve to make the park familiar to visitors and to the members of nearby communities. The park boundary is emphasized with raised lines and paint, while key historic and cultural sites feature icons. One installation includes four discovery drawers displaying zoomed high-resolution maps of significant areas, accompanied by signage documenting Inuit heritage stories.",
      category: "Government",
      scale: "1:125,000",
      year: "2021",
      location: "Nunavut",
      sortOrder: 4,
      featured: false,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2023/09/UNP-32.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/nar-unp.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/UNP7-1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/UNP6-1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/UNP5-1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/UNP3.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/UNP8-crop.jpg",
      ],
    },
    {
      title: "Southern Gulf Islands",
      slug: "southern-gulf-islands",
      description:
        "This combined topographic/bathymetric map was created for conservancy group IMERSS. The featured location is the Southern Gulf Islands, an area between Vancouver Island and Vancouver. The region features intense geologic activity with compression and folding creating an archipelago of elongated islands. These islands and submarine topographies generate diverse habitats resulting in significant biodiversity and complex ecosystems. IMERSS uses this map to promote environmental awareness and conservation efforts.",
      category: "Conservation",
      scale: "1:50,000",
      year: "2021",
      location: "British Columbia",
      sortOrder: 5,
      featured: false,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI7.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI61.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI51.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI41.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI31.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI21.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/08/SGI11.jpg",
      ],
    },
    {
      title: "Great Bear Lake",
      slug: "great-bear-lake",
      description:
        "This circular 3D topographic map features the eighth largest lake in the world, home to the Délinę people. The map design reflects the cosmology of the Délinę, centred on this vast and abundant lake. Lake bottom bathymetry is illustrated, with embedded lights connected to push buttons labeled in the Dene language, creating a linguistic cartography of the region.",
      category: "Government",
      scale: "1:500,000",
      year: "2020",
      location: "Northwest Territories",
      sortOrder: 6,
      featured: false,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2023/09/GB-3-21.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/09/GB-close1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/GB4.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/GB2.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/09/GB-sign1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/GB5.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2022/02/GB6.jpg",
      ],
    },
    {
      title: "Rouge Urban National Park",
      slug: "rouge-urban",
      description:
        "This tactile map features Rouge Urban National Park and Toronto, connecting people with nature. Each park corner displays a different season with distinctive paint styles marking the park boundary. Transport networks like roads, railways, and subways are brightly coloured to show travel routes between city and green space. Transit stops and key locations have surface-built markers. Seven embedded Blanding's turtle models create an interactive game for children. The large map is housed in wheeled cabinets for easy event transportation.",
      category: "Government",
      scale: "1:17,000",
      year: "2019",
      location: "Ontario",
      sortOrder: 7,
      featured: false,
      images: [
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP19.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP17.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/PD-PM1.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP2.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP16.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP6.jpg",
        "https://tactileterrain.ca/wp-content/uploads/2023/06/RUNP13.jpg",
      ],
    },
    {
      title: "'Namgis Territory",
      slug: "namgis-territory",
      description:
        "A 3D topographic map depicting the traditional territory of the 'Namgis First Nation in British Columbia. This project showcases the relationship between Indigenous communities and their ancestral landscapes through detailed cartographic representation.",
      category: "Government",
      scale: null,
      year: null,
      location: "British Columbia",
      sortOrder: 8,
      featured: false,
      images: [],
    },
    {
      title: "Mount Baker",
      slug: "mount-baker",
      description:
        "A 3D topographic model of Mount Baker, the prominent stratovolcano in Washington State's North Cascades. This map captures the dramatic glaciated peak and surrounding alpine terrain.",
      category: "Personal",
      scale: null,
      year: null,
      location: "Washington",
      sortOrder: 9,
      featured: false,
      images: [],
    },
    {
      title: "Wells Gray Park",
      slug: "wells-gray-park",
      description:
        "A 3D topographic map of Wells Gray Provincial Park in British Columbia, known for its spectacular waterfalls, volcanic formations, and diverse wilderness landscapes.",
      category: "Personal",
      scale: null,
      year: null,
      location: "British Columbia",
      sortOrder: 10,
      featured: false,
      images: [],
    },
    {
      title: "Earth's Moon",
      slug: "earths-moon",
      description:
        "An extraterrestrial topographic model depicting the surface of Earth's Moon. This unique piece extends Tactile Terrain's craft beyond our planet, applying the same precision fabrication techniques to lunar terrain data.",
      category: "Installation",
      scale: null,
      year: null,
      location: null,
      sortOrder: 11,
      featured: false,
      images: [],
    },
  ];

  for (const item of galleryData) {
    const { images, ...itemData } = item;

    const existing = await prisma.galleryItem.findUnique({
      where: { slug: item.slug },
    });

    if (existing) {
      console.log(`  Skipping existing: ${item.title}`);
      continue;
    }

    await prisma.galleryItem.create({
      data: {
        ...itemData,
        images: {
          create: images.map((url, i) => ({
            url,
            alt: item.title,
            sortOrder: i,
          })),
        },
      },
    });
    console.log(`  Created: ${item.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
