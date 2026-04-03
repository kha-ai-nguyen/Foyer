import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const venues = [
  {
    name: 'Quo Vadis',
    neighbourhood: 'Soho',
    capacity_min: 20,
    capacity_max: 40,
    price_estimate: '£95/head',
    event_types: ['Corporate', 'Wedding'],
    description:
      'A Soho institution since 1926, Quo Vadis offers intimate private dining rooms above the celebrated restaurant. Dark wood panelling, original artwork, and impeccable service make it a favourite for discreet corporate lunches and anniversary dinners.',
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    ],
    website: 'https://quovadissoho.co.uk',
  },
  {
    name: 'Hide',
    neighbourhood: 'Mayfair',
    capacity_min: 40,
    capacity_max: 80,
    price_estimate: '£120/head',
    event_types: ['Corporate', 'Exhibition'],
    description:
      'Spread across three floors overlooking Green Park, Hide is one of London\'s most visually stunning venues. The sweeping oak staircase and floor-to-ceiling windows create a dramatic backdrop for product launches, brand dinners, and exclusive receptions.',
    photos: [
      'https://images.unsplash.com/photo-1555396273-b6b79d4b1a7f?w=800&q=80',
    ],
    website: 'https://hide.co.uk',
  },
  {
    name: 'Brat',
    neighbourhood: 'Shoreditch',
    capacity_min: 20,
    capacity_max: 50,
    price_estimate: '£70/head',
    event_types: ['Party', 'Workshop'],
    description:
      'Michelin-starred Brat brings the spirit of a Basque asador to Shoreditch. Wood-fired cooking, natural wines, and a relaxed industrial atmosphere make it a brilliant choice for creative team away-days, birthday suppers, and informal celebrations.',
    photos: [
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80',
    ],
    website: 'https://bratrestaurant.com',
  },
  {
    name: 'Native at Browns',
    neighbourhood: 'Mayfair',
    capacity_min: 30,
    capacity_max: 60,
    price_estimate: '£85/head',
    event_types: ['Wedding', 'Corporate'],
    description:
      'Nestled inside the iconic Browns fashion house on South Molton Street, Native brings hyper-seasonal British cooking to one of Mayfair\'s most architecturally striking spaces. Exposed brick, natural materials, and a garden courtyard create an atmosphere unlike anywhere else in London.',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    ],
    website: 'https://eatnative.co.uk',
  },
  {
    name: 'Coal Rooms',
    neighbourhood: 'Peckham',
    capacity_min: 50,
    capacity_max: 120,
    price_estimate: '£55/head',
    event_types: ['Party', 'Workshop', 'Exhibition'],
    description:
      'Set in the Grade II-listed Victorian coal office at Peckham Rye station, Coal Rooms is a raw, characterful space perfect for large parties, creative workshops, and art exhibitions. Exposed ironwork, original signage, and an open fire pit define the industrial aesthetic.',
    photos: [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80',
    ],
    website: 'https://coalrooms.com',
  },
]

async function seed() {
  console.log('Seeding venues...')
  const { data, error } = await supabase.from('venues').insert(venues).select()
  if (error) {
    console.error('Error seeding venues:', error.message)
    process.exit(1)
  }
  console.log(`✅ Inserted ${data.length} venues:`)
  data.forEach((v: { name: string; id: string }) => console.log(`  - ${v.name} (${v.id})`))
}

seed()
