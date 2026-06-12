import { ShuttleRoute } from './types';

export const SHUTTLE_ROUTES: ShuttleRoute[] = [
  {
    id: 'banff-louise-moraine',
    source: 'Banff',
    destination: 'Lake Louise & Moraine Lake',
    oneWayPrice: 105,
    roundTripPrice: 105,
    durationMinutes: 75,
    features: [
      'Dual Lake Golden Pass',
      'Complimentary Cabin Wi-Fi',
      'Professional Moraine GO Tours Driver',
      'Luggage & Hiking Gear Bays',
      'Pre-reserved Access Guaranteed'
    ],
    schedule: ['07:00 AM', '08:00 AM', '09:00 AM', '01:00 PM', '02:00 PM'],
    description: 'The ultimate adventure route. Drive from Banff to Lake Louise, seamlessly connect onward to iconic Moraine Lake, and return at your preferred time. Perfect for exploring both jewels.'
  },
  {
    id: 'banff-wildlife-tour',
    source: 'Banff',
    destination: 'Banff Area Evening Wildlife Tour',
    oneWayPrice: 85,
    roundTripPrice: 85,
    durationMinutes: 180, // 3 hours
    features: [
      '3-Hour Dusk Wildlife Safari',
      'Expert Guide & Wildlife Biologist',
      'Door-to-door Banff Hotel Pick-up',
      'High-zoom spotter scopes included',
      'Small-group 14-passenger luxury comfort'
    ],
    schedule: ['06:30 PM'],
    description: 'Track majestic bears, elk, deer, and bighorn sheep at active feeding hours. Learn professional animal behavior narratives with high-definition optical scopes.'
  }
];

export const POPULAR_DESTINATIONS = [
  {
    title: 'Moraine Lake',
    tagline: 'The Jewel of the Rockies',
    description: 'World-famous for its raw turquoise hue and spectacular Valley of the Ten Peaks backdrop. The road is restricted only to permitted commercial transit, making Moraine Go your ticket to this natural wonder.',
    highlights: ['The Rockpile Trail (Panoramic lake vista)', 'Sentinel Pass Trail & Larch Valley', 'Canoeing under the Ten Peaks'],
    altitude: '1,885 meters (6,184 feet)'
  },
  {
    title: 'Lake Louise',
    tagline: 'Lake of the Little Fishes',
    description: 'Renowned globally for its dramatic peaks, sweeping Victoria Glacier backdrop, and the magnificent Fairmont Chateau. Offering premier lakeside trails, horseback riding, and winter ice skating.',
    highlights: ['Lake Agnes Teahouse Walk', 'Plain of Six Glaciers Trail', 'Lakeside Shoreline Trail (Easy, accessible)'],
    altitude: '1,731 meters (5,680 feet)'
  },
  {
    title: 'Banff National Park',
    tagline: 'Canada’s First Sanctuary',
    description: 'Established in 1885, this is Canada’s first and most famous national park. Encompassing majestic mountain ranges, steaming hot springs, dense wildlife sanctuaries, and cozy historical retail zones.',
    highlights: ['Banff Townsite & Cascade Mountain', 'Bow Falls & Sulphur Mountain Gondola', 'Johnston Canyon Upper & Lower Waterfalls'],
    altitude: '1,383 meters (Banff Town Center)'
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Comfortable & Reliable Transport',
    desc: 'Travel in modern, air-conditioned 14-seater luxury Mercedes Sprinters & coaches with complimentary high-speed Wi-Fi and ample gear storage.'
  },
  {
    title: 'Affordable, Transparent Pricing',
    desc: 'No bidding wars, no surge pricing, and no tourist extortion. Flat-rate tickets with discounts for families and group returns.'
  },
  {
    title: 'Professional Mountain Host Service',
    desc: 'All our drivers are certified Rockies guides ready to brief you on local stories, wildlife, trails, weather alerts, and lookouts.'
  },
  {
    title: 'Convenient Pick-up Schedules',
    desc: 'Departing hourly from dawn to dusk, allowing high flexibility for photographers, mountaineers, hikers, and casual sightseers.'
  }
];

export const DISCOVER_BANFF_TOURS_COPIES = {
  aboutHeadline: "Double Lake Explorer Shuttle Services",
  aboutParagraph: "We curate premium, reliable transportation designed to connect you smoothly from the Town of Banff to the shores of both Lake Louise and Moraine Lake. Avoid parking blockades, bypass complex rules, and lock in automatic same-day return pickups with our signature 4.5-hour double lake itinerary."
};
