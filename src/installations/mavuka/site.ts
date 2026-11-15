export const siteConfig = {
  brand: 'Mavuka People Advisory',
  hero: { title: 'Where People, Business and Technology Move Forward Together.', subtitle: 'Strategic consulting that helps organisations navigate change, strengthen people capabilities and build sustainable growth.' },
  navigation: [{ label:'Home', type:'home' }, { label:'Quick Info & Action', type:'home', category:'quick-action' }, { label:'Articles', type:'articles' }, { label:'Contact Us', type:'contact' }],
  cards: [
    { title:'Explore Our Services', description:'Discover how Mavuka can support your organisation.', question:'What consultancy services does Mavuka People Advisory provide?', type:'general', category:'people-advisory' },
    { title:'People & HR Advisory', description:'Find solutions for people, leadership and HR challenges.', question:'How can Mavuka help improve our human capital strategy?', type:'summary', category:'people-advisory' },
    { title:'Business Transformation', description:'Explore organisational change and business improvement.', question:'How can Mavuka support our organisational transformation?', type:'analysis', category:'business-transformation' },
    { title:'Digital Change', description:'Prepare your people and organisation for technology-driven change.', question:'How can Mavuka support digital transformation and technology adoption?', type:'general', category:'digital-change' }
  ],
  niches: ['Fractional HC Leadership', 'People & Culture Transformation', 'HR Function Optimisation', 'Organisational Design & Operating Model', 'Recruitment Services', 'HR Practice Management Setup'],
  contact: { email:'info@mavukapeople.co.za', phone:'+27 72 296 3758' }
} as const;
