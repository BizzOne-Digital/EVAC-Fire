// Single source of truth for page copy. Service, About and process wording follows the client brief.
import type { ServiceValue } from './inquiry'

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`
const local = (id: string) => `/Gemini_Generated_Image_${id}.jpg`

export type Img = { src: string; alt: string }

export const images = {
  hero: { src: local('kq1n8qkq1n8qkq1n'), alt: '' },
  stair: { src: local('wli4zfwli4zfwli4'), alt: 'Fire warden with a clipboard as staff evacuate along a corridor toward the exit' },
  tower: { src: local('lzhwcjlzhwcjlzhw'), alt: 'Staff assisting residents along a care facility corridor toward the exit' },
  aboutIntro: { src: local('hhgixohhgixohhgi'), alt: '' },
  servicesIntro: { src: local('1y5wbz1y5wbz1y5w'), alt: '' },
  blogsIntro: { src: local('9ola8a9ola8a9ola'), alt: '' },
  contactIntro: { src: local('wli4zfwli4zfwli4'), alt: '' },
} satisfies Record<string, Img>

export const about = {
  name: 'About EVAC Fire & Safety',
  heading: 'We Make Fire Safety Simple and Evacuation Second Nature.',
  intro:
    'At EVAC Fire & Safety, we help property managers, business owners, and facility operators turn fire safety requirements into clear, usable plans.',
  specialty:
    'We specialize in custom fire safety plans, supervised fire drills, hands-on fire safety training, and expert consultation.',
  whyLabel: 'Why EVAC?',
  why: "Because a binder on the wall doesn't evacuate a building — people do.",
  whyBody: [
    'Every plan we create is built for the moment you need to evacuate: clear language, visual layouts, and procedures your staff can actually remember under pressure.',
    'We develop each plan to align with current National and Provincial Fire Code requirements and prepare it to meet the standards of your local fire department.',
  ],
  noShortcuts: 'No generic templates, no shortcuts.',
  /** About page "Why" section (client copy, Sept 2026). The home page keeps the fields above. */
  whyFire: {
    title: 'Why Evac Fire?',
    body: [
      'Every plan we create is built for the moment you need to evacuate — clear language, visual layouts, and procedures your staff can actually remember under pressure.',
      'We develop each plan to align with current National and Provincial Fire Code requirements and prepare it to meet the standards of your local fire department and your Authority Having Jurisdiction.',
      'Founded on the people side of fire safety, Evac Fire brings over 18 years of combined experience across fire service and fire protection. Our approach combines front-line operational experience with fire protection engineering best practices, backed by professional certification.',
      'Our clients rely on us for practical plans that are usable in an emergency, clear communication, flexible scheduling, and ongoing support as buildings, staff, and requirements change.',
    ],
  },
  missionLead: 'Our mission is simple:',
  mission: 'help buildings meet requirements and help people get out safely when every second counts.',
}

export const approach = [
  {
    title: 'Clear & Aligned',
    body: [
      'Custom-built for your building and developed to align with current Fire Code requirements.',
      'Prepared in the format your local Authority Having Jurisdiction expects to review.',
    ],
  },
  {
    title: 'Practical & Hands-On',
    body: [
      "We don't just hand you a plan.",
      'We run realistic, supervised fire drills with timed evacuation reporting and deliver hands-on training for supervisory staff, fire wardens, and extinguisher use.',
    ],
  },
  {
    title: 'Supportive & Straightforward',
    body: [
      'From initial site review to plan updates and inspection prep, we explain what you need in plain language and stay available when buildings, tenants, or requirements change.',
    ],
  },
]

export const servicesIntro = {
  label: 'OUR SERVICES',
  heading: 'Fire Safety. Emergency Preparedness. People Protected.',
  body: [
    'At EVAC FIRE, we help businesses, property managers, building owners, and organizations prepare for fire emergencies and maintain a safe environment for occupants.',
    'From developing a practical Fire Safety Plan to conducting realistic fire drills and providing hands-on training, our services are designed to help you plan, prepare, and evacuate with confidence.',
  ],
}

export type Service = {
  slug: ServiceValue
  number: string
  title: string
  eyebrow?: string
  lead: string
  summary: string
  body: string[]
  listTitle: string
  list: string[]
  cta: string
  image: Img
  /** Copy shown after the list. */
  closing?: string
}

export const services: Service[] = [
  {
    slug: 'fire-safety-plan',
    number: '01',
    title: 'Fire Safety Plans',
    lead: 'A Plan Is Only Useful When People Know What To Do.',
    summary: 'Practical plans tailored to your building, business, and occupants.',
    body: [
      'We develop and maintain practical Fire Safety Plans tailored to the specific needs of your building, business, and occupants.',
      'Our plans are designed to meet applicable fire-safety requirements and help you meet your fire-safety obligations, with a focus on being clear, practical, and usable during an emergency—not simply documents that sit in a binder.',
    ],
    listTitle: 'Our plans can address:',
    list: [
      'Emergency procedures and evacuation protocols',
      'Building and site information',
      'Fire department access and emergency response information',
      'Fire alarm procedures',
      'Evacuation responsibilities',
      'Roles and responsibilities of supervisory staff',
      'Procedures for occupants who may require assistance',
      'Emergency contact information',
      'Fire prevention and safety procedures',
      'Procedures for responding to fire emergencies',
      'Required documentation and supporting information',
    ],
    cta: 'Request a fire safety plan',
    image: { src: local('hhgixohhgixohhgi'), alt: 'Modern commercial building at dusk with an illuminated exit sign by the entrance' },
  },
  {
    slug: 'fire-drill',
    number: '02',
    title: 'Fire Drills',
    lead: 'Don’t Just Have an Evacuation Plan. Practice It.',
    summary: 'Coordinated, supervised drills designed around your building and procedures.',
    body: [
      'A fire drill gives your staff and occupants the opportunity to practice what they should do during an actual emergency.',
      'EVAC FIRE can coordinate and supervise fire drills designed around your building and emergency procedures.',
      'The goal is simple: when the alarm sounds, people should know what to do and how to evacuate safely.',
    ],
    listTitle: 'Our drill services can include:',
    list: [
      'Pre-drill planning and coordination',
      'Staff and occupant preparation',
      'Evacuation procedure review',
      'Drill supervision',
      'Observation of evacuation procedures',
      'Identification of potential deficiencies',
      'Post-drill debriefing',
      'Recommendations for improvement',
      'Documentation of the drill',
    ],
    cta: 'Schedule a fire drill',
    image: { src: local('e96fnje96fnje96f'), alt: 'Fire warden recording a supervised evacuation drill as staff walk toward the exit' },
  },
  {
    slug: 'fire-safety-training',
    number: '03',
    title: 'Fire Safety Training',
    eyebrow: '— Online or In-Person',
    lead: 'Give Your Team the Knowledge to Respond and to Inspect.',
    summary: 'Practical training for staff and designated personnel — online or in person.',
    body: [
      'Fire safety isn’t just about equipment. People are an essential part of your emergency response.',
      'Our practical training helps employees, supervisors, building staff, and designated personnel understand their responsibilities before and during a fire emergency, including how to inspect and maintain critical equipment.',
    ],
    listTitle: 'Training can cover:',
    list: [
      'Fire prevention and fire hazards in the workplace',
      'Emergency procedures and evacuation procedures',
      'How to respond when a fire is discovered or the alarm activates',
      'Roles and responsibilities during an emergency',
      'Fire extinguisher awareness, use, and how to perform visual inspections and document monthly checks',
      'Fire alarm procedures — components, daily and weekly checks, and what to report',
      'Emergency lighting and exit signs — how to perform functional checks and identify deficiencies',
      'Post-emergency procedures',
    ],
    closing: 'Training is tailored to your organization and can be delivered online or in person as an optional, standalone service.',
    cta: 'Book fire safety training',
    image: { src: local('1d0tqz1d0tqz1d0t'), alt: 'Instructor demonstrating a fire extinguisher to a group of staff' },
  },
  {
    slug: 'expert-consultation',
    number: '04',
    title: 'Expert Consultation',
    lead: 'Clear guidance for your next step.',
    summary: 'Plain-language guidance on planning, updates, and preparing for inspections.',
    body: [
      'Not sure where to start, or what has changed since your plan was written? We help property managers, building owners, facility operators, and businesses understand what their building needs.',
      'From initial site review to plan updates and inspection preparation, we explain the next steps in plain language and stay available when buildings, tenants, or requirements change.',
    ],
    listTitle: 'Consultation can help with:',
    list: [
      'Initial site review and preparedness conversations',
      'Understanding what your building and occupants need',
      'Updating plans when buildings, tenants, or requirements change',
      'Preparing for fire department inspections',
    ],
    cta: 'Request a consultation',
    image: { src: unsplash('1503387837-b154d5074bd2'), alt: 'Two people reviewing building plans at a desk' },
  },
]

export const serviceBySlug = (slug: string) => services.find(s => s.slug === slug)

export const processSection = {
  heading: 'From Planning to Preparation to Practice.',
  stages: [
    { step: 'PLAN', text: 'Fire Safety Plans designed around your building and occupants.', service: 'fire-safety-plan' },
    { step: 'PREPARE', text: 'Practical fire safety training for your staff, including how to inspect and maintain critical equipment.', service: 'fire-safety-training' },
    { step: 'PRACTICE', text: 'Supervised fire drills that put your emergency procedures into action.', service: 'fire-drill' },
  ] satisfies { step: string; text: string; service: ServiceValue }[],
  title: ['ONE COMPANY.', 'ONE SAFETY PLAN.'],
  payoff: ['WHEN IT’S TIME TO EVACUATE,', 'BE READY.'],
}

export const audiences = [
  { title: 'Property & building management', items: ['Property managers', 'Property management companies with multiple buildings', 'Condominium corporations', 'Building owners & commercial landlords'] },
  { title: 'Business owners', items: ['Offices', 'Retail', 'Restaurants', 'Clinics', 'Warehouses'] },
  { title: 'Facilities & operations', items: ['Facility managers', 'Operations managers'] },
  { title: 'Education & community', items: ['Schools', 'Daycares', 'Places of worship', 'Community centres'] },
  { title: 'Care & residential', items: ['Retirement homes', 'Care facilities', 'Group homes'] },
]

type Block = { h2: string } | { p: string } | { ul: string[] }

export type Post = {
  slug: string
  category: string
  title: string
  excerpt: string
  image: Img
  service: ServiceValue
  /** ISO date. Leave undefined until the client confirms a publish date; no date is shown. */
  published?: string
  body: Block[]
}

export const posts: Post[] = [
  {
    slug: 'why-practice-matters',
    category: 'Fire drills',
    title: 'Why practicing an evacuation plan matters',
    excerpt: 'A plan becomes useful when the people it is written for have had a chance to practice it.',
    image: { src: local('9ola8a9ola8a9ola'), alt: 'Teachers leading students through a school corridor during an evacuation drill' },
    service: 'fire-drill',
    body: [
      { p: 'Most buildings have an evacuation plan. Far fewer have people who could follow it confidently with an alarm sounding, lights flashing, and no time to read instructions. That gap is exactly what a fire drill is designed to close.' },
      { h2: 'A plan on paper is not a plan in practice' },
      { p: 'Under pressure, people fall back on what is familiar. If the only time staff have seen the evacuation procedure is during onboarding, they are likely to hesitate, head for the entrance they use every day, or wait for someone else to take charge.' },
      { p: 'Practice turns written procedures into familiar actions. When occupants have already walked the route, heard the alarm, and gathered at the meeting point, the real event feels less unfamiliar.' },
      { h2: 'What a drill can reveal' },
      { p: 'A well-observed drill often surfaces issues that are hard to see from a floor plan:' },
      { ul: ['Staff who are unsure of their roles or who to report to', 'Routes that are slower or more congested than expected', 'Areas where the alarm is difficult to hear', 'Occupants who may need assistance and do not yet have a clear procedure', 'Gaps between what the plan says and what people actually do'] },
      { h2: 'Making a drill worth the time' },
      { p: 'A drill is most useful when it is planned, observed, and followed up. That means coordinating in advance, preparing staff and occupants, watching how the evacuation actually unfolds, and debriefing afterwards so recommendations can be acted on and the plan updated where needed.' },
      { p: 'Documenting each drill also builds a record of how your building is improving over time.' },
    ],
  },
  {
    slug: 'fire-warden-responsibilities',
    category: 'Training',
    title: 'The role of a fire warden during an emergency',
    excerpt: 'Clear roles help teams move from uncertainty to coordinated action.',
    image: { src: local('1y5wbz1y5wbz1y5w'), alt: 'Fire warden supervising staff as they evacuate along a corridor' },
    service: 'fire-safety-training',
    body: [
      { p: 'In an emergency, a few people with clearly assigned responsibilities can make the difference between a hesitant evacuation and a coordinated one. In many buildings, those people are fire wardens and supervisory staff.' },
      { h2: 'Roles come from your fire safety plan' },
      { p: "A warden's exact responsibilities depend on the building and are set out in its fire safety plan. That is why the plan, and training on it, matters: wardens should know precisely what is expected of them before an alarm ever sounds." },
      { h2: 'Responsibilities wardens are often assigned' },
      { ul: ['Knowing the building layout, exits, and designated meeting points', 'Directing occupants toward the nearest safe exit', 'Checking assigned areas when it is safe to do so', 'Following the plan’s procedures for occupants who may require assistance', 'Reporting to the designated person once their area is clear', 'Passing on relevant information to arriving emergency responders through the designated contact'] },
      { h2: 'Training turns a title into confidence' },
      { p: 'Being named a warden is not the same as being prepared. Practical training helps wardens understand their responsibilities, rehearse what they will do, and recognize issues worth reporting during routine checks.' },
      { p: 'Wardens should always follow their building’s fire safety plan and the direction of the fire department.' },
    ],
  },
  {
    slug: 'building-a-useful-plan',
    category: 'Fire safety plans',
    title: 'What makes a fire safety plan useful?',
    excerpt: 'The strongest plans are clear, current, and written for the building they serve.',
    image: { src: local('hhgixohhgixohhgi'), alt: 'Modern commercial building at dusk' },
    service: 'fire-safety-plan',
    body: [
      { p: 'A fire safety plan has two audiences: the people who review it, and the people who will rely on it during an emergency. A useful plan serves both.' },
      { h2: 'Written for the building it serves' },
      { p: 'Generic templates rarely reflect how a specific building is laid out, who occupies it, or how its fire protection systems are arranged. A useful plan starts with the real building: its site, access for the fire department, its alarm procedures, and its occupants.' },
      { h2: 'Clear enough to use under pressure' },
      { p: 'Plain language, visual layouts, and well-defined roles make procedures easier to remember. Supervisory staff should be able to find their responsibilities quickly and understand them without interpretation.' },
      { h2: 'Qualities of a plan people can actually use' },
      { ul: ['Clear emergency and evacuation procedures', 'Defined roles and responsibilities for supervisory staff', 'Procedures for occupants who may require assistance', 'Accurate building, site, and emergency contact information', 'Supporting documentation kept organized and current'] },
      { h2: 'Kept current and practiced' },
      { p: 'Buildings change. Tenants move, layouts are renovated, and staff turn over. A plan should be reviewed when those changes happen, and practiced through drills so that the written procedures and real behavior stay aligned.' },
    ],
  },
]

export const postBySlug = (slug: string) => posts.find(p => p.slug === slug)

export function readingMinutes(post: Post) {
  const text = post.body.map(b => ('p' in b ? b.p : 'h2' in b ? b.h2 : b.ul.join(' '))).join(' ')
  return Math.max(1, Math.round(text.split(/\s+/).length / 200))
}
