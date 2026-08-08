/*
  Homepage content that changes regularly lives here.
  Calendar events are fetched from the public Google Calendar and rendered in
  the site's own agenda design. The fallback list appears until an API key is set.
*/
window.SITE_CONTENT = {
  calendar: {
    calendarId: "5df7184f0eb2cf122c618937370cf448a74330c18399ea14f7088be8ac8164ce@group.calendar.google.com",
    apiKey: "AIzaSyDA7U5CEOMxOAtmtGlbNJnUHxnmYl4SpGo",
    timeZone: "America/New_York",
    maxEvents: 4,
    subscribeUrl: "https://calendar.google.com/calendar/embed?src=5df7184f0eb2cf122c618937370cf448a74330c18399ea14f7088be8ac8164ce%40group.calendar.google.com&ctz=America%2FNew_York",
    fallbackEvents: [
      {
        start: "2026-08-13T19:00:00-04:00",
        title: "DMV Social",
        location: "Shotted Specialty Coffee · Tysons Galleria",
        note: "",
        url: "mailto:cmumuslimalumni@gmail.com?subject=DMV%20Social"
      }
    ]
  },
  highlights: [
    {
      image: "assets/Gallery Pics/MAN@CMU Launch_table.jpg",
      alt: "Muslim Alumni Network Carnival Launch table display in Pittsburgh",
      label: "Pittsburgh · April 2026",
      title: "MAN @ CMU Launch"
    },
    {
      image: "assets/Gallery Pics/IMG_6160.JPEG",
      alt: "Community members gathered in front of the Community Iftar 2025 display",
      label: "From campus · 2025",
      title: "Community Iftar"
    },
    {
      image: "assets/Gallery Pics/eid_2024.JPEG",
      alt: "Students and community members gathered outdoors for Eid in Pittsburgh",
      label: "From campus · 2024",
      title: "Eid together in Pittsburgh"
    },
    {
      image: "assets/Gallery Pics/community_iftar_2023.JPEG",
      alt: "A full room of guests sharing a community iftar meal",
      label: "From campus · 2023",
      title: "Community Iftar"
    }
  ]
};
